import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '@app/layout/services/shared.service';
import { logMock } from '@app/shared/components/app-log-table/mock/log.mock';
import { LogModel } from '@app/shared/components/app-log-table/model/log.model';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrls: ['./scoring.component.scss'],
})
export class ScoringComponent implements OnInit, AfterViewInit {
  listRecord = signal<Array<LogModel>>([]);
  isLoading = signal(false);

  totalRecord = 0;
  limit = 10;
  offset = 1;

  logForm: FormGroup = null;
  isVisible = true;

  categoryOptions = [];
  approverOptions = [];
  supervisorOptions: string[] = [];

  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private fb: FormBuilder,
  ) {
    this.listRecord.set(logMock);
    this.totalRecord = this.listRecord().length;

    // Initialize the form
    this.logForm = this.fb.group({
      category: ['', Validators.required],
      approver: ['', Validators.required],
      supervisor: ['', Validators.required],
      desc: ['', Validators.required],
      receivedMail: [false],
    });
  }

  ngAfterViewInit(): void {
    this.logForm.controls['supervisor'].valueChanges.subscribe(() => {
      this.getSupervisor();
    });
  }

  ngOnInit() {}

  pageSizeChange = (page: number) => {
    this.offset = page;
    this.cdr.detectChanges();
    // this.refreshPage();
  };

  pageTotalSizeChange = (size: number) => {
    this.limit = size;
    this.cdr.detectChanges();
    // this.refreshPage();
  };

  goHome = () => {
    this.location.back();
    this.sharedService.setIsHome(true);
  };

  // Helper method to check field errors
  isFieldInvalid(field: string): boolean {
    const control = this.logForm.get(field);
    return control?.invalid && (control.dirty || control.touched);
  }

  getSupervisor = () => {
    const supervisorControl = this.logForm.controls['supervisor'];
    const value: string = supervisorControl.getRawValue();
    console.log('Call api - get supervisor: ', value);
    this.supervisorOptions = ['a', 'gb'];
    this.cdr.detectChanges();
  };

  handleCancel = () => {
    this.isVisible = false;
    this.logForm.reset();
  };

  logNew = () => {
    this.isVisible = true;
  };

  saveAction = () => {
    const values = this.logForm.getRawValue();
    console.log('form values: ', values);
  };
}
