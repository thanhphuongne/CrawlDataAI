import * as DialogService from './dialog.service';

/**
 * Create dialog
 */
export async function createDialog(req, res, next) {
  try {
    const { user_id, request_id } = req.body;
    const dialog = await DialogService.createDialog(user_id, request_id);
    return res.json({
      success: true,
      data: dialog,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get dialog by ID
 */
export async function getDialog(req, res, next) {
  try {
    const { id } = req.params;
    const dialog = await DialogService.getDialogById(id);
    return res.json({
      success: true,
      data: dialog,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get dialogs by user
 */
export async function getDialogsByUser(req, res, next) {
  try {
    const { user_id } = req.params;
    const dialogs = await DialogService.getDialogsByUserId(user_id);
    return res.json({
      success: true,
      data: dialogs,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Add message to dialog
 */
export async function addMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { role, content } = req.body;
    const dialog = await DialogService.addMessageToDialog(id, role, content);
    return res.json({
      success: true,
      data: dialog,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get dialog by user and request
 */
export async function getDialogByUserAndRequest(req, res, next) {
  try {
    const { user_id, request_id } = req.params;
    const dialog = await DialogService.getDialogByUserAndRequest(user_id, request_id);
    return res.json({
      success: true,
      data: dialog,
    });
  } catch (error) {
    return next(error);
  }
}