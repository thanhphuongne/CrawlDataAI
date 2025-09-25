/* eslint-disable no-var */
import { SearchDateType } from '../constants/enums/search-date-type.enum';
import { TimeSelectInfo } from '../models/time-select-info.model';
import { DateTimeStruct } from '../models/date-time-struct.model';
import moment from 'moment';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { intervalToDuration } from 'date-fns';

export enum DateFormatEnum {
  SYSTEM_FORMAT = 'YYYY-MM-DD',
  SYSTEM_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss',
  DEFAULT_FORMAT = 'DD/MM/YYYY',
  DEFAULT_FORMAT_PIPE = 'dd/MM/YYYY',
  FULL_DATE_FORMAT = 'MM/DD/YYYY',
  DATE_TIME_12_FORMAT = 'DD/MM/YYYY hh:mm:ss A',
  DATE_TIME_24_FORMAT = 'HH:mm:ss DD/MM/YYYY',
  DATE_HOUR_24_FORMAT = 'HH:mm DD/MM/YYYY',
  DATE_HOUR_24_PIPE = 'H:mm dd/MM/YYYY',
  DATE_TIME_24_SECOND = 'HH:mm:ss dd/MM/YYYY',
  TIME_12_FORMAT = 'hh:mm:ss A',
  TIME_24_FORMAT = 'HH:mm:ss',
  FILE_NAME_FORMAT = 'YYYYMMDDHHmmss',
  MONTH_FORMAT = 'MM/YYYY',
  YEAR_FORMAT = 'YYYY',
  DATE_FORMAT = 'DD/MM',
  SYSTEM_DATE_TIME = 'dd/MM/YYYY HH:mm',
}

export class DateTimeUtils {
  /**
   * Convert date object to timestamp
   * @param dateObj date object
   * @param endOfDay boolean - Return time stamp with time is end of day
   * @returns number
   */
  dateObjectToTimeStamp(
    dateObj: {
      year: number;
      month: number;
      day: number;
    },
    endOfDay: boolean = false,
  ) {
    // restrict update base data
    const obj = {
      ...dateObj,
      ...{
        month: dateObj.month - 1,
      },
    };
    return moment(obj).valueOf() + (endOfDay ? 24 * 60 * 60 * 1000 - 1 : 0);
  }

