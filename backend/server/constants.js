import path from 'path';

/**
 * The global constants
 */
export const MEGABYTE = 1024 * 1024;
export const MAX_UPLOAD_FILE_SIZE_MB = 25;
export const MAX_UPLOAD_FILE_SIZE_BYTE = MAX_UPLOAD_FILE_SIZE_MB * MEGABYTE;
export const ROOT_PATH = path.resolve(__dirname, '../');
export const UPLOADS_DESTINATION = 'uploads';
export const FLOW_SAVE_DESTINATION = 'flow-data';

export const BCRYPT_SALT_ROUNDS = 12;
export const USER_JWT_DEFAULT_EXPIRE_DURATION = '10d';
export const FORGOT_PASSWORD_EXPIRE_DURATION = '30m';
export const MORGAN_FORMAT = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
export const USER_MIN_PASSWORD_LENGTH = 8;
export const DEFAULT_LANGUAGE = 'vi';
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 200;

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
};

export const USER_STATUS = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const BANK_ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};
export const PROCESS_STATUS = {
  WAITING: 'WAITING',
  CONFIRMED: 'CONFIRMED',
  APPROVED: 'APPROVED',
  CANCEL: 'CANCEL',
  REJECT: 'REJECT',
};
export const BANK_ACCOUNT_TYPE = {
  ACCOUNT: 'ACCOUNT',
  CARD: 'CARD',
};

export const PAYMENT_HISTORY_STATUS = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const PAYMENT_TYPES = {
  VNP: 'VNP',
  MOMO: 'MOMO',
  PAYME: 'PAYME',
};

export const WHITELIST_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const ASSET_STATUS = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  WHITELIST_SOON: 'WHITELIST_SOON',
  WHITELIST_OPENING: 'WHITELIST_OPENING',
  PREPARE_FOR_SALE: 'PREPARE_FOR_SALE',
  OPENING: 'OPENING',
  CLOSED: 'CLOSED',
  EXPIRED: 'EXPIRED',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const RESEND_EMAIL_AFTER_FAILED = 120000;
export const WORKER_NAME = {
  SEND_MAIL: 'SEND_MAIL',
  PAYMENT_ASSET: 'PAYMENT_ASSET',
};

export const EMAIL_COMMON_FIELDS = {
  emailSignature: `
  <div></div>
  `,
  companyName: '',
  website: '',
};

export const REDIS_KEYS = {
  MAIL_TEMPLATE: 'MAIL_TEMPLATE',
};

export const SEQUENCES = {
  ASSET_ID: 'ASSET_ID',
  PAYMENT_ID: 'PAYMENT_ID',
  REFUND_ID: 'REFUND_ID',
  CATEGORY_ID: 'CATEGORY_ID'
};

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const DEFAULT_CURRENCY = 'VND';
export const PAYMENT_FEE = 0.015;

export const VNP_BANKS = [
  {
    id: 1,
    code: 'ABBANK',
    name: 'Ngân hàng thương mại cổ phần An Bình (ABBANK)',
    logo: 'abbank_logo.png',
  },
  {
    id: 13,
    code: 'NCB',
    name: 'Ngân hàng Quốc dân (NCB)',
    logo: 'ncb_logo.png',
  },
];
export const PAYME_RESPONSE_CODE = {
  CREATE_PAYMENT_SUCCEEDED: 105000,
  QUERY_ORDER_SUCCEEDED: 105002,
  REFUND_ORDER_SUCCEEDED: 105003,
  PARTNER_TRANSACTION_CODE_EXISTED: 105101,
};
export const PAYME_PAYMETHOD = {
  PAYME: 'PAYME',
  ATMCARD: 'ATMCARD',
  CREDITCARD: 'CREDITCARD',
  VIETQR: 'VIETQR',
  QRPAY: 'QRPAY',
  BANKTRANSFER: 'BANKTRANSFER',
};

export const REFERRAL = {
  EXPIRE_DURATION: '100d',
  PERCENT: 100,
};

export const REFUND_HISTORY_STATUS = {
  NEW: 'NEW',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};
