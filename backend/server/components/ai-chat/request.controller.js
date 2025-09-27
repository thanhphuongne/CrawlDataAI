import * as RequestService from './request.service';

/**
 * Create request
 */
export async function createRequest(req, res, next) {
  try {
    const { user_id, requirement } = req.body;
    const request = await RequestService.createRequest(user_id, requirement);
    return res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get request by ID
 */
export async function getRequest(req, res, next) {
  try {
    const { id } = req.params;
    const request = await RequestService.getRequestById(id);
    return res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get requests by user
 */
export async function getRequestsByUser(req, res, next) {
  try {
    const { user_id } = req.params;
    const requests = await RequestService.getRequestsByUserId(user_id);
    return res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update request status
 */
export async function updateRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, export_path } = req.body;
    const success = await RequestService.updateRequestStatus(id, status, export_path);
    return res.json({
      success,
    });
  } catch (error) {
    return next(error);
  }
}