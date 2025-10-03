import Conversation from './conversation.model';

/**
 * Create a new conversation
 * @param {number} userId
 * @param {number} requestId
 * @returns {Promise<Conversation>}
 */
export async function createConversation(userId, requestId = null) {
  try {
    const conversation = new Conversation({
      user_id: userId,
      request_id: requestId,
      messages: [],
    });
    await conversation.save();
    return conversation;
  } catch (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }
}

/**
 * Get conversation by ID
 * @param {string} id
 * @returns {Promise<Conversation|null>}
 */
export async function getConversationById(id) {
  try {
    const conversation = await Conversation.findById(id);
    return conversation;
  } catch (error) {
    throw new Error(`Error getting conversation: ${error.message}`);
  }
}

/**
 * Get conversations by user ID
 * @param {number} userId
 * @param {number} requestId
 * @returns {Promise<Conversation[]>}
 */
export async function getConversationsByUserId(userId, requestId = null) {
  try {
    const query = { user_id: userId };
    if (requestId) query.request_id = requestId;
    const conversations = await Conversation.find(query).sort({ created_at: -1 });
    return conversations;
  } catch (error) {
    throw new Error(`Error getting conversations: ${error.message}`);
  }
}

/**
 * Add message to conversation
 * @param {string} conversationId
 * @param {string} role
 * @param {string} content
 * @returns {Promise<Conversation>}
 */
export async function addMessageToConversation(conversationId, role, content) {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: { role, content }
        }
      },
      { new: true }
    );
    return conversation;
  } catch (error) {
    throw new Error(`Error adding message: ${error.message}`);
  }
}

/**
 * Get conversation by user and request
 * @param {number} userId
 * @param {number} requestId
 * @returns {Promise<Conversation|null>}
 */
export async function getConversationByUserAndRequest(userId, requestId) {
  try {
    const conversation = await Conversation.findOne({ user_id: userId, request_id: requestId });
    return conversation;
  } catch (error) {
    throw new Error(`Error getting conversation: ${error.message}`);
  }
}

/**
 * Send message (create conversation if needed)
 * @param {number} userId
 * @param {number} requestId
 * @param {string} content
 * @returns {Promise<Conversation>}
 */
export async function sendMessage(userId, requestId, content) {
  try {
    let conversation = await Conversation.findOne({ user_id: userId, request_id: requestId });
    if (!conversation) {
      conversation = await createConversation(userId, requestId);
    }
    await addMessageToConversation(conversation._id, 'user', content);
    // TODO: Trigger AI response
    return conversation;
  } catch (error) {
    throw new Error(`Error sending message: ${error.message}`);
  }
}

/**
 * Get or create a general conversation for a user (not tied to specific requests)
 * @param {number} userId
 * @returns {Promise<Conversation>}
 */
export async function getOrCreateGeneralConversation(userId) {
  try {
    // Look for a conversation with null request_id (general conversation)
    let conversation = await Conversation.findOne({ user_id: userId, request_id: null });
    if (!conversation) {
      conversation = await createConversation(userId, null);
    }
    return conversation;
  } catch (error) {
    throw new Error(`Error getting general conversation: ${error.message}`);
  }
}

/**
 * Send message to general conversation
 * @param {number} userId
 * @param {string} content
 * @param {string} role - 'user' or 'assistant'
 * @returns {Promise<Conversation>}
 */
export async function sendMessageToGeneralConversation(userId, content, role = 'user') {
  try {
    let conversation = await getOrCreateGeneralConversation(userId);
    await addMessageToConversation(conversation._id, role, content);
    return conversation;
  } catch (error) {
    throw new Error(`Error sending message to general conversation: ${error.message}`);
  }
}