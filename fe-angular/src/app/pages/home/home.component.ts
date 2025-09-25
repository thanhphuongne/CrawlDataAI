import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { rankMock } from '@app/shared/components/app-score-table/mock/rank.mock';
import { RankModel } from '@app/shared/components/app-score-table/model/rank.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  listRecord = signal<Array<RankModel>>([]);
  isLoading = signal(false);

  totalRecord = 0;
  limit = 10;
  offset = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private readonly router: Router,
  ) {
    this.listRecord.set(rankMock);
    this.totalRecord = this.listRecord().length;
  }

  ngAfterViewInit(): void {
    const video = document.getElementById('myVideo');
    video.onloadedmetadata = (event: any) => {
      console.log('event: ', event);
    };
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
}
