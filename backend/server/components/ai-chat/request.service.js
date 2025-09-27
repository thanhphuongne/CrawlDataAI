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
    const request = await Request.findByPk(id, {
      include: [{ model: require('./user.model').default, as: 'AIUser' }],
    });
    return request;
  } catch (error) {
    throw new Error(`Error getting request: ${error.message}`);
  }
}

/**
 * Get requests by user ID
 * @param {number} userId
 * @returns {Promise<Request[]>}
 */
export async function getRequestsByUserId(userId) {
  try {
    const requests = await Request.findAll({
      where: { user_id: userId },
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