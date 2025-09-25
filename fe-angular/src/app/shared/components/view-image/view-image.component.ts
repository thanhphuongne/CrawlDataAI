import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
  standalone: true,
  imports: [
		NgbModalModule,
    CommonModule,
    AppIconDirectiveModule,
    FormsModule,
  ]
})

export class ViewImageComponent implements OnInit {
	@Input() urlImage : string;
  @Input() listEvidence : Array<{url : string, label?: string}> = [];
  @Input() indexImg = 0;

  icons = SvgIcon;

	ngOnInit(): void {
    if(!this.urlImage){
      this.urlImage = this.listEvidence[this.indexImg].url
    }
	}

  /**
   * View image previous
   * @returns if btn === 0
   */
	clickPrevious(){
    if(this.indexImg === 0) return;
    --this.indexImg;
    this.urlImage = this.listEvidence[this.indexImg].url;
	}

  /**
   * View image next
   * @returns if index image = evidence lenght
   */
	clickNext(){
    if(this.indexImg === this.listEvidence.length - 1) return;
    ++this.indexImg;
    this.urlImage = this.listEvidence[this.indexImg].url;
	}
}