  /**
   * Convert date time object to timestamp
   * @param dateObj date time object
   * @returns number
   */
  dateTimeObjectToTimeStamp(dateObj: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  }) {
    // restrict update base data
    const obj = {
      ...dateObj,
      ...{
        month: dateObj.month - 1,
      },
    };
    return moment(obj).valueOf();
  }
  /**
   * Convert date object to date string
   * @param dateObj object date
   * @param format string format data return
   * @returns date string
   */
  dateObjectToDateString(
    dateObj: {
      year: number;
      month: number;
      day?: number;
    },
    format?: string,
  ) {
    // restrict update base data
    if (dateObj) {
      const obj = {
        ...dateObj,
        ...{
          month: dateObj.month - 1,
        },
      };
      return moment(obj).format(format || DateFormatEnum.DEFAULT_FORMAT);
    }
  }

  /**
   * Convert hour object to string
   * @param hourObj object hour
   * @returns string
   */
  hourObjectToString(hourObj: NgbTimeStruct) {
    if (hourObj) {
      return `${hourObj.hour > 9 ? hourObj.hour : '0' + hourObj.hour}:${
        hourObj.minute > 9 ? hourObj.minute : '0' + hourObj.minute
      }`;
    }
    return null;
  }

  /**
   * Convert string to hour object
   * @param time string
   * @returns object hour
   */
  stringToHourObj(time: string) {
    if (time) {
      const listTime: Array<string> = time.split(':');
      return {
        hour: Number(listTime?.[0] || 0),
        minute: Number(listTime?.[1] || 0),
        second: Number(listTime?.[2] || 0),
      };
    }
    return null;
  }

  /**
   * Convert date time object to UTC time
   * @param dateObj object dateTime
   * @returns utc Date time
   */
  dateTimeObjectToDateTimeUTC(dateTimeObj: DateTimeStruct) {
    // restrict update base data
    if (dateTimeObj) {
      const obj = {
        ...dateTimeObj,
        ...{
          month: dateTimeObj.month - 1,
        },
      };
      return moment(obj).utc().format();
    }
  }

  /**
   * Convert date time object to date time string
   * @param dateObj object dateTime
   * @param format string format data return
   * @returns date string
   */
  dateTimeObjectToDateTimeString(dateTimeObj: DateTimeStruct, format?: string) {
    // restrict update base data
    if (dateTimeObj) {
      const obj = {
        ...dateTimeObj,
        ...{
          month: dateTimeObj.month - 1,
        },
      };
      return moment(obj).format(format || DateFormatEnum.DATE_TIME_24_FORMAT);
    }
  }
  /**
   * Convert date time object to date time
   * @param dateObj object dateTime
   * @returns date string
   */
  dateTimeObjectToDateTime(dateTimeObj: DateTimeStruct) {
    if (dateTimeObj) {
      const obj = {
        ...dateTimeObj,
        ...{
          month: dateTimeObj.month - 1,
        },
      };
      return moment(obj).format();
    }
  }
  /**
   * Convert date string to date object
   * @param date  date string
   * @param format string format data return
   * @returns date object
   */
  dateToDateObject(date: string, format?: string) {
    const dateObj = moment(
      date,
      format || DateFormatEnum.SYSTEM_FORMAT,
    ).toObject();
    return {
      year: dateObj.years,
      month: dateObj.months + 1,
      day: dateObj.date,
    };
  }

  /**
   * Convert string to new date.
   * @param date string
   * @returns new date.
   */
  stringToNewDate(date: string) {
    return new Date(date);
  }

  /**
   * Convert date to date object
   * @param date  Date
   * @returns date object
   */
  newDateToDateObject(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  /**
   * Convert date to date object
   * @param date  Date
   * @returns date object
   */
  newDateToDateObjectDateHour(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours() || 0,
      minute: date.getMinutes() || 0,
      second: date.getSeconds() || 0,
    };
  }

  /**
   * set date when additional months
   * @param month number of additional months
   * @param dateObj date
   * @returns date object
   */
  setValueEndDate(
    month: number,
    dateObj: {
      year: number;
      month: number;
      day: number;
    },
  ) {
    const dateTemp: {
      year: number;
      month: number;
      day?: number;
    } = {
      year: dateObj.year,
      month: dateObj.month + month,
    };
    if (dateTemp.month > 12) {
      ++dateTemp.year;
      dateTemp.month = dateTemp.month - 12;
    }

    const dateEndInMonth = +moment(
      this.dateObjectToDateString(dateTemp, DateFormatEnum.MONTH_FORMAT),
      DateFormatEnum.MONTH_FORMAT,
    ).daysInMonth();

    dateTemp.day = dateObj.day;
    if (dateTemp.day > dateEndInMonth) dateTemp.day = +dateEndInMonth;

    return dateTemp;
  }

  /**
   * Calculator month between start date and end date
   * @param startDate is start date
   * @param endDate is end date
   * @returns number
   */
  calculatorMonth(
    startDate: {
      year: number;
      month: number;
      day: number;
    },
    endDate: {
      year: number;
      month: number;
      day: number;
    },
  ) {
    const endDateTemp: {
      year: number;
      month: number;
    } = {
      year: endDate.year,
      month: endDate.month,
    };
    const dateEndInMonthOfEndDate = +moment(
      this.dateObjectToDateString(endDateTemp, DateFormatEnum.MONTH_FORMAT),
      DateFormatEnum.MONTH_FORMAT,
    ).daysInMonth();

    if (
      startDate.day === endDate.day ||
      (startDate.day >= dateEndInMonthOfEndDate &&
        endDate.day === dateEndInMonthOfEndDate)
    ) {
      return (
        (endDate.year - startDate.year) * 12 + endDate.month - startDate.month
      );
    }
    return 0;
  }

  /**
   * Convert timestamp to date string.
   * @param timeStamp number time stamp
   * @param dateFormat string, format of date
   * @returns date string.
   */
  timeStampToDateString(timeStamp: number, dateFormat?: string) {
    return moment(timeStamp).format(
      dateFormat || DateFormatEnum.DATE_TIME_24_FORMAT,
    );
  }

  /**
   * Convert date time string to DateTimeStruct object
   * @param date date string
   * @param dateFormat string, format date time
   * @returns DateTimeStruct object
   */
  dateTimeStringToObject(date: string, dateFormat?: string) {
    try {
      const dateObj = moment(
        date,
        dateFormat || DateFormatEnum.DATE_TIME_24_FORMAT,
      ).toObject();
      const dateTime: DateTimeStruct = {
        year: dateObj.years,
        month: dateObj.months + 1,
        day: dateObj.date,
        hour: dateObj?.hours || 0,
        minute: dateObj?.minutes || 0,
        second: dateObj?.seconds || 0,
      };
      return dateTime;
    } catch {
      return null;
    }
  }

  /**
   * Validate with max date 31/12/2999.
   * @param dateObj object date
   * @returns boolean
   */
  validateMaxDate(dateObj: { year: number; month: number; day: number }) {
    return (
      this.dateObjectToTimeStamp(dateObj) >
      this.dateObjectToTimeStamp({
        year: 2999,
        month: 12,
        day: 31,
      })
    );
  }

  /**
   * Reformat system hour string to human hour string reable
   * @param hour string, hour string
   * @returns string, hour format
   */
  hourStringFormatToVisualTime(hour: string) {
    try {
      if (hour) {
        const timeObj = moment(hour, DateFormatEnum.TIME_24_FORMAT);
        const minuteTime = timeObj.minute();
        const time = minuteTime > 10 ? minuteTime : '0' + minuteTime;
        return timeObj.hours() + 'h' + (minuteTime === 0 ? '' : time);
      } else {
        return '__';
      }
    } catch {
      return hour;
    }
  }

  /**
   * Calculate time between two datetime angular
   * @param startTime number, TimeStamp
   * @param endTime number, TimeStamp
   * @returns obj
   */
  calculateTime(startTime: number, endTime: number) {
    const startDate = this.stringToNewDate(
      this.timeStampToDateString(
        startTime,
        DateFormatEnum.SYSTEM_DATE_TIME_FORMAT,
      ),
    );
    const endDate = this.stringToNewDate(
      this.timeStampToDateString(
        endTime,
        DateFormatEnum.SYSTEM_DATE_TIME_FORMAT,
      ),
    );
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (60 * 60 * 24 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    const minutes =
      Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);
    const seconds =
      Math.floor(diff / 1000) -
      (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }

  /**
   * Reformat system hour number to human hour string reable
   * @param hour number, hour number
   * @returns string, hour format
   */
  hourNumberFormatToVisualTime(startTime: number, endTime: number) {
    try {
      const timeObj = this.calculateTime(startTime, endTime);
      const time = timeObj.minute > 9 ? timeObj.minute : '0' + timeObj.minute;
      return timeObj.hour + 'h' + time;
    } catch {
      return '--';
    }
  }

  /**
   * Get start/end time of by duration 'week'|'month'
   * @param isWeek boolean, default true
   * @param isEnd boolean, is time End, default start time
   * @returns number, time stamp
   */
  getStartEndTime(
    type: 'day' | 'week' | 'month' = 'week',
    isEnd: boolean = false,
  ) {
    const dateObj = moment();
    if (type === 'day') {
      if (isEnd) {
        return dateObj.endOf('day').valueOf();
      } else {
        return dateObj.startOf('day').valueOf();
      }
    } else if (type === 'week') {
      if (isEnd) {
        return dateObj.weekday(7).endOf('day').valueOf();
      } else {
        return dateObj.weekday(1).startOf('day').valueOf();
      }
    } else if (isEnd) {
      return dateObj.endOf('day').valueOf();
    } else {
      return dateObj.startOf('month').valueOf();
    }
  }

  formatDateinString(date: moment.MomentInput, dateFormat?: string): string {
    return moment(date).format(dateFormat || DateFormatEnum.DEFAULT_FORMAT);
  }

  formatTimeinString(timeInMillis?: number, dateFormat?: string): string {
    return moment(timeInMillis).format(
      dateFormat || DateFormatEnum.DEFAULT_FORMAT,
    );
  }

  convertStringToDate(dateStr?: string, dateFormat?: string): Date {
    const dateLocal = moment(dateStr).format(dateFormat).toLocaleString();
    return moment(
      dateLocal,
      dateFormat || DateFormatEnum.DEFAULT_FORMAT,
    ).toDate();
  }

  isWeekend(date: moment.MomentInput): boolean {
    const weekday = moment(date).weekday();
    return weekday === 6 || weekday === 0;
  }

  reformatDateString(
    value: string,
    oldFormat: string,
    newFormat?: string,
  ): string {
    return moment(value, oldFormat).format(
      newFormat || DateFormatEnum.DEFAULT_FORMAT,
    );
  }

  getDateAfterDaysInMillis(days: number): number {
    return moment().add(days, 'days').utc().valueOf();
  }

  getCurrentDateInMillis(): number {
    return moment().utc().valueOf();
  }

  checkIfDateExpired(date: Date): boolean {
    return moment().utc().isAfter(date.getTime());
  }

  checkIfTimeExpired(timeInMillis: number): boolean {
    return moment().utc().isAfter(timeInMillis);
  }

  calculateDayBetweenDates(from: Date, to: Date): number {
    return moment(to).diff(moment(from), 'days');
  }

  calculateMonthBetweenDates(from: Date, to: Date): number {
    return moment(to).diff(moment(from), 'months');
  }

  calculateYearBetweenDates(from: Date, to: Date): number {
    return moment(to).diff(moment(from), 'years');
  }

  isDateEquals(a: Date, b: Date): boolean {
    if (!a && !b) {
      return true;
    }
    if ((!a && b) || (a && !b)) {
      return false;
    }
    const dateA: Date = new Date(a);
    const dateB: Date = new Date(b);
    return dateA.getTime() === dateB.getTime();
  }

  formatDuration(duration: any, defaultOutput?: string) {
    if (duration && duration > 0) {
      let seconds: any = Math.floor((duration / 1000) % 60);
      let minutes: any = Math.floor((duration / (1000 * 60)) % 60);
      let hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      return hours + ':' + minutes + ':' + seconds;
    }
    return defaultOutput || '00:00:00';
  }

  formatDurationToHour(duration: any, defaultOutput?: string) {
    if (duration && duration > 0) {
      let minutes: any = Math.floor((duration / (1000 * 60)) % 60);
      let hours: any = Math.floor(duration / (1000 * 60 * 60));

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      return hours + 'h ' + minutes + 'm';
    }
    return defaultOutput || '0h 0m ';
  }

  getFilterDateOption(type: string) {
    const optionRet = {
      ShowOtherSelectDate: false,
      SelectFilterDateLabel: 'Today',
      SearchDateType: 0,
    };

    switch (type) {
      case 'today':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Today';
        optionRet.SearchDateType = SearchDateType.TODAY;
        break;
      case 'yesterday':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Yesterday';
        optionRet.SearchDateType = SearchDateType.YESTERDAY;
        break;
      case '7day':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Last 7 Days';
        optionRet.SearchDateType = SearchDateType.LAST_7_DAYS;
        break;
      case '30day':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Last 30 Days';
        optionRet.SearchDateType = SearchDateType.LAST_30_DAYS;
        break;
      case '1Month':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Last 1 Month';
        optionRet.SearchDateType = SearchDateType.LAST_1_MONTH;
        break;
      case '2Month':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Last 2 Months';
        optionRet.SearchDateType = SearchDateType.LAST_2_MONTHS;
        break;
      case '3Month':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Last 3 Months';
        optionRet.SearchDateType = SearchDateType.LAST_3_MONTHS;
        break;
      case '6Month':
        optionRet.ShowOtherSelectDate = false;
        optionRet.SelectFilterDateLabel = 'Last 6 Months';
        optionRet.SearchDateType = SearchDateType.LAST_6_MONTHS;
        break;
      case 'other':
        optionRet.ShowOtherSelectDate = true;
        optionRet.SelectFilterDateLabel = 'Other';
        optionRet.SearchDateType = SearchDateType.OTHERS;
        break;
    }
    return optionRet;
  }

  getLabelFilterDate(type: SearchDateType) {
    let label: string;
    switch (type) {
      case SearchDateType.YESTERDAY:
        label = 'Yesterday';
        break;
      case SearchDateType.LAST_7_DAYS:
        label = 'Last 7 Days';
        break;
      case SearchDateType.LAST_30_DAYS:
        label = 'Last 30 Days';
        break;
      case SearchDateType.LAST_1_MONTH:
        label = 'Last 1 Month';
        break;
      case SearchDateType.LAST_2_MONTHS:
        label = 'Last 2 Months';
        break;
      case SearchDateType.LAST_3_MONTHS:
        label = 'Last 3 Month';
        break;
      case SearchDateType.LAST_6_MONTHS:
        label = 'Last 6 Months';
        break;
      case SearchDateType.OTHERS:
        label = 'Other';
        break;
      default:
        label = 'Today';
        break;
    }
    return label;
  }

  /**
   * Format datetime
   * @input timespam : 5544
   * @input format : hh:mm:ss.sss
   * @output dateFormat : 01.02.03.123
   */
  formatTimeString(timestamp: string = '') {
    if (timestamp !== null && timestamp !== '') {
      const cTimestamp = +timestamp / 1000;
      const hours = Math.floor(cTimestamp / 60 / 60);
      const minutes = Math.floor(cTimestamp / 60) - hours * 60;
      const seconds = cTimestamp % 60;
      const formatted =
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0').substring(0, 5);
      return formatted;
    }
    return 'n/a';
  }

  formatTimeStringToMinutes(timestamp: number) {
    if (timestamp !== null && timestamp > 0) {
      const minutes = Math.floor(timestamp / (1000 * 60));
      return minutes;
    }
    return 'n/a';
  }

  formatMilisecondsToHours(timestamp: number, rounded?: boolean) {
    if (timestamp !== null && timestamp > 0) {
      const hours = timestamp / (1000 * 60) / 60;
      return hours;
    }
    return 0;
  }

  formatMinuteToHours(timestamp: number, rounded?: boolean) {
    if (timestamp !== null && timestamp > 0) {
      const hours = timestamp / 60;
      return hours;
    }
    return 0;
  }

  convertSearchDate(datetime: Date) {
    return new Date(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate(),
    ).toLocaleDateString('en-US');
  }

  getHourAfterInMillis(hours: number): number {
    return moment().add(hours, 'hours').utc().valueOf();
  }

  getDateBeforeMinutes(date: moment.MomentInput, minutes: number) {
    return moment(date).subtract(minutes, 'minutes').toDate();
  }

  validateDateParams(searchStartDate: Date, searchEndDate: Date) {
    let check = true;

    const totalDay = this.calculateDayBetweenDates(
      searchStartDate,
      searchEndDate,
    );
    if (totalDay < 0 || totalDay > 30) {
      check = false;
    }

    return check;
  }

  validateSearchParams(searchParams: any) {
    let check = true;
    switch (searchParams.searchDateType) {
      // 2 month
      case 5:
        // 3 month
        break;
      case 6:
        // 6 month
        break;
      case 7:
        check = false;
        break;
      // Dash Board
      case 99: {
        const totalDay = this.calculateDayBetweenDates(
          new Date(searchParams.searchStartDate),
          new Date(searchParams.searchEndDate),
        );
        if (totalDay < 0 || totalDay > 30) {
          check = false;
        }
        break;
      }
    }
    return check;
  }

  getTodayTimeInUTC() {
    return moment().utc();
  }

  getDateRangeByType(event: TimeSelectInfo) {
    const todayTime = new Date().getTime();
    const yesterday = todayTime - 24 * 60 * 60 * 1000;
    switch (event.type) {
      case SearchDateType.TODAY:
        return { start: todayTime, end: null };
      case SearchDateType.YESTERDAY:
        return { start: yesterday, end: null };
      case SearchDateType.LAST_7_DAYS:
        return { start: todayTime - 7 * 24 * 60 * 60 * 1000, end: yesterday };
      case SearchDateType.LAST_30_DAYS:
        return { start: todayTime - 30 * 24 * 60 * 60 * 1000, end: yesterday };
      case SearchDateType.OTHERS:
        return { start: event.start, end: event.end };
    }
    return null;
  }

  range(start: number, end?: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  getDisabledStartTime = (startTime: Date, endTime: Date) => {
    const { days } = intervalToDuration({ start: startTime, end: endTime });
    if (days >= 1) {
      return {
        nzDisabledHours: () => this.range(0, 23),
        nzDisabledMinutes: () => this.range(0, 59),
        nzDisabledSeconds: () => [0, 59],
      };
    }

    return {
      nzDisabledHours: () => this.getRangeOfHours(endTime),
      nzDisabledMinutes: () => this.getRangeOfMinutes(endTime),
      nzDisabledSeconds: () => [0, new Date().getMilliseconds()],
    };
  };

  getDisabledEndTime = (startTime: Date) => {
    return {
      nzDisabledHours: () => this.range(0, startTime.getHours()),
      nzDisabledMinutes: () => this.range(0, startTime.getMinutes()),
      nzDisabledSeconds: () => [0, 59],
    };
  };

  private getRangeOfHours = (endDate: Date) => {
    if (endDate != null) {
      return this.range(0, new Date().getHours()).concat(
        this.range(new Date().getHours()),
        endDate.getHours(),
      );
    }

    return this.range(0, new Date().getHours());
  };

  private getRangeOfMinutes = (endDate: Date) => {
    if (endDate != null) {
      return this.range(0, new Date().getMinutes() + 1).concat(
        this.range(new Date().getMinutes()),
        endDate.getMinutes(),
      );
    }

    return this.range(0, new Date().getMinutes() + 1);
  };

  /**
   * End time > Start Time &&
   * Start time > now
   *
   * @param startTime
   * @param endTime
   * @returns boolean
   */
  isValidStartTime = (startTime: Date, endTime: Date) => {
    if (!endTime) {
      return startTime.getTime() > new Date().getTime();
    }

    return (
      startTime.getTime() > new Date().getTime() &&
      startTime.getTime() < endTime.getTime()
    );
  };

  /**
   * End time > Start Time &&
   * End time > now
   *
   * @param startTime
   * @param endTime
   * @returns boolean
   */
  isValidEndTime = (startTime: Date, endTime: Date) => {
    if (!startTime) {
      return endTime.getTime() > new Date().getTime();
    }
    return (
      endTime.getTime() > new Date().getTime() &&
      startTime.getTime() < endTime.getTime()
    );
  };

  toUTCTime(localTime: Date, dateFormat?: string) {
    return moment(localTime)
      .utc()
      .format(dateFormat || DateFormatEnum.DEFAULT_FORMAT);
  }

  toLocalString(utcTime: moment.MomentInput, dateFormat?: string) {
    const localDate = new Date(utcTime + 'Z');
    this.formatDateinString(localDate, dateFormat);
  }

  getStartDate = (date: Date) => {
    const momentDate = moment(date).local(true).startOf('day');
    return moment(momentDate).utc().toISOString();
  }

  getEndDate = (date: Date) => {
    const momentDate = moment(date).local(true).endOf('day');
    return moment(momentDate).utc().toISOString();
  }
}
