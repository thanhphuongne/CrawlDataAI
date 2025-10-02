import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true, // e.g., 'user', 'system'
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true,
  },
  request_id: {
    type: Number,
    index: true,
  },
  messages: [messageSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

conversationSchema.index({ user_id: 1 });
conversationSchema.index({ request_id: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;