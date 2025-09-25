/**
 * Manage all key for display error
 */
export const ERRORS_CONSTANT = {
  WRONG_USER_PASS: 'LOGIN.WRONG_USER_PASS',
  GENERAL: {
    UNEXPECTED_ERROR: 'ERRORS.UNEXPECTED_ERROR',
    BOX_NOT_FOUND: 'Box not found!',
    INVALID_INPUT: 'Input value is invalid!',
    CAN_NOT_ACTIVE_DEPARTMENT_BECAUSE_IT_GOT_ONE_OR_MORE_PARRENT_DEPARTMENT_INACTIVE: 'Can not active department. Because the parent department inactive',
    CAN_NOT_ACTIVE_AREA_BECAUSE_IT_GOT_ONE_OR_MORE_PARRENT_AREA_INACTIVE: 'Can not active area. Because the parent area inactive',
    DUPLICATES: 'Duplicated',
    YOUR_ACCOUNT_HAS_BEEN_LOCKED: 'Your account has been locked',
    THE_ACCOUNT_HAS_NOT_BEEN_ACTIVATED: 'The account has not been activated',
    USER_NOT_FOUND: 'User not found!',
    CUSTOMER_NOT_FOUND: 'Customer not found!'
  },
  USERS: {
    FILE_IMPORT_INVALID:
      'Your file or content is invalid, please check your file and try again!',
    DUPLICATES:
      'Account duplicated, please remove duplicate account and try again!',
    INVALID_FILE_IMPORT:
      'Your file or content is invalid, please check your file and try again!',
    INVALID_INPUT: 'Input value is invalid!',
    DUPLICATES_EMAIL: "Duplicated email"
  },
  ROLES: {
    DUPLICATES:
      'This role name is duplicated, please change role name and try again!',
    INVALID_INPUT: 'Input value is invalid!'
  },
  ROLE_DATA: {
    ROLE_REQUIRED: 'Role is required!',
    REQUIRE_DEPARTMENT_AREA: 'Department or area must have at least one value.'
  },
  USER_PROFILE: {},
  VALIDATOR: {
    PASSWORD:
      'Password invalid. Password must include uppercase, lowercase, special character and at least 6 charecters.',
    PASSWORD_NOT_MATCH: 'New password and re password does not match',
    USERNAME:
      'Username invalid. Username can only use letters, numbers, underscores, and periods, minimum 3 charecters, maximum 50 charecters.',
    EMPTY: 'This field is empty',
    INVALID_URL: 'Invalid url.',
    INVALID_DATE_FORMAT: 'Invalid date format.',
    INVALID_EMAIL: 'Invalid email format.',
    FIELD_REQUIRED: 'This field is required.',
    FIELD_NUMBER: 'This field is number.',
    TRIM_SPACE: 'Vehicle number does not contain whitespace.',
    VOLUME_MIN_MAX: "Volume must be greater than 0 and less than 100.",
    PHONE_NUMBER: "Phone number include only number and have 10 characters.",
    INVALID_PHONE: 'Invalid phone number format',
    DATE_RANGGE: 'End date must be after start date.',
    NO_SPACE: 'This file not exist space',
    INVALID_STREAMING_ORDER_RANGE_VALUE:
      'The input value must be a positive integer between 0 and 100. Please try again!',
    INVALID_BUFFER_RANGE_VALUE:
      'The input value must be a positive integer between 0 and 10000. Please enter a new value!',
    INVALID_LIMIT_TRAFFIC_RANGE_VALUE:
      'The input value must be a positive integer between 0 and 1000000. Please enter a new value!',
    INVALID_TIME_DURATION_VALUE:
      'The input value must be between 1 and 1800.',
    INVALID_INTEGER: 'The input value must be a positive integer.',
    INVALID_MIN_0 : 'The input value must more than 0.',
    INVALID_MAX : 'The input value must less than '
  },
  ZONE_MANAGEMENT:{
    CONTRON_AREA : {
      DUPLICATES: 'Farm is being duplicated infor!',
      CAMERA_IN_OTHER_CONTROL_ZONE: 'Camera exits in other farm!'
    },
    USER_IN_WORKSHIFT: {
      USER_IN_OTHER_WORKSHIFT_TIME: 'User exits in other farm!'
    }
  },
  VEHICLE: {
    DUPLICATES:
      'The vehicle number was registered during this period, please try again!'
  }
};
