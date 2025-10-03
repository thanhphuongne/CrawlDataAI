import * as ConversationService from './conversation.service';

/**
 * Create conversation
 */
export async function createConversation(req, res, next) {
  try {
    const { user_id, request_id } = req.body;
    const conversation = await ConversationService.createConversation(user_id, request_id);
    return res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get conversation by ID
 */
export async function getConversation(req, res, next) {
  try {
    const { id } = req.params;
    const conversation = await ConversationService.getConversationById(id);
    return res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get conversations by user
 */
export async function getConversationsByUser(req, res, next) {
  try {
    const user_id = req.auth.id;
    const request_id = req.query.request_id;
    const conversations = await ConversationService.getConversationsByUserId(user_id, request_id);
    return res.json(conversations);
  } catch (error) {
    return next(error);
  }
}

/**
 * Add message to conversation
 */
export async function addMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { role, content } = req.body;
    const conversation = await ConversationService.addMessageToConversation(id, role, content);
    return res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get conversation by user and request
 */
export async function getConversationByUserAndRequest(req, res, next) {
  try {
    const { user_id, request_id } = req.params;
    const conversation = await ConversationService.getConversationByUserAndRequest(user_id, request_id);
    return res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Send message (create conversation if needed and add message)
 */
export async function sendMessage(req, res, next) {
  try {
    const { request_id, content } = req.body;
    const user_id = req.auth.id;
    const message = await ConversationService.sendMessage(user_id, request_id, content);
    return res.json({
      message: "Message sent",
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get general conversation for user (persistent chat history)
 */
export async function getGeneralConversation(req, res, next) {
  try {
    const { user_id } = req.params;
    const conversation = await ConversationService.getOrCreateGeneralConversation(user_id);
    return res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
}