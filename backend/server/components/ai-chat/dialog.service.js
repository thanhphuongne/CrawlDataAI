import Dialog from './dialog.model';

/**
 * Create a new dialog
 * @param {number} userId
 * @param {number} requestId
 * @returns {Promise<Dialog>}
 */
export async function createDialog(userId, requestId = null) {
  try {
    const dialog = new Dialog({
      user_id: userId,
      request_id: requestId,
      messages: [],
    });
    await dialog.save();
    return dialog;
  } catch (error) {
    throw new Error(`Error creating dialog: ${error.message}`);
  }
}

/**
 * Get dialog by ID
 * @param {string} id
 * @returns {Promise<Dialog|null>}
 */
export async function getDialogById(id) {
  try {
    const dialog = await Dialog.findById(id);
    return dialog;
  } catch (error) {
    throw new Error(`Error getting dialog: ${error.message}`);
  }
}

/**
 * Get dialogs by user ID
 * @param {number} userId
 * @returns {Promise<Dialog[]>}
 */
export async function getDialogsByUserId(userId) {
  try {
    const dialogs = await Dialog.find({ user_id: userId }).sort({ created_at: -1 });
    return dialogs;
  } catch (error) {
    throw new Error(`Error getting dialogs: ${error.message}`);
  }
}

/**
 * Add message to dialog
 * @param {string} dialogId
 * @param {string} role
 * @param {string} content
 * @returns {Promise<Dialog>}
 */
export async function addMessageToDialog(dialogId, role, content) {
  try {
    const dialog = await Dialog.findByIdAndUpdate(
      dialogId,
      {
        $push: {
          messages: { role, content }
        }
      },
      { new: true }
    );
    return dialog;
  } catch (error) {
    throw new Error(`Error adding message: ${error.message}`);
  }
}

/**
 * Get dialog by user and request
 * @param {number} userId
 * @param {number} requestId
 * @returns {Promise<Dialog|null>}
 */
export async function getDialogByUserAndRequest(userId, requestId) {
  try {
    const dialog = await Dialog.findOne({ user_id: userId, request_id: requestId });
    return dialog;
  } catch (error) {
    throw new Error(`Error getting dialog: ${error.message}`);
  }
}