

// import { Server, Socket } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import Message from '../models/Message';

// export function initializeSocket(io: Server): void {
//   // Auth middleware for socket
//   io.use((socket: Socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error('Authentication required'));
//     }
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
//       (socket as any).user = decoded;
//       next();
//     } catch {
//       next(new Error('Invalid token'));
//     }
//   });

//   io.on('connection', (socket: Socket) => {
//     const user = (socket as any).user;
//     console.log(`User connected: ${user.id}`);

//     // Join user's personal room for notifications
//     socket.join(`user:${user.id}`);

//     // Join a chat room
//     socket.on('join:room', (chatRoomId: string) => {
//       socket.join(`room:${chatRoomId}`);
//       console.log(`User ${user.id} joined room ${chatRoomId}`);
//     });

//     // Leave a chat room
//     socket.on('leave:room', (chatRoomId: string) => {
//       socket.leave(`room:${chatRoomId}`);
//     });

//     // Send message
//     socket.on('message:send', async (data: { chatRoomId: string; content: string }) => {
//       try {
//         const messageDoc = await Message.create({
//           chatRoomId: data.chatRoomId,
//           senderId: user.id,
//           content: data.content,
//         });
        
//         const message = await Message.findById(messageDoc._id).populate('sender', 'name avatar');
//         io.to(`room:${data.chatRoomId}`).emit('message:new', message);
//       } catch (error) {
//         socket.emit('error', { message: 'Failed to send message' });
//       }
//     });

//     // Typing indicator
//     socket.on('typing:start', (chatRoomId: string) => {
//       socket.to(`room:${chatRoomId}`).emit('typing:start', { userId: user.id, name: user.name });
//     });

//     socket.on('typing:stop', (chatRoomId: string) => {
//       socket.to(`room:${chatRoomId}`).emit('typing:stop', { userId: user.id });
//     });

//     // Mark messages as seen
//     socket.on('message:seen', async (data: { chatRoomId: string }) => {
//       try {
//         await Message.updateMany(
//           {
//             chatRoomId: data.chatRoomId,
//             senderId: { $ne: user.id },
//             seenAt: { $exists: false },
//           },
//           { seenAt: new Date() }
//         );
//         socket.to(`room:${data.chatRoomId}`).emit('message:seen', { userId: user.id });
//       } catch (error) {
//         console.error('Error marking messages as seen:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${user.id}`);
//     });
//   });
// }




















import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User';
import ChatRoom from '../models/ChatRoom';
import Message from '../models/Message';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    name?: string;
  };
}

const activeSockets = new Map<string, Set<string>>();

export function initializeSocket(io: Server): void {
  // Authenticate socket using JWT
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as { id?: string; _id?: string; name?: string };

      const userId = decoded.id || decoded._id;

      if (!userId) {
        return next(new Error('Invalid token payload'));
      }

      socket.user = {
        id: userId,
        name: decoded.name,
      };

      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (rawSocket: Socket) => {
    const socket = rawSocket as AuthenticatedSocket;
    const userId = socket.user!.id;

    console.log(`User connected: ${userId}`);

    // Track multiple tabs/devices for the same user
    let sockets = activeSockets.get(userId);

    if (!sockets) {
      sockets = new Set<string>();
      activeSockets.set(userId, sockets);
    }

    sockets.add(socket.id);

    socket.join(`user:${userId}`);

    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      const rooms = await ChatRoom.find({
        participants: userId,
      }).select('_id');

      // Notify people sharing chats with this user
      for (const room of rooms) {
        io.to(`room:${room._id}`).emit('presence:update', {
          userId,
          isOnline: true,
          lastSeenAt: null,
        });
      }
    } catch (error) {
      console.error('Online status update error:', error);
    }

    // Join a chat room after verifying membership
    socket.on('join:room', async (chatRoomId: string) => {
      try {
        if (!mongoose.isValidObjectId(chatRoomId)) return;

        const room = await ChatRoom.findById(chatRoomId);

        if (!room) return;

        const isParticipant = room.participants.some(
          (participant: any) => participant.toString() === userId
        );

        if (!isParticipant) {
          socket.emit('error', {
            message: 'Not a participant in this chat room',
          });
          return;
        }

        socket.join(`room:${chatRoomId}`);

        // Tell the joining user the other participant's presence
        const participants = await User.find({
          _id: { $in: room.participants },
        }).select('_id name isOnline lastSeenAt');

        for (const participant of participants) {
          if (participant._id.toString() === userId) continue;

          socket.emit('presence:update', {
            userId: participant._id.toString(),
            isOnline: participant.isOnline,
            lastSeenAt: participant.lastSeenAt,
          });
        }

        // Mark messages addressed to this user as delivered
        const pendingMessages = await Message.find({
          chatRoomId,
          senderId: { $ne: userId },
          deliveredAt: null,
        }).select('_id');

        if (pendingMessages.length > 0) {
          const deliveredAt = new Date();

          await Message.updateMany(
            {
              _id: { $in: pendingMessages.map((message) => message._id) },
            },
            { $set: { deliveredAt } }
          );

          for (const message of pendingMessages) {
            io.to(`room:${chatRoomId}`).emit('message:delivered', {
              chatRoomId,
              messageId: message._id.toString(),
              deliveredAt,
            });
          }
        }
      } catch (error) {
        console.error('Join room error:', error);
      }
    });

    socket.on('leave:room', (chatRoomId: string) => {
      socket.leave(`room:${chatRoomId}`);
    });

    // Send message using Socket.IO
    socket.on(
      'message:send',
      async (data: { chatRoomId: string; content: string }) => {
        try {
          const { chatRoomId, content } = data;

          if (
            !chatRoomId ||
            !mongoose.isValidObjectId(chatRoomId) ||
            typeof content !== 'string' ||
            !content.trim()
          ) {
            socket.emit('error', { message: 'Invalid message data' });
            return;
          }

          const room = await ChatRoom.findById(chatRoomId);

          if (!room) {
            socket.emit('error', { message: 'Chat room not found' });
            return;
          }

          const isParticipant = room.participants.some(
            (participant: any) => participant.toString() === userId
          );

          if (!isParticipant) {
            socket.emit('error', { message: 'Not a participant' });
            return;
          }

          const messageDoc = await Message.create({
            chatRoomId,
            senderId: userId,
            content: content.trim(),
          });

          const message = await Message.findById(messageDoc._id).populate(
            'sender',
            'name avatar'
          );

          io.to(`room:${chatRoomId}`).emit('message:new', message);
        } catch (error) {
          console.error('Send socket message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    );

    // Typing indicator
    socket.on('typing:start', async (chatRoomId: string) => {
      try {
        const room = await ChatRoom.findById(chatRoomId);

        if (
          room &&
          room.participants.some(
            (participant: any) => participant.toString() === userId
          )
        ) {
          socket.to(`room:${chatRoomId}`).emit('typing:start', {
            userId,
            name: socket.user?.name,
          });
        }
      } catch (error) {
        console.error('Typing start error:', error);
      }
    });

    socket.on('typing:stop', (chatRoomId: string) => {
      socket.to(`room:${chatRoomId}`).emit('typing:stop', {
        userId,
      });
    });

    // Mark incoming messages as read
    socket.on('message:seen', async (data: { chatRoomId: string }) => {
      try {
        const { chatRoomId } = data;

        if (!mongoose.isValidObjectId(chatRoomId)) return;

        const room = await ChatRoom.findById(chatRoomId);

        if (
          !room ||
          !room.participants.some(
            (participant: any) => participant.toString() === userId
          )
        ) {
          return;
        }

        const unseenMessages = await Message.find({
          chatRoomId,
          senderId: { $ne: userId },
          seenAt: null,
        }).select('_id');

        if (unseenMessages.length === 0) return;

        const seenAt = new Date();

        await Message.updateMany(
          {
            _id: { $in: unseenMessages.map((message) => message._id) },
          },
          {
            $set: {
              seenAt,
              deliveredAt: seenAt,
            },
          }
        );

        io.to(`room:${chatRoomId}`).emit('message:seen', {
          userId,
          chatRoomId,
          messageIds: unseenMessages.map((message) => message._id.toString()),
          seenAt,
        });
      } catch (error) {
        console.error('Mark seen error:', error);
      }
    });

    // Disconnect and update last seen only when all tabs are disconnected
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);

      const userSockets = activeSockets.get(userId);

      if (!userSockets) return;

      userSockets.delete(socket.id);

      if (userSockets.size > 0) return;

      activeSockets.delete(userId);

      const lastSeenAt = new Date();

      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeenAt,
        });

        const rooms = await ChatRoom.find({
          participants: userId,
        }).select('_id');

        for (const room of rooms) {
          io.to(`room:${room._id}`).emit('presence:update', {
            userId,
            isOnline: false,
            lastSeenAt,
          });
        }
      } catch (error) {
        console.error('Offline status update error:', error);
      }
    });
  });
}