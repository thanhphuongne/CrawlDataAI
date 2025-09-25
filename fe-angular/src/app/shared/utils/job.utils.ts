import { Job, JobDetail } from '@app/open-api/models';
import { JobModel } from '../components/job-table/model/app-job-table.model';
import { DateFormatEnum, DateTimeUtils } from './date-times.utils';
import {
  AgentMethod,
  JobStatus,
} from '../components/job-table/enum/app-job-table.enum';

export class JobUtils {
  dateUtils = new DateTimeUtils();
  jobStatusType: typeof JobStatus = JobStatus;
  agentMethodEnum: typeof AgentMethod = AgentMethod;

  /**
   * Mapping from Job to JobModel
   *
   * @param data
   * @returns JobModel[]
   */
  mappingListJob = (data: JobDetail[]) => {
    const jobs: JobModel[] = [];
    for (const item of data) {
      jobs.push(this.mappingSingleJob(item));
    }

    return jobs;
  };

  mappingSingleJob = (item: JobDetail) => {
    return {
      jobId: item.id,
      jobName: item.name,
      agentMethod: this.getKeysFromMethodStatus(item?.agent?.agent_method),
      tournament: item.tournament,
      input: item.input,
      output: item.output,
      threshold: item.threshold,
      agentName: item?.agent?.machine_name,
      agentId: item?.agent?.id,
      outputQuality: item?.agent?.framerate?.toString(),
      outputResolution: item?.agent?.resolution,
      startTime: this.dateUtils.convertStringToDate(
        item.start_at,
        DateFormatEnum.SYSTEM_DATE_TIME_FORMAT,
      ),
      endTime: this.dateUtils.convertStringToDate(
        item.completed_at,
        DateFormatEnum.SYSTEM_DATE_TIME_FORMAT,
      ),
      jobStatus: this.jobStatusType[this.getKeysFromJobStatus(item.status)],
      agentStatus:
        this.jobStatusType[this.getKeysFromJobStatus(item.agent_status)],
      createdDate: this.dateUtils.convertStringToDate(
        item.created_at,
        DateFormatEnum.SYSTEM_DATE_TIME_FORMAT,
      ),
      createdBy: item.created_by,
      updatedDate: this.dateUtils.convertStringToDate(
        item.updated_at,
        DateFormatEnum.SYSTEM_DATE_TIME_FORMAT,
      ),
      updatedBy: item.updated_by,
    } as JobModel;
  };

  getKeysFromMethodStatus = (value: string) => {
    return value == this.agentMethodEnum.SDI
      ? AgentMethod.SDI
      : AgentMethod.UDP;
  };

  getKeysFromJobStatus = (value: string) => {
    const keys = Object.keys(JobStatus);
    for (const key of keys) {
      if (key == value) {
        return key;
      }
    }
  };

  getKeysFromJobStatusValue = (value: string) => {
    const keys = Object.keys(JobStatus);
    for (const key of keys) {
      if (JobStatus[key] == value) {
        return key;
      }
    }
  };
}
