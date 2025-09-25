import { FormControl } from '@angular/forms';
import { VALIDATOR_REGEX_CONSTANT } from '../constants/regex.constant';
import { ValidatorModel } from '../models/validator.model';
import { ERRORS_CONSTANT } from '../constants/error.constants';
import { DateTimeUtils } from './date-times.utils';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

const errors = ERRORS_CONSTANT;
export const VALIDATORS_UTILS = {
  /**
   * passwordStrengthValidator - Validator password
   * @param control object form control.
   */
  passwordStrengthValidator(control: FormControl) {
    const valid = VALIDATOR_REGEX_CONSTANT.password.test(control.value);
    const returnParams: ValidatorModel = {
      status: true,
      message: ERRORS_CONSTANT.VALIDATOR.PASSWORD
    };
    return valid ? null : { passwordStrength: returnParams };
  },
  /**
   * userNameValidator - Validator username
   * @param control object form control.
   */
  userNameValidator(control: FormControl) {
    const valid = VALIDATOR_REGEX_CONSTANT.userName.test(control.value);
    const returnParams: ValidatorModel = {
      status: true,
      message: errors.VALIDATOR.USERNAME
    };
    return valid ? null : { userName: returnParams };
  },
  /**
   * Using for check white space of field
   * @param control FormControl
   * @returns formcontrol rule.
   */
  noWhiteSpaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    const returnParams: ValidatorModel = {
      status: true,
      message: errors.VALIDATOR.EMPTY
    };
    return isValid ? null : { whitespace: returnParams };
  },
  /**
   * Using for check space of field
   * @param control FormControl
   * @returns formcontrol rule.
   */
  noHaveSpaceValidator(control: FormControl) {
    const isSpace = (control.value || '').includes(' ');
    const isValid = !isSpace;
    const returnParams: ValidatorModel = {
      status: true,
      message: errors.VALIDATOR.NO_SPACE
    };
    return isValid ? null : { space: returnParams };
  },
  /**
   * Validator url
   * @param control FormControl
   * @returns formcontrol rule.
   */
  urlValidator(control: FormControl) {
    const returnParams: ValidatorModel = {
      status: true,
      message: errors.VALIDATOR.INVALID_URL
    };
    try {
      const url = new URL(control.value);
      return null;
    } catch (error) {
      if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          control.value
        )
      ) {
        return null;
      }
      return { url: returnParams };
    }
  },
  /**
   * Validator url with port
   * @param control FormControl
   * @returns formcontrol rule.
   */
  urlValidatorWithPort(control: FormControl) {
    const returnParams: ValidatorModel = {
      status: true,
      message: errors.VALIDATOR.INVALID_URL
    };
    try {
      const url = new URL(control.value);
      return null;
    } catch (error) {
      if (
        /^((https?:\/\/)|(www.))?(?:([a-zA-Z]+)|(\d+\.\d+.\d+.\d+))(:(\d+))?$/.test(
          control.value
        )
      ) {
        return null;
      }
      return { url: returnParams };
    }
  },

  /**
   * Validator date
   * @param control FormControl
   * @returns formcontrol rule.
   */
  dateValidator(control: FormControl) {
    const inValid = VALIDATOR_REGEX_CONSTANT.date.test(control.value);
    const returnParams: ValidatorModel = {
      status: true,
      message: errors.VALIDATOR.INVALID_DATE_FORMAT
    };
    return inValid ? null : { date: returnParams };
  },
  /**
   * Validator phone
   * @param control FormControl
   * @returns formcontrol rule.
   */
  phoneNumberValidator(control: FormControl) {
    if (control.value && control.value.length > 0) {
      const valid = VALIDATOR_REGEX_CONSTANT.phone.test(control.value);
      const returnParams: ValidatorModel = {
        status: true,
        message: errors.VALIDATOR.INVALID_PHONE
      };
      return valid ? null : { phone: returnParams };
    } else {
      return null;
    }
  },

  /**
   * Validator date range
   * @param control FormControl
   * @returns formcontrol rule.
   */
  dateRangeValidator(control: FormControl) {
    const startDate = control.get('startDate').value;
    const endDate = control.get('endDate').value;
    const dateTimeUtils = new DateTimeUtils();

    if (
      startDate &&
      endDate &&
      dateTimeUtils.dateObjectToTimeStamp(startDate) >
        dateTimeUtils.dateObjectToTimeStamp(endDate)
    ) {
      const returnParams: ValidatorModel = {
        status: true,
        message: errors.VALIDATOR.DATE_RANGGE
      };
      return { dateRange: returnParams };
    }

    return null;
  },

  /**
   * Validator date time
   * @param control FormControl
   * @returns formcontrol rule.
   */
  dateTimeValidator(control: FormControl) {
    const startTime = control.get('startTime').value;
    const endTime = control.get('endTime').value;
    const dateTimeUtils = new DateTimeUtils();

    if (
      startTime &&
      endTime &&
      dateTimeUtils.dateTimeObjectToTimeStamp(startTime) >
        dateTimeUtils.dateTimeObjectToTimeStamp(endTime)
    ) {
      const returnParams: ValidatorModel = {
        status: true,
        message: errors.VALIDATOR.DATE_RANGGE
      };
      return { dateRange: returnParams };
    }

    return null;
  },

  /**
   * Regex for validator form
   * @param reg string
   * @returns formcontrol
   */
  regexValidator(reg: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !control.value.toString().match(reg)) {
        return { decimal: true };
      }
      return null;
    };
  }
};
