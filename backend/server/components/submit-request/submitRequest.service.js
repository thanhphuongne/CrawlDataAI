import { Op, where } from 'sequelize';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
// import ms from 'ms';
import logger from '../../util/logger';
import APIError from '../../util/APIError';
import SubmitRequest from './submitRequest.model';
import triggerSentMailEvent from '../../handlers/triggerSentMailEvent';
import Category from '../category/category.model';
import User from '../user/user.model';
import Type from '../category/type.model';
import { sequelize } from '../../db/connection';

import {
  PROCESS_STATUS,

} from '../../constants';
import HistoryComments from './HistoryComments.model';
import { param } from 'express-validator';
// import { getAmountInvitee, getAmountInviter } from '../paymentHistory/paymentHistory.service';

// import  { Op, Sequelize } from ("sequelize");
/**
 * Registry new user account
 * @param params
 * @param {string} params.accountName String
 * @param {string} params.descriptions String
 * @param {string} params.supervisor String
 * @param {string} params.category String
 * @param {string} params.hasNotifyMail String
 *  * @param {string} params.dataValues.id String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function submit(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    const userInfo = {
      accountName: params.accountName,
      descriptions: params.descriptions,
      approver: params.approver,
      supervisor: params.supervisor,
      categoryId: params.category,
      hasNotifyMail: params.hasNotifyMail,
      createBy: params.user.dataValues.id,

    };
    const accountName = await User.findOne({ where: { accountName: params.accountName } });
    if (!accountName) {
      throw new APIError(403, [
        {
          msg: 'accountName is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    // const category = await Category.findByPk(params.category);
    const supervisor = await User.findByPk(params.supervisor);
    if (!supervisor) {
      throw new APIError(403, [
        {
          msg: 'supervisor is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    // const category = await Category.findOne({ id: params.category, approver: params.approver });
    const category = await Category.findOne({
      where: {
        id: params.category,
        approver: params.approver
      }
    });

    if (!category) {
      throw new APIError(403, [
        {
          msg: 'category id is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    // const typeCate = await Type.findAll({ where: { type: category.dataValues.type, approver: params.approver } });
    // if (typeCate.length == 0) {
    //   throw new APIError(403, [
    //     {
    //       msg: 'Type category id is not available',
    //       param: 'submitNotAvailable',
    //     },
    //   ]);
    // }

    const sb = await SubmitRequest.create(userInfo);
    const dataSubmit = {
      submitId: sb.dataValues.id,
      supervisor: supervisor.dataValues.accountName,
      ...category.dataValues,
      accountName: params.accountName,
      descriptions: params.descriptions,
      userCreate: params.user.dataValues.email,
      suppervisorApproved: sb.dataValues.suppervisorApproved,
      approverApproved: sb.dataValues.approverApproved
    }
    triggerSentMailEvent({ email: params.user.dataValues.email, template: "NotifySubmiter", dataSubmit })
    triggerSentMailEvent({ email: supervisor.email, template: "NotifyApproverSupervisor", dataSubmit })
    return sb;
  } catch (error) {
    logger.error('SubmitRequest registry create new submit error:', error);
    throw new APIError(500, error);
  }
}

/**
 * Registry new user account
 * @param params
 * @param {string} params.firstName String
 * @param {string} params.lastName String
 * @param {string} params.email String
 * @param {string} params.phone String
 * @param {string} params.password String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function updateSubmit(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);

    const submitInfo = await SubmitRequest.findOne({ where: { id: params.id, } });
    if (!submitInfo) {
      throw new APIError(403, [
        {
          msg: 'Submit id is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    if (submitInfo.suppervisorApproved) {
      throw new APIError(407, [
        {
          msg: 'submit is Approved by supervisor',
          param: 'submitNotAvailable',
        },
      ]);
    }
    if (submitInfo.approverApproved) {
      throw new APIError(408, [
        {
          msg: 'submit is Approved by admin',
          param: 'submitNotAvailable',
        },
      ]);
    }
    const inforUpdate = {
      accountName: params.accountName,
      descriptions: params.descriptions,
      supervisor: params.supervisor,
      approver: params.approver,
      categoryId: params.category,
      hasNotifyMail: params.hasNotifyMail,
      createBy: params.user.dataValues.id,
    };
    // const sb = await SubmitRequest.create(inforUpdate);
    await SubmitRequest.update(inforUpdate, { where: { id: params.id } });
    // const category = await Category.findByPk(params.category);
    // const supervisor = await User.findByPk(params.supervisor);
    // triggerSentMailEvent({email: supervisor.email,template:"NotifySupperVisor"})
    return {
      success: true,
      msg: "Update success"
    };
  } catch (error) {
    logger.error('SubmitRequest registry create new submit error:', error);
    throw new APIError(500, error);
  }
}
/**
 * Registry new user account
 * @param params
 * @param {string} params.id String
 * @param {string} params.pageNumber String
 * @param {string} params.pageSize String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function getListSubmit(params) {
  try {
    const offset = params.pageNumber * params.pageSize;
    const limit = params.pageSize;
    const whereClause = { createBy: params.id };

    // Xử lý textSearch: Tìm kiếm theo Supervisor, accountName, Approver
    if (params.filter.textSearch) {
      const textSearch = params.filter.textSearch.replace(/\\/g, '\\\\');
      const searchTerm = `%${textSearch}%`;

      whereClause[Op.or] = [
        { accountName: { [Op.like]: searchTerm } }, // Tìm theo accountName của SubmitRequest
        { '$supervisorInfo.accountName$': { [Op.like]: searchTerm } }, // Tìm theo Supervisor (User)
        { '$category.approver$': { [Op.like]: searchTerm } }, // Tìm theo Approver (Category)
      ];
      delete params.filter.textSearch; // Xóa để tránh xung đột
    }

    // Xử lý các filter khác (giữ nguyên)
    if (params.filter.supervisor) {
      whereClause['$supervisorInfo.accountName$'] = params.filter.supervisor;
      delete params.filter.supervisor;
    }

    if (params.filter.type) {
      whereClause['$category.type$'] = params.filter.type;
      delete params.filter.type;
    }

    // Xử lý status và date (giữ nguyên)
    if (params.filter.status) {
      whereClause.status = { [Op.in]: params.filter.status.split(',') };
      delete params.filter.status;
    }

    if (params.filter.startDate && params.filter.endDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(params.filter.startDate),
        [Op.lte]: new Date(params.filter.endDate),
      };
      delete params.filter.startDate;
      delete params.filter.endDate;
    }

    // Thêm các filter còn lại vào whereClause
    Object.assign(whereClause, params.filter);
    const order = [];

    if (params.sort && Array.isArray(params.sort)) {
      const scoreSort = params.sort.find(([field]) => field === 'score');
      const categorySort = params.sort.find(([field]) => field === 'category');
      const otherSorts = params.sort.filter(([field]) => field !== 'score' && field !== 'category');
      order.push(...otherSorts);
      if (scoreSort) {
        const dir = (scoreSort[1] || 'DESC').toUpperCase();
        order.push([{ model: Category, as: 'category' }, 'score', dir]);
      }
      if (categorySort) {
        const dir = (categorySort[1] || 'DESC').toUpperCase();
        order.push([{ model: Category, as: 'category' }, 'name', dir]);
      }
    }
    // Query dữ liệu
    const { count, rows } = await SubmitRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'supervisorInfo',
          attributes: ['id', 'accountName', 'email'], // Hiển thị thông tin Supervisor
        },
         {
            model: User, // Đây là model của bảng users
            as: 'userCreate', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
            attributes: ['id', 'accountName', 'email'], // Chỉ lấy các trường cần thiết
            // where: Object.keys(creatByFilter).length ? creatByFilter : undefined,
          },
        {
          model: Category,
          as: 'category',
          attributes: ["name", "type", "approver", "score"], // Đảm bảo có trường "approver"
        },
      ],
      limit,
      offset,
      order: order,
      subQuery: false,
    });

    const totalPages = Math.ceil(count / params.pageSize);
    return {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      totalItems: count,
      totalPages,
      data: rows,
    };
  } catch (error) {
    logger.error('get List Submit:', error);
    throw new APIError(500, error);
  }
}

/**
 * Registry new user account
 * @param params
 * @param {string} params.pageNumber String
 * @param {string} params.pageSize String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function getListRank(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    // Tính toán limit và offset
    const offset = (params.pageNumber) * params.pageSize;
    const limit = params.pageSize;
    // Đếm tổng số nhóm (accountName)
    // console.log("==params===",params)
    params.status = PROCESS_STATUS.APPROVED;
    if (params.startDate && params.endDate) {
      params.createdAt = {
        [Op.gte]: new Date(params.startDate),
        [Op.lte]: new Date(params.endDate),

      }
    }
    delete params.pageNumber;
    delete params.pageSize;
    delete params.startDate;
    delete params.endDate;
    const totalItems = await SubmitRequest.count({
      col: 'accountName',
      distinct: true, // Đếm số lượng giá trị duy nhất
      where: params,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: [],
        },
      ],
    });

    const result = await SubmitRequest.findAll({
      attributes: [
        'accountName',
        [sequelize.fn('SUM', sequelize.col('category.score')), 'totalScore']
      ],
      where: params,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: [],
        },
      ],
      group: ['accountName'],
      order: [[sequelize.fn('SUM', sequelize.col('category.score')), 'DESC']],
      limit,
      offset,
    });
    // console.log("==result===",result)
    // Gán thứ hạng
    let rank = 1; // Hạng bắt đầu
    let previousScore = null;
    const dtJson = result.map((r, index) => {
      const record = r.toJSON();
      const totalScore = parseFloat(record.totalScore);

      // Nếu điểm khác điểm trước đó, tăng thứ hạng
      if (previousScore !== null && totalScore < previousScore) {
        rank++; // Chuyển sang thứ hạng tiếp theo
      }

      previousScore = totalScore;
      // console.log("==record===", record)
      return {
        ...record,
        rank,
      };
    });
    // Tính tổng số trang
    const totalPages = Math.ceil(dtJson.length / params.pageSize);
    return {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      totalItems: totalItems,
      totalPages,
      data: dtJson,
    };
  } catch (error) {
    logger.error('get List Submit:', error);
    throw new APIError(500, error);
  }
}

/**
 * Registry new user account
 * @param params
 * @param {string} params.accountName String
 * @param {string} params.descriptions String
 * @param {string} params.supervisor String
 * @param {string} params.category String
 * @param {string} params.hasNotifyMail String
 *  * @param {string} params.dataValues.id String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function comments(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    const userInfo = {
      submitId: params.id,
      descriptions: params.descriptions,
      commentBy: params.user.dataValues.id,

    };
    const sb = await HistoryComments.create(userInfo);
    // const category = await Category.findByPk(params.category);
    // const supervisor = await User.findByPk(params.supervisor);
    // console.log("supervisor==", supervisor.email);
    // triggerSentMailEvent({ email: supervisor.email, template: "NotifySupperVisor" })
    return sb;
  } catch (error) {
    logger.error('comments submit error:', error);
    throw new APIError(500, error);
  }
}
export async function getComments(submitId) {
  try {
    const sb = await HistoryComments.findAll({
      where: { submitId: submitId }, // Lọc theo submitId
      include: [
        {
          model: User, // Bảng users
          as: 'commenter', // Alias để ánh xạ
          attributes: ['id', 'accountName'] // Chỉ lấy các cột cần thiết
        }
      ],
      order: [['createdAt', 'DESC']] // Sắp xếp theo thời gian
    });

    return sb;
  } catch (error) {
    logger.error('comments submit error:', error);
    throw new APIError(500, error);
  }
}


/**
 * Registry new user account
 * @param params
 * @param {string} params.accountName String
 * @param {string} params.descriptions String
 * @param {string} params.supervisor String
 * @param {string} params.category String
 * @param {string} params.hasNotifyMail String
 *  * @param {string} params.dataValues.id String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function Approve(params) {
  try {
    const status = params.approve === true
      ? PROCESS_STATUS.CONFIRMED
      : PROCESS_STATUS.REJECT;

    const submitInfo = await SubmitRequest.findOne({
      where: { id: params.id, supervisor: params.user.dataValues.id }, include: [
        {
          model: User, // Đây là model của bảng users
          as: 'supervisorInfo', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'email'], // Chỉ lấy các trường cần thiết
        },
        {
          model: User, // Đây là model của bảng users
          as: 'userCreate', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'email'], // Chỉ lấy các trường cần thiết
        },
        {
          model: Category,
          as: 'category',
          attributes: ["name", "score"],
        },
      ],
    });
    if (!submitInfo) {
      throw new APIError(403, [
        {
          msg: 'Submit id is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    if (submitInfo.suppervisorApproved) {
      throw new APIError(406, [
        {
          msg: 'suppervisor is confirmed',
          param: 'suppervisorIsConfirmed',
        },
      ]);
    }
    // const sb = await SubmitRequest.create(inforUpdate);
    submitInfo.suppervisorApproved = params.approve;
    submitInfo.status = status;
    await submitInfo.save();
    const commentInfo = {
      submitId: params.id,
      descriptions: params.descriptions,
      commentBy: params.user.dataValues.id,

    };
    const dataSubmit = {
      ...submitInfo,
      commentInfo
    }
    await HistoryComments.create(commentInfo);
    // if (submitInfo.hasNotifyMail) {

    // triggerSentMailEvent({ email: submitInfo.userCreate.dataValues.email, template: "NotifySubmiter", dataSubmit })
    // }
    // triggerSentMailEvent({ email: dataSubmit.dataValues.approver + "@fpt.com", template: "NotifyApprover", dataSubmit })
    return {
      success: true,
      msg: "Confirmed successfully"
    };
  } catch (error) {
    logger.error('supervisorApprove submit error:', error);
    throw new APIError(500, error);
  }
}

/**
 * Registry new user account
 * @param params
 * @param {string} params.accountName String
 * @param {string} params.descriptions String
 * @param {string} params.supervisor String
 * @param {string} params.category String
 * @param {string} params.hasNotifyMail String
 *  * @param {string} params.dataValues.id String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function getListAssgin(params) {
  try {
    // Tính toán phân trang
    const offset = params.pageNumber * params.pageSize;
    const limit = params.pageSize;
    const whereClause = {
      [Op.or]: [
        { supervisor: params.user.dataValues.id },
        { approver: params.user.dataValues.accountName }
      ]
    };

    // Xử lý textSearch: Tìm kiếm trên accountName, supervisor, và approver
    if (params.filter.textSearch) {
      const textSearch = params.filter.textSearch.replace(/\\/g, '\\\\');
      const searchTerm = `%${textSearch}%`;
      whereClause[Op.and] = whereClause[Op.and] || [];
      whereClause[Op.and].push({
        [Op.or]: [
          { accountName: { [Op.like]: searchTerm } },
          { '$supervisorInfo.accountName$': { [Op.like]: searchTerm } },
          { '$category.approver$': { [Op.like]: searchTerm } },
        ]
      });
      delete params.filter.textSearch; // Xóa textSearch sau khi xử lý
    }

    // Xử lý các filter khác
    if (params.filter.supervisor) {
      whereClause['$supervisorInfo.accountName$'] = params.filter.supervisor;
      delete params.filter.supervisor;
    }

    if (params.filter.type) {
      whereClause['$category.type$'] = params.filter.type;
      delete params.filter.type;
    }

    if (params.filter.createdBy) {
      whereClause['$userCreate.accountName$'] = params.filter.createdBy;
      delete params.filter.createdBy;
    }

    if (params.filter.status) {
      whereClause.status = { [Op.in]: params.filter.status.split(',') };
      delete params.filter.status;
    }

    if (params.filter.startDate && params.filter.endDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(params.filter.startDate),
        [Op.lte]: new Date(params.filter.endDate),
      };
      delete params.filter.startDate;
      delete params.filter.endDate;
    }


    // Thêm các filter còn lại (nếu có) vào whereClause
    Object.assign(whereClause, params.filter);
    const order = [];

    if (params.sort && Array.isArray(params.sort)) {
      const scoreSort = params.sort.find(([field]) => field === 'score');
      const categorySort = params.sort.find(([field]) => field === 'category');
      const otherSorts = params.sort.filter(([field]) => field !== 'score' && field !== 'category');
      order.push(...otherSorts);
      if (scoreSort) {
        const dir = (scoreSort[1] || 'DESC').toUpperCase();
        order.push([{ model: Category, as: 'category' }, 'score', dir]);
      }
      if (categorySort) {
        const dir = (categorySort[1] || 'DESC').toUpperCase();
        order.push([{ model: Category, as: 'category' }, 'name', dir]);
      }
    }
    // Truy vấn dữ liệu
    const { count, rows } = await SubmitRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'supervisorInfo',
          attributes: ['id', 'accountName', 'email'],
        },
        {
          model: User,
          as: 'userCreate',
          attributes: ['id', 'accountName', 'email'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name', 'type', 'approver', 'score'],
        },
      ],
      limit,
      offset,
      order: order,
      subQuery: false, // Tránh xung đột với JOIN
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(count / params.pageSize);
    return {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      totalItems: count,
      totalPages,
      data: rows,
    };
  } catch (error) {
    logger.error('getListAssgin error:', error);
    throw new APIError(500, error.message);
  }
}
/**
 * Registry new user account
 * @param params
 * @param {string} params.accountName String
 * @param {string} params.descriptions String
 * @param {string} params.supervisor String
 * @param {string} params.category String
 * @param {string} params.hasNotifyMail String
 *  * @param {string} params.dataValues.id String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function adminApprove(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    const status = params.approve === true
      ? PROCESS_STATUS.APPROVED
      : PROCESS_STATUS.REJECT;

    const submitInfo = await SubmitRequest.findOne({
      where: { id: params.id, }, include: [
        {
          model: User, // Đây là model của bảng users
          as: 'supervisorInfo', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'email'], // Chỉ lấy các trường cần thiết
        },
        {
          model: User, // Đây là model của bảng users
          as: 'userCreate', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'email'], // Chỉ lấy các trường cần thiết
        },
        {
          model: Category,
          as: 'category',
          attributes: ["name", "score"],
        },
      ],
    });
    // console.log(submitInfo)
    if (!submitInfo) {
      throw new APIError(403, [
        {
          msg: 'Submit id is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    // const sb = await SubmitRequest.create(inforUpdate);
    submitInfo.approverApproved = params.approve;
    if (!submitInfo.suppervisorApproved) {
      submitInfo.suppervisorApproved = true;
    }
    submitInfo.status = status;
    await submitInfo.save();
    const commentInfo = {
      submitId: params.id,
      descriptions: params.descriptions,
      commentBy: params.user.dataValues.id,

    };

    // const dataSubmit = {
    //   ...submitInfo.dataValues,
    //   commentInfo
    // }
    const dataSubmit = {
      submitId: submitInfo.dataValues.id,
      supervisor: submitInfo.dataValues.supervisorInfo.accountName,
      accountName: submitInfo.dataValues.accountName,
      descriptions: submitInfo.dataValues.descriptions,
      userCreate: submitInfo.dataValues.userCreate.dataValues.email,
      suppervisorApproved: submitInfo.dataValues.suppervisorApproved,
      approverApproved: submitInfo.dataValues.approverApproved,
      approver: submitInfo.dataValues.approver,
      comment: commentInfo.descriptions
    }
    await HistoryComments.create(commentInfo);
    if (submitInfo.hasNotifyMail) {
      triggerSentMailEvent({ email: submitInfo.userCreate.dataValues.email, template: "NotifySubmiterFromApprover", dataSubmit })
    }
    // triggerSentMailEvent({ email: "tienpm3@fpt.com", template: "NotifySupperVisor" })
    // const category = await Category.findByPk(params.category);
    // const supervisor = await User.findByPk(params.supervisor);
    // console.log("supervisor==", supervisor.email);
    // triggerSentMailEvent({ email: supervisor.email, template: "NotifySupperVisor" })
    return {
      success: true,
      msg: "Approver successfully"
    };
  } catch (error) {
    logger.error('supervisorApprove submit error:', error);
    throw new APIError(500, error);
  }
}

/**
 * Registry new user account
 * @param params
 * @param {string} params.accountName String
 * @param {string} params.descriptions String
 * @param {string} params.supervisor String
 * @param {string} params.category String
 * @param {string} params.hasNotifyMail String
 *  * @param {string} params.dataValues.id String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function ApproverApprove(params) {
  try {

    const status = params.approve === true
      ? PROCESS_STATUS.APPROVED
      : PROCESS_STATUS.REJECT;
    const submitInfo = await SubmitRequest.findOne({
      where: { id: params.id, approver: params.user.dataValues.accountName }, include: [
        {
          model: User, // Đây là model của bảng users
          as: 'supervisorInfo', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'email'], // Chỉ lấy các trường cần thiết
        },
        {
          model: User, // Đây là model của bảng users
          as: 'userCreate', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'email'], // Chỉ lấy các trường cần thiết
        },
        {
          model: Category,
          as: 'category',
          attributes: ["name", "score"],
        },
      ],
    });

    const approver = submitInfo?.dataValues?.approver || '';
    if (approver != params.user.dataValues.accountName || approver == '') {
      throw new APIError(403, [
        {
          msg: 'Approver is not available',
          param: 'approverNotAvailable',
        },
      ]);
    }
    // const sb = await SubmitRequest.create(inforUpdate);
    if (!submitInfo) {
      throw new APIError(403, [
        {
          msg: 'Submit id is not available',
          param: 'submitNotAvailable',
        },
      ]);
    }
    if (submitInfo.approverApproved) {

      throw new APIError(406, [
        {
          msg: 'Approver is approved',
          param: 'approverIsApproved',
        },
      ]);

    }
    submitInfo.approverApproved = params.approve;

    submitInfo.status = status;
    await submitInfo.save();
    const commentInfo = {
      submitId: params.id,
      descriptions: params.descriptions,
      commentBy: params.user.dataValues.id,

    };
    const dataSubmit = {
      ...submitInfo,
      commentInfo
    }
    await HistoryComments.create(commentInfo);
    // if (submitInfo.hasNotifyMail) {
    triggerSentMailEvent({ email: submitInfo.userCreate.dataValues.email, template: "NotifySubmiterFromApprover", dataSubmit })
    // }
    return {
      success: true,
      msg: "Approved successfully"
    };
  } catch (error) {
    logger.error('supervisorApprove submit error:', error);
    throw new APIError(500, error);
  }
}


export async function sumary(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    // Tính toán limit và offset
    // const offset = (params.pageNumber) * params.pageSize;
    // const limit = params.pageSize;
    // // Xây dựng điều kiện lọc (filter)
    // const supervisorFilter = {};
    // const categoryFilter = {};
    // const creatByFilter = {};
    // if (params.filter.supervisor) {
    //   supervisorFilter.accountName = params.filter.supervisor;
    // }
    // if (params.filter.type) {
    //   categoryFilter.type = params.filter.type;
    // }
    // if (params.filter.createdBy) {
    //   creatByFilter.accountName = params.filter.createdBy;
    // }

    // if (params.filter.textSearch) {
    //   // If status is a comma-separated string, split it into an array
    //   let textSearch = params.textSearch;
    //   if (typeof textSearch === 'string') {
    //     textSearch = textSearch.replace(/\\/g, String.raw`\\`);
    //     params.filter.accountName = { [Op.like]: `%${textSearch}%` };
    //   }
    // }
    // delete params.filter.type;
    // delete params.filter.supervisor;
    // delete params.filter.createdBy;
    // Lấy dữ liệu từ cơ sở dữ liệu với phân trang
    const result = await SubmitRequest.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      where: { createBy: params.user.dataValues.id }, // Lọc theo createBy
      group: ["status"],
      raw: true
    });

    // Danh sách các trạng thái cần có
    const allStatuses = ["CONFIRMED", "APPROVED", "WAITING", "REJECT"];

    const dataMap = {};
    result.forEach(item => {
      dataMap[item.status] = parseInt(item.count, 10);
    });

    // Đảm bảo tất cả trạng thái đều có trong object
    const result_ = {};
    let total = 0;
    allStatuses.forEach(status => {

      result_[status] = dataMap[status] || 0;  // Nếu không có thì đặt là 0
      total += result_[status];
    });
    result_["total"] = total;

    // Tính tổng số trang
    // const totalPages = Math.ceil(count / params.pageSize);
    return {
      data: result_,
    };
  } catch (error) {
    logger.error('supervisorApprove submit error:', error);
    throw new APIError(500, error);
  }


}

export async function getListAll(params) {
  try {
    // Tính toán limit và offset
    const offset = params.pageNumber * params.pageSize;
    const limit = params.pageSize;

    // Xây dựng điều kiện lọc (whereClause)
    const whereClause = {};

    // Xử lý textSearch: Tìm kiếm trên accountName, supervisor, và approver
    if (params.filter.textSearch) {
      const textSearch = params.filter.textSearch.replace(/\\/g, '\\\\'); // Thoát ký tự đặc biệt
      const searchTerm = `%${textSearch}%`;

      whereClause[Op.or] = [
        { accountName: { [Op.like]: searchTerm } }, // Tìm theo accountName của SubmitRequest
        // { '$supervisorInfo.accountName$': { [Op.like]: searchTerm } }, // Tìm theo accountName của Supervisor
        // { '$category.approver$': { [Op.like]: searchTerm } }, // Tìm theo approver của Category
      ];
      delete params.filter.textSearch; // Xóa textSearch sau khi xử lý
    }

    // Xử lý các filter khác
    if (params.filter.supervisor) {
      whereClause['$supervisorInfo.accountName$'] = params.filter.supervisor;
      delete params.filter.supervisor;
    }

    if (params.filter.type) {
      whereClause['$category.type$'] = params.filter.type;
      delete params.filter.type;
    }

    if (params.filter.createdBy) {
      whereClause['$userCreate.accountName$'] = params.filter.createdBy;
      delete params.filter.createdBy;
    }

    // Xử lý status
    if (params.filter.status) {
      whereClause.status = { [Op.in]: params.filter.status.split(',') };
      delete params.filter.status;
    }

    // Xử lý thời gian
    if (params.filter.startDate && params.filter.endDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(params.filter.startDate),
        [Op.lte]: new Date(params.filter.endDate),
      };
      delete params.filter.startDate;
      delete params.filter.endDate;
    }

    // Thêm các filter còn lại vào whereClause
    Object.assign(whereClause, params.filter);
    const order = [];
    if (params.sort && Array.isArray(params.sort)) {
      const scoreSort = params.sort.find(([field]) => field === 'score');
      const categorySort = params.sort.find(([field]) => field === 'category');
      const otherSorts = params.sort.filter(([field]) => field !== 'score' && field !== 'category');
      order.push(...otherSorts);
      if (scoreSort) {
        const dir = (scoreSort[1] || 'DESC').toUpperCase();
        order.push([{ model: Category, as: 'category' }, 'score', dir]);
      }
      if (categorySort) {
        const dir = (categorySort[1] || 'DESC').toUpperCase();
        order.push([{ model: Category, as: 'category' }, 'name', dir]);
      }
    }
    // Query dữ liệu từ cơ sở dữ liệu
    const { count, rows } = await SubmitRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'supervisorInfo',
          attributes: ['id', 'accountName', 'email'],
        },
        {
          model: User,
          as: 'userCreate',
          attributes: ['id', 'accountName', 'email'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name', 'type', 'score', 'approver'],
        },
      ],
      limit,
      offset,
      order: order,
      subQuery: false, // Tránh conflict với JOIN
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(count / params.pageSize);

    // Trả về kết quả
    return {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      totalItems: count,
      totalPages,
      data: rows,
    };
  } catch (error) {
    logger.error('getListAll error:', error);
    throw new APIError(500, error.message);
  }
}

export async function exportData(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    // Tính toán limit và offset
    // Xây dựng điều kiện lọc (filter)
    const supervisorFilter = {};
    const categoryFilter = {};
    const creatByFilter = {};
    if (params.filter.supervisor) {
      supervisorFilter.accountName = params.filter.supervisor;
    }
    if (params.filter.type) {
      categoryFilter.type = params.filter.type;
    }
    if (params.filter.createdBy) {
      creatByFilter.accountName = params.filter.createdBy;
    }

    if (params.filter.textSearch) {
      // If status is a comma-separated string, split it into an array
      let textSearch = params.textSearch;
      if (typeof textSearch === 'string') {
        textSearch = textSearch.replace(/\\/g, String.raw`\\`);
        params.filter.accountName = { [Op.like]: `%${textSearch}%` };
      }
    }
    if (params.filter.status) {
      // If status is a comma-separated string, split it into an array
      params.filter.status = {
        [Op.in]: params.filter.status.split(',')
      };
    }
    if (params.filter.startDate && params.filter.endDate) {
      params.filter.createdAt = {
        [Op.gte]: new Date(params.filter.startDate),
        [Op.lte]: new Date(params.filter.endDate),

      }
    }
    delete params.filter.type;
    delete params.filter.supervisor;
    delete params.filter.createdBy;
    delete params.filter.startDate;
    delete params.filter.endDate;
    // Lấy dữ liệu từ cơ sở dữ liệu với phân trang
    const { count, rows } = await SubmitRequest.findAndCountAll({
      where: { ...params.filter }, include: [
        {
          model: User, // Đây là model của bảng users
          as: 'supervisorInfo', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'accountName', 'email'], // Chỉ lấy các trường cần thiết
          where: Object.keys(supervisorFilter).length ? supervisorFilter : undefined,
        },
        {
          model: User, // Đây là model của bảng users
          as: 'userCreate', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'accountName', 'email'], // Chỉ lấy các trường cần thiết
          where: Object.keys(creatByFilter).length ? creatByFilter : undefined,
        },
        {
          model: Category,
          as: 'category',
          attributes: ["name", "type", "score"],
          where: Object.keys(categoryFilter).length ? categoryFilter : undefined,
        },
      ], // Điều kiện where
      order: params.sort,
    });
    return {
      data: rows,
    };
  } catch (error) {
    logger.error('exportData submit error:', error);
    throw new APIError(500, error);
  }


}
export async function getListSubmitByApprover(params) {
  try {
    // console.log("==params===", params.user.dataValues.id);
    // Tính toán limit và offset
    const offset = (params.pageNumber) * params.pageSize;
    const limit = params.pageSize;
    // Xây dựng điều kiện lọc (filter)
    const supervisorFilter = {};
    const categoryFilter = {};
    const creatByFilter = {};
    if (params.filter.supervisor) {
      supervisorFilter.accountName = params.filter.supervisor;
    }
    if (params.filter.type) {
      categoryFilter.type = params.filter.type;
    }
    if (params.filter.createdBy) {
      creatByFilter.accountName = params.filter.createdBy;
    }

    delete params.filter.type;
    delete params.filter.supervisor;
    delete params.filter.createdBy;
    // Lấy dữ liệu từ cơ sở dữ liệu với phân trang
    const { count, rows } = await SubmitRequest.findAndCountAll({
      where: { ...params.filter, approver: params.user.dataValues.accountName }, include: [
        {
          model: User, // Đây là model của bảng users
          as: 'supervisorInfo', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'accountName', 'email'], // Chỉ lấy các trường cần thiết
          where: Object.keys(supervisorFilter).length ? supervisorFilter : undefined,
        },
        {
          model: User, // Đây là model của bảng users
          as: 'userCreate', // Alias (phải khớp với alias được định nghĩa trong quan hệ)
          attributes: ['id', 'accountName', 'email'], // Chỉ lấy các trường cần thiết
          where: Object.keys(creatByFilter).length ? creatByFilter : undefined,
        },
        {
          model: Category,
          as: 'category',
          attributes: ["name", "type", "score"],
          where: Object.keys(categoryFilter).length ? categoryFilter : undefined,
        },
      ], // Điều kiện where
      limit, // Số lượng bản ghi trả về
      offset, // Vị trí bắt đầu
      order: params.sort,
    });
    // if(type !=="all"){
    //    count, rows  = await SubmitRequest.findAndCountAll({
    //     where: { supervisor: params.user.dataValues.id, status:type }, // Điều kiện where
    //     limit, // Số lượng bản ghi trả về
    //     offset, // Vị trí bắt đầu
    //   });
    // }

    // Tính tổng số trang
    const totalPages = Math.ceil(count / params.pageSize);
    return {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      totalItems: count,
      totalPages,
      data: rows,
    };
  } catch (error) {
    logger.error('supervisorApprove submit error:', error);
    throw new APIError(500, error);
  }
}
export async function countWaitingConfirm(params) {
  try {
    console.log(params)
    const mySubmitCount = await SubmitRequest.count({
      where: {
        createBy: params.user.id,
       
        status: {
          [Op.in]: ['WAITING', 'CONFIRMED']
        }
      }
    });

    const needConfirmCount = await SubmitRequest.count({
      where: {
        [Op.or]: [
          { supervisor: params.user.id },
          { approver: params.user.accountName }
        ],
        status: {
          [Op.in]: ['WAITING', 'CONFIRMED']
        }
      }
    });

    const adminWhereClause = {
      status: {
        [Op.in]: ['WAITING', 'CONFIRMED']
      }
    };
    if (params.filter) {
      Object.assign(adminWhereClause, params.filter);
    }
    const adminCount = await SubmitRequest.count({
      where: adminWhereClause
    });

    return {
      mySubmitTotal: mySubmitCount,
      needConfirmTotal: needConfirmCount,
      adminTotal: adminCount
    };
  } catch (error) {
    logger.error('countWaitingConfirm error:', error);
    throw new APIError(500, error.message);
  }
}