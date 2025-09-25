import * as SubmitRequest from './submitRequest.service';
import { ROOT_PATH } from '../../constants';
import APIError from '../../util/APIError';
import { log } from 'winston';
// import * as PaymentHistoryService from "../paymentHistory/paymentHistory.service";
// import { getReferralInviteeqqq } from "./user.service";
import ExcelJS from 'exceljs';
export async function submit(req, res, next) {
  try {
    const {
      accountName,
      descriptions,
      supervisor,
      approver,
      category,
      hasNotifyMail
    } = req.body;
    const submit = await SubmitRequest.submit({
      // firstName: firstName,
      // lastName: lastName,
      accountName,
      // phone: phone,
      descriptions,
      supervisor,
      approver,
      category,
      hasNotifyMail,
      user: req.auth
    });

    return res.json({
      payload: submit,
    });
  } catch (error) {
    return next(error);
  }
}

export async function UpdateSubmit(req, res, next) {
  try {
    const {
      id,
      accountName,
      descriptions,
      supervisor,
      category,
      hasNotifyMail
    } = req.body;
    //  console.log("req.auth==",req.auth)
    const result = await SubmitRequest.updateSubmit({
      id,
      accountName,
      descriptions,
      supervisor,
      category,
      hasNotifyMail,
      user: req.auth
    });

    return res.json({
      ...result
    });
  } catch (error) {
    return next(error);
  }
}
export async function getListSubmit(req, res, next) {
  try {
    const pageNumber = parseInt(req.query.pagenumber) || 0;
    const pageSize = parseInt(req.query.pagesize) || 20;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.approver) filter.approver = req.query.approver;
    if (req.query.suppervisorApproved) filter.suppervisorApproved = req.query.suppervisorApproved;
    if (req.query.approverApproved) filter.approverApproved = req.query.approverApproved;
    if (req.query.accountName) filter.accountName = req.query.accountName;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.supervisor) filter.supervisor = req.query.supervisor;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    if (req.query.startdate) filter.startDate = req.query.startdate;
    if (req.query.enddate) filter.endDate = req.query.enddate;
    if (req.query.textSearch) filter.textSearch = req.query.textSearch; // Sửa thành filter.textSearch
    let sort = [];
    if (req.query.sortField && req.query.sortDirection) {
      sort.push([req.query.sortField, req.query.sortDirection.toUpperCase()]);
    } else {
      sort.push(["createdAt", "DESC"]);
    }

    const result = await SubmitRequest.getListSubmit({
      id: req.auth.dataValues.id,
      pageNumber,
      pageSize,
      sort,
      filter
    });

    return res.json({ ...result });
  } catch (error) {
    return next(error);
  }
}

export async function getListRank(req, res, next) {
  try {
    // Lấy pageNumber và pageSize từ query parameters
    const pageNumber = parseInt(req.query.pagenumber, 10) || 0; // Default là 1 nếu không được truyền
    const pageSize = parseInt(req.query.pagesize, 10) || 10;
    const filter = {
      pageNumber, pageSize
    }
    if (req.query.startdate) filter.startDate = req.query.startdate;
    if (req.query.enddate) filter.endDate = req.query.enddate;
    //  console.log("req.auth==",req.auth)
    const result = await SubmitRequest.getListRank(filter);

    return res.json({
      ...result
    });
  } catch (error) {
    return next(error);
  }
}
export async function getListAssign(req, res, next) {
  try {
    // Lấy pageNumber và pageSize từ query parameters
    const pageNumber = parseInt(req.query.pagenumber) || 0; // Default là 1 nếu không được truyền
    const pageSize = parseInt(req.query.pagesize) || 10;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.textSearch) filter.textSearch = req.query.textSearch;
    if (req.query.approver) filter.approver = req.query.approver;
    if (req.query.suppervisorApproved) filter.suppervisorApproved = req.query.suppervisorApproved;
    if (req.query.approverApproved) filter.approverApproved = req.query.approverApproved;
    if (req.query.accountName) filter.accountName = req.query.accountName;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.supervisor) filter.supervisor = req.query.supervisor;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    if (req.query.startdate) filter.startDate = req.query.startdate;
    if (req.query.enddate) filter.endDate = req.query.enddate;
    // Sort conditions from query params
    let sort = [];
    if (req.query.sortField && req.query.sortDirection) {
      const field = req.query.sortField; // e.g., "createdAt"
      const direction = req.query.sortDirection.toUpperCase(); // e.g., "ASC" or "DESC"
      sort.push([field, direction]);
    } else {
      sort.push(["createdAt", "DESC"]);
    }

    const result = await SubmitRequest.getListAssgin({ pageNumber, pageSize, sort, filter, user: req.auth });

    return res.json({
      ...result
    });
  } catch (error) {
    return next(error);
  }
}

export async function comments(req, res, next) {
  try {
    const {
      id,
      descriptions,
    } = req.body;
    //  console.log("req.auth==",req.auth)

    const submit = await SubmitRequest.comments({
      id,
      descriptions,
      user: req.auth,
    });

    return res.json({
      dataSubmit: submit,
    });
  } catch (error) {
    return next(error);
  }
}
export async function getComments(req, res, next) {
  try {
    const submitId = req.query.submitId;
    const submit = await SubmitRequest.getComments(submitId);

    return res.json({
      dataSubmit: submit,
    });
  } catch (error) {
    return next(error);
  }
}
export async function Approve(req, res, next) {
  try {
    const {
      id,
      approve,
      descriptions,
    } = req.body;
    //  console.log("req.auth==",req.auth)

    const submit = await SubmitRequest.Approve({
      id,
      approve,
      descriptions,
      user: req.auth,
    });

    return res.json({
      ...submit,
    });
  } catch (error) {
    return next(error);
  }
}


export async function adminApprove(req, res, next) {
  try {
    const {
      id,
      approve,
      descriptions,
    } = req.body;
    //  console.log("req.auth==",req.auth)

    const submit = await SubmitRequest.adminApprove({
      id,
      approve,
      descriptions,
      user: req.auth,
    });

    return res.json({
      ...submit,
    });
  } catch (error) {
    return next(error);
  }
}

export async function ApproverApprove(req, res, next) {
  try {
    const {
      id,
      approve,
      descriptions,
    } = req.body;
    //  console.log("req.auth==",req.auth)

    const submit = await SubmitRequest.ApproverApprove({
      id,
      approve,
      descriptions,
      user: req.auth,
    });

    return res.json({
      ...submit,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getListAll(req, res, next) {
  try {
    // Lấy pageNumber và pageSize từ query parameters
    const pageNumber = parseInt(req.query.pagenumber) || 0; // Default là 1 nếu không được truyền
    const pageSize = parseInt(req.query.pagesize) || 10;
    // const type = (req.query.type) || 'all';
    // Filter conditions from query params
    const filter = {};
    if (req.query.textSearch) filter.textSearch = req.query.textSearch; //day la filter.textSearch
    if (req.query.status) filter.status = req.query.status;
    if (req.query.approver) filter.approver = req.query.approver;
    if (req.query.suppervisorApproved) filter.suppervisorApproved = req.query.suppervisorApproved;
    if (req.query.approverApproved) filter.approverApproved = req.query.approverApproved;
    if (req.query.accountName) filter.accountName = req.query.accountName;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.supervisor) filter.supervisor = req.query.supervisor;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    if (req.query.startdate) filter.startDate = req.query.startdate;
    if (req.query.enddate) filter.endDate = req.query.enddate;

    console.log(filter.accountName + "filter.accountName")
    console.log(filter.textSearch + "filter.textSearch")
    console.log(filter.status + "filter.status")
    console.log(filter.approver + "filter.approver")
    console.log(filter.suppervisorApproved + "filter.suppervisorApproved")
    // Sort conditions from query params
    let sort = [];
    if (req.query.sortField && req.query.sortDirection) {
      const field = req.query.sortField; // e.g., "createdAt"
      const direction = req.query.sortDirection.toUpperCase(); // e.g., "ASC" or "DESC"
      sort.push([field, direction]);
    } else {
      sort.push(["createdAt", "DESC"]);
    }
    const result = await SubmitRequest.getListAll({ pageNumber, pageSize, sort, filter, user: req.auth });

    return res.json({
      ...result
    });
  } catch (error) {
    return next(error);
  }
}

export async function exportData(req, res, next) {
  try {
    // Lấy pageNumber và pageSize từ query parameters
    // const pageNumber = parseInt(req.query.pagenumber) || 0; // Default là 1 nếu không được truyền
    // const pageSize = parseInt(req.query.pagesize) || 10;
    // const type = (req.query.type) || 'all';
    // Filter conditions from query params
    const filter = {};
    if (req.query.textSearch) filter.textSearch = req.query.textSearch;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.approver) filter.approver = req.query.approver;
    if (req.query.suppervisorApproved) filter.suppervisorApproved = req.query.suppervisorApproved;
    if (req.query.approverApproved) filter.approverApproved = req.query.approverApproved;
    if (req.query.accountName) filter.accountName = req.query.accountName;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.supervisor) filter.supervisor = req.query.supervisor;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    if (req.query.startdate) filter.startDate = req.query.startdate;
    if (req.query.enddate) filter.endDate = req.query.enddate;
    // Sort conditions from query params
    let sort = [];
    if (req.query.sortField && req.query.sortDirection) {
      const field = req.query.sortField; // e.g., "createdAt"
      const direction = req.query.sortDirection.toUpperCase(); // e.g., "ASC" or "DESC"
      sort.push([field, direction]);
    } else {
      sort.push(["createdAt", "DESC"]);
    }
    const result = await SubmitRequest.exportData({ sort, filter, user: req.auth });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Export Data');

    // Header row
    worksheet.addRow([
      'No', 'userCreate', 'accountName', 'category', 'descriptions', 'approver', 'supervisor', 'score', 'status', 'createdAt'
    ]);

    // Data rows
    // console.log("============")
    result.data.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.userCreate?.accountName || '',
        item?.accountName || '',
        item?.category?.name || '',
        item?.descriptions || '',
        item?.approver || '',
        item?.supervisorInfo?.accountName || '',
        item.category?.score || '',
        item.status || '',
        new Date(item.createdAt).toLocaleDateString() || '',
      ]);

      // console.log([
      //   index + 1,
      //   item.userCreate?.accountName || '',
      //   item?.descriptions || '',
      //   item?.approver || '',
      //   item?.supervisorInfo?.accountName || '',
      //   item.category?.score || '',
      //   item.status || '',
      //   item.createdAt?.toISOString() || '',
      // ]);
    });

    // Response headers
    res.setHeader('Content-Disposition', 'attachment; filename=ExportData.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Ghi file ra response (stream về client)
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    return next(error);
  }
}
export async function sumary(req, res, next) {
  try {

    const result = await SubmitRequest.sumary({ user: req.auth });

    return res.json({
      ...result
    });
  } catch (error) {
    return next(error);
  }
}
export async function getListSubmitApprover(req, res, next) {
  try {
    // Lấy pageNumber và pageSize từ query parameters
    const pageNumber = parseInt(req.query.pagenumber) || 0; // Default là 1 nếu không được truyền
    const pageSize = parseInt(req.query.pagesize) || 10;
    // const type = (req.query.type) || 'all';
    // Filter conditions from query params
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.textSearch) filter.textSearch = req.query.textSearch;
    // if (req.query.approver) filter.approver = req.query.approver;
    if (req.query.suppervisorApproved) filter.suppervisorApproved = req.query.suppervisorApproved;
    if (req.query.approverApproved) filter.approverApproved = req.query.approverApproved;
    if (req.query.accountName) filter.accountName = req.query.accountName;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.supervisor) filter.supervisor = req.query.supervisor;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    // Sort conditions from query params
    let sort = [];
    if (req.query.sortField && req.query.sortDirection) {
      const field = req.query.sortField; // e.g., "createdAt"
      const direction = req.query.sortDirection.toUpperCase(); // e.g., "ASC" or "DESC"
      sort.push([field, direction]);
    } else {
      sort.push(["createdAt", "DESC"]);
    }
    const result = await SubmitRequest.getListSubmitByApprover({ pageNumber, pageSize, sort, filter, user: req.auth });

    return res.json({
      ...result
    });
  } catch (error) {
    return next(error);
  }
}

export async function countWaitingConfirmHandler(req, res, next) {
  try {
    const params = {
      user: req.auth.dataValues, // Dùng cho mySubmitCount
    };

    const result = await SubmitRequest.countWaitingConfirm(params);

    return res.json({
      mySubmitTotal: result.mySubmitTotal,
      needConfirmTotal: result.needConfirmTotal,
      adminTotal: result.adminTotal
    });
  } catch (error) {
    return next(error);
  }
}