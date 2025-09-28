import * as RequestService from './request.service';

/**
 * Create request
 */
export async function createRequest(req, res, next) {
  try {
    const { requirement } = req.body;
    const user_id = req.auth.id;
    const request = await RequestService.createRequest(user_id, requirement);
    return res.json({
      request_id: request.id,
      status: request.status,
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
    const user_id = req.auth.id;
    const status = req.query.status;
    const requests = await RequestService.getRequestsByUserId(user_id, status);
    return res.json(requests);
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

/**
 * Delete request
 */
export async function deleteRequest(req, res, next) {
  try {
    const { id } = req.params;
    const success = await RequestService.deleteRequest(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}