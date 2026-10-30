





import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Home,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { chatAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { getSocket } from '../lib/socket';
import { Message } from '../types';
import { format, isSameDay } from 'date-fns';

export default function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const [presence, setPresence] = useState<{
    isOnline: boolean;
    lastSeenAt: string | null;
  }>({
    isOnline: false,
    lastSeenAt: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: chatRoom, isLoading: roomLoading } = useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => chatAPI.getRoom(roomId!).then((r) => r.data),
    enabled: !!roomId,
  });

  const otherParticipant = chatRoom?.participants?.find(
    (participant: any) => participant.id !== user?.id
  );

  const listing = chatRoom?.interest?.listing;
  const listingTitle = listing?.title || 'Property conversation';
  const listingLocation = listing?.location;

  const participantName = otherParticipant?.name || 'Property Owner';
  const participantInitial = participantName.charAt(0).toUpperCase();

  const propertyLocationText =
    typeof listingLocation === 'string'
      ? listingLocation
      : listingLocation && typeof listingLocation === 'object'
        ? [
            (listingLocation as any).area,
            (listingLocation as any).city,
            (listingLocation as any).address,
          ].filter(Boolean).join(', ')
        : '';

  const presenceLabel = typingUser
    ? 'Typing a message...'
    : presence.isOnline
      ? 'Online'
      : presence.lastSeenAt
        ? `Last seen ${format(
            new Date(presence.lastSeenAt),
            'dd MMM, h:mm a'
          )}`
        : 'Offline';

  useEffect(() => {
    if (!otherParticipant) return;

    setPresence({
      isOnline: Boolean(otherParticipant.isOnline),
      lastSeenAt:
        otherParticipant.lastSeenAt ||
        otherParticipant.lastSeen ||
        null,
    });
  }, [
    otherParticipant?.id,
    otherParticipant?.isOnline,
    otherParticipant?.lastSeenAt,
    otherParticipant?.lastSeen,
  ]);

  useEffect(() => {
    if (!roomId) return;

    chatAPI
      .getMessages(roomId)
      .then((r) => setMessages(r.data.messages || r.data))
      .catch(() => {
        // Keep the chat available if initial message loading fails.
      });
  }, [roomId]);

  useEffect(() => {
    if (!token || !roomId) return;

    const socket = getSocket(token);

    socket.emit('join:room', roomId);

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      if (msg.senderId !== user?.id) {
        socket.emit('message:seen', { chatRoomId: roomId });
      }
    };

    const handleTypingStart = (data: any) => {
      if (data.userId !== user?.id) {
        setTypingUser(data.name);
      }
    };

    const handleTypingStop = (data: any) => {
      if (data.userId !== user?.id) {
        setTypingUser(null);
      }
    };

    const handleMessageSeen = (data?: any) => {
      if (data?.chatRoomId && data.chatRoomId !== roomId) return;

      setMessages((prev) =>
        prev.map((message) =>
          message.senderId === user?.id
            ? {
                ...message,
                seenAt: message.seenAt || new Date().toISOString(),
              }
            : message
        )
      );
    };

    // Backend should emit:
    // presence:update -> { userId, isOnline, lastSeenAt }
    const handlePresenceUpdate = (data: any) => {
      if (!data || data.userId !== otherParticipant?.id) return;

      setPresence({
        isOnline: Boolean(data.isOnline),
        lastSeenAt: data.lastSeenAt || data.lastSeen || null,
      });
    };

    // Backend should emit:
    // message:delivered -> { chatRoomId, messageId }
    const handleMessageDelivered = (data: any) => {
      if (!data || data.chatRoomId !== roomId || !data.messageId) {
        return;
      }

      setMessages((prev) =>
        prev.map((message: any) =>
          message.id === data.messageId
            ? {
                ...message,
                deliveredAt:
                  message.deliveredAt || new Date().toISOString(),
              }
            : message
        )
      );
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('message:seen', handleMessageSeen);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('message:delivered', handleMessageDelivered);

    socket.emit('message:seen', { chatRoomId: roomId });

    return () => {
      socket.emit('leave:room', roomId);

      socket.off('message:new', handleNewMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('message:seen', handleMessageSeen);
      socket.off('presence:update', handlePresenceUpdate);
      socket.off('message:delivered', handleMessageDelivered);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [token, roomId, user?.id, otherParticipant?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleSend = () => {
    const content = input.trim();

    if (!content || !token || !roomId) return;

    const socket = getSocket(token);

    socket.emit('message:send', {
      chatRoomId: roomId,
      content,
    });

    setInput('');
    socket.emit('typing:stop', roomId);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!token || !roomId) return;

    const socket = getSocket(token);

    socket.emit('typing:start', roomId);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', roomId);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8f2] text-[#344337]">
      <Navbar />

      <main
        className="mx-auto flex w-full max-w-6xl flex-col px-3 py-4 sm:px-6 sm:py-6"
        style={{ height: 'calc(100dvh - 64px)' }}
      >
        {/* Chat Header */}
        <header className="mb-3 flex shrink-0 items-center gap-3 rounded-2xl border border-[#e0e9db] bg-white px-3 py-3 shadow-sm sm:px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#718071] transition hover:bg-[#edf4e9] hover:text-[#41694a]"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Participant Avatar */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#dce9d5] bg-gradient-to-br from-[#e9f3e4] to-[#d6e7cf] text-base font-bold text-[#557b59]">
            {otherParticipant?.avatar ? (
              <img
                src={otherParticipant.avatar}
                alt={participantName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              participantInitial
            )}

            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                presence.isOnline ? 'bg-[#79a96e]' : 'bg-[#b8c0b4]'
              }`}
            />
          </div>

          {/* Name and Last Seen */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-bold text-[#344337] sm:text-base">
              {roomLoading ? 'Loading conversation...' : participantName}
            </h1>

            <p className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-xs text-[#7a8878]">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  typingUser || presence.isOnline
                    ? 'bg-[#79a96e]'
                    : 'bg-[#b3bcae]'
                }`}
              />
              <span className="truncate">{presenceLabel}</span>
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#e0eadb] bg-[#f3f8ef] px-3 py-1.5 text-xs font-medium text-[#668264] sm:flex">
            <ShieldCheck size={14} />
            <span>Gharwise Chat</span>
          </div>
        </header>

        {/* Property Information */}
        <div className="mb-3 flex shrink-0 items-center gap-3 rounded-xl border border-[#e1e9dc] bg-[#edf4e9] px-3 py-2.5 sm:px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#73936b] shadow-sm">
            <Home size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#435e43] sm:text-sm">
              {listingTitle}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-[#7b8b75] sm:text-xs">
              {propertyLocationText || 'Discuss property details directly'}
            </p>
          </div>

          <MessageCircle size={17} className="shrink-0 text-[#89a582]" />
        </div>

        {/* Messages Panel */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#e0e8dc] bg-[#f9fbf7] shadow-sm">
          <div
            className="flex-1 space-y-4 overflow-y-auto px-3 py-5 sm:px-6 sm:py-6"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #e8eee4 1px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          >
            {messages.length === 0 && (
              <div className="flex min-h-full flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e0eadb] bg-white text-[#8aab80] shadow-sm">
                  <MessageCircle size={29} strokeWidth={1.6} />
                </div>

                <h2 className="text-base font-semibold text-[#435743]">
                  Start the conversation
                </h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-[#839080]">
                  Ask about rent, availability, facilities or any property
                  details before making your decision.
                </p>

                <span className="mt-4 rounded-full border border-[#e2eadc] bg-white/90 px-3 py-1.5 text-[11px] text-[#8a9785]">
                  Your conversation starts here
                </span>
              </div>
            )}

            {messages.map((msg: Message, index: number) => {
              const isMine = msg.senderId === user?.id;
              const currentDate = new Date(msg.createdAt);
              const previousMessage = messages[index - 1];

              const showDate =
                index === 0 ||
                !isSameDay(
                  currentDate,
                  new Date(previousMessage.createdAt)
                );

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="my-5 flex justify-center">
                      <span className="rounded-full border border-[#e3eade] bg-white/95 px-3 py-1 text-[10px] font-medium text-[#859180] shadow-sm sm:text-xs">
                        {isSameDay(currentDate, new Date())
                          ? 'Today'
                          : format(currentDate, 'dd MMM yyyy')}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-2 ${
                      isMine ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isMine && (
                      <div className="mb-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dce8d6] bg-[#e7f0e2] text-[11px] font-bold text-[#62805d]">
                        {participantInitial}
                      </div>
                    )}

                    <div
                      className={`flex max-w-[82%] flex-col gap-1 sm:max-w-[70%] ${
                        isMine ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-[20px] px-4 py-3 shadow-sm ${
                          isMine
                            ? 'rounded-br-md border border-[#d7e7d0] bg-[#eaf3e5] text-[#354735]'
                            : 'rounded-bl-md border border-[#e5eae1] bg-white text-[#414c41]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-[13px] leading-6 sm:text-sm">
                          {msg.content}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 px-1 text-[10px] text-[#8a9585] sm:text-[11px] ${
                          isMine ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <span>{format(currentDate, 'HH:mm')}</span>

                        {isMine &&
                          ((msg as any).seenAt ? (
                            <CheckCheck
                              size={14}
                              className="text-[#6e9ed6]"
                              aria-label="Seen"
                            />
                          ) : (msg as any).deliveredAt ? (
                            <CheckCheck
                              size={14}
                              className="text-[#9aa595]"
                              aria-label="Delivered"
                            />
                          ) : (
                            <Check
                              size={13}
                              className="text-[#9aa595]"
                              aria-label="Sent"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUser && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dce8d6] bg-[#e7f0e2] text-[11px] font-bold text-[#62805d]">
                  {typingUser.charAt(0).toUpperCase()}
                </div>

                <div className="rounded-[18px] rounded-bl-md border border-[#e5eae1] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#81907e]">
                      {typingUser} is typing
                    </span>

                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#93b18a]"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="shrink-0 border-t border-[#e5ebe1] bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8da] bg-[#f6f9f3] p-1.5 pl-4 transition focus-within:border-[#b5cdb0] focus-within:ring-2 focus-within:ring-[#dce9d5]/60 sm:gap-3">
              <input
                id="chat-message-input"
                type="text"
                autoComplete="off"
                placeholder="Write a message..."
                aria-label="Write a message"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#3c493b] outline-none placeholder:text-[#98a292]"
                value={input}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button
                id="send-message-btn"
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8eae83] text-white shadow-sm transition hover:bg-[#789c6d] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#dce5d7] disabled:text-[#a4b09f] disabled:shadow-none"
              >
                <Send size={17} />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-[#9aa393]">
              Keep your conversation respectful and property-related.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}