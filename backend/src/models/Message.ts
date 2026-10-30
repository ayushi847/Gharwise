

// import mongoose, { Schema, Document } from 'mongoose';

// export interface IMessage extends Document {
//   chatRoomId: mongoose.Types.ObjectId;
//   senderId: mongoose.Types.ObjectId;
//   content: string;
//   seenAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const MessageSchema: Schema = new Schema(
//   {
//     chatRoomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
//     senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     content: { type: String, required: true },
//     seenAt: { type: Date },
//   },
//   { timestamps: true }
// );

// // Virtual relation
// MessageSchema.virtual('sender', {
//   ref: 'User',
//   localField: 'senderId',
//   foreignField: '_id',
//   justOne: true,
// });

// MessageSchema.set('toJSON', { virtuals: true });
// MessageSchema.set('toObject', { virtuals: true });

// export default mongoose.model<IMessage>('Message', MessageSchema);






















import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatRoomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  deliveredAt?: Date | null;
  seenAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    seenAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

MessageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

MessageSchema.set('toJSON', { virtuals: true });
MessageSchema.set('toObject', { virtuals: true });

export default mongoose.model<IMessage>('Message', MessageSchema);