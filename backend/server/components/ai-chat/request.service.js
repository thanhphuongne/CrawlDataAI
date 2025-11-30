import Request from './request.model';

/**
 * Create a new request
 * @param {number} userId
 * @param {string} requirement
 * @returns {Promise<Request>}
 */
export async function createRequest(userId, requirement) {
  try {
    const request = await Request.create({
      user_id: userId,
      requirement,
    });
    return request;
  } catch (error) {
    throw new Error(`Error creating request: ${error.message}`);
  }
}

/**
 * Get request by ID
 * @param {number} id
 * @returns {Promise<Request|null>}
 */
export async function getRequestById(id) {
  try {
    const request = await Request.findByPk(id);
    return request;
  } catch (error) {
    throw new Error(`Error getting request: ${error.message}`);
  }
}

/**
 * Get requests by user ID
 * @param {number} userId
 * @param {string} status
 * @returns {Promise<Request[]>}
 */
export async function getRequestsByUserId(userId, status = null) {
  try {
    const where = { user_id: userId };
    if (status) where.status = status;
    const requests = await Request.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
    return requests;
  } catch (error) {
    throw new Error(`Error getting requests: ${error.message}`);
  }
}

/**
 * Update request status
 * @param {number} id
 * @param {string} status
 * @param {string} exportPath
 * @returns {Promise<boolean>}
 */
export async function updateRequestStatus(id, status, exportPath = null) {
  try {
    const updateData = { status };
    if (exportPath) updateData.export_path = exportPath;
    if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date();
    }
    const [affectedRows] = await Request.update(updateData, { where: { id } });
    return affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating request: ${error.message}`);
  }
}

/**
 * Delete request
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function deleteRequest(id) {
  try {
    const affectedRows = await Request.destroy({ where: { id } });
    return affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting request: ${error.message}`);
  }
}