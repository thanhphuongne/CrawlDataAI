import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { LanguageModel } from '@app/configs/models/language.models';
import { LANGUAGE_LIST } from '@app/configs/topbar.constant';
import { CredentialsService } from '@app/core';
import { UserModel } from '@app/core/models/user.model';
import { LanguageService } from '@app/core/services/language.services';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopBarComponent implements AfterViewInit {
  @Output() openMenu = new EventEmitter<any>();
  @Input() badgeNumber: number;

  userProfile: UserModel;
  language: string = 'vi';
  langData = LANGUAGE_LIST;
  selectedValue: LanguageModel = null;
  langImageUrl: string = '';
  listTitle: string[] = ['Logout'];
  isShowLogBtn: boolean = true;

  constructor(
    private readonly router: Router,
    private readonly credentialService: CredentialsService,
    private readonly languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
  ) {
    this.userProfile = this.credentialService.getUserInfoFromToken();
    this.sharedService.isShowNavigation.subscribe((value: boolean) => {
      this.isShowLogBtn = value;
    });
  }

  ngAfterViewInit(): void {
    this.selectedValue = this.langData[0];
    this.langImageUrl = this.selectedValue.icon;
    this.language = this.languageService.defaultLanguage;
    this.cdr.detectChanges();
  }

  /**
   * Emit event for change layout of site
   */
  toogleLayout() {
    this.openMenu.emit();
  }

  /**
   * Toggle language
   */
  toggleLanguage() {
    this.langImageUrl = this.selectedValue.icon;
  }

  logScoring = () => {
    this.router.navigate(['/scoring']);
    this.sharedService.setIsHome(false);
  };
}
