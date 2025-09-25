import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppDateRangePickerComponent } from '@app/shared/components/date-range-picker/date-range-picker.component';
import { AppDateTimePickerComponent } from '@app/shared/components/date-time-picker/date-time-picker.component';
import { AppFormLabelComponent } from '@app/shared/components/form-label/form-label.component';
import { AppSkeletonComponent } from '@app/shared/components/skeleton/skeleton.component';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppCardDirectiveModule } from '@app/shared/directives/app-card/app-card.directive.module';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { AppSwitchDirectiveModule } from '@app/shared/directives/app-switch/app-switch.directive.module';
import { AppTagDirectiveModule } from '@app/shared/directives/app-tag/app-tag.directive.module';
import { AppTextEllipsisDirectiveModule } from '@app/shared/directives/app-text-ellipsis/app-text-ellipsis.directive.module';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import BorderAndShadowStyleGuideComponent from './border-shadow/border-shadow.component';
import ButtonsStyleGuideComponent from './buttons/buttons.component';
import ColorsComponent from './colors/colors.component';
import CombineApiStyleGuideComponent from './compine-api/compine-api.component';
import FormStyleGuideComponent from './form/form.component';
import GeneralStyleGuideComponent from './general/general.component';
import IconsComponent from './icons/icons.component';
import NotiStyleGuideComponent from './notify/notify.component';
import OthersStyleGuideComponent from './others/others.component';
import SkeletonsStyleGuideComponent from './skeletons/skeletons.component';
import SpacesComponent from './spaces/spaces.component';
import { StyleGuideRoutingModule } from './style-guide-routing.module';
import { StyleGuideComponent } from './style-guide.component';
import TagsStyleGuideComponent from './tags/tags.component';
import TypoComponent from './typo/typo.component';
import ArrayFormStyleGuideComponent from './form-array/form-array.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppValidatorMessageComponent } from '@app/shared/components/validator-message/validator-message.component';
import { AppIconComponent } from '@app/shared/components/icon/icon.component';
import PaginationStyleGuideComponent from './pagination/pagination.component';
import { AppPaginationComponent } from '@app/shared/components/app-pagination/app-pagination.component';

@NgModule({
  declarations: [
    StyleGuideComponent,
    TypoComponent,
    ColorsComponent,
    SpacesComponent,
    ButtonsStyleGuideComponent,
    NotiStyleGuideComponent,
    TagsStyleGuideComponent,
    GeneralStyleGuideComponent,
    BorderAndShadowStyleGuideComponent,
    FormStyleGuideComponent,
    SkeletonsStyleGuideComponent,
    OthersStyleGuideComponent,
    CombineApiStyleGuideComponent,
    PaginationStyleGuideComponent,
    IconsComponent,
    ArrayFormStyleGuideComponent
  ],
  imports: [
    CommonModule,
    StyleGuideRoutingModule,
    AppButtonDirectiveModule,
    AppTagDirectiveModule,
    AppInputExtendFeaturesDirectiveModule,
    AppSkeletonComponent,
    AppSwitchDirectiveModule,
    AppFormLabelComponent,
    AppCardDirectiveModule,
    AppTextEllipsisDirectiveModule,
    AppIconDirectiveModule,
    AppDateTimePickerComponent,
    AppDateRangePickerComponent,
    NgbTooltipModule,
    AppPaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbAccordionModule,
    AppValidatorMessageComponent,
    AppIconDirectiveModule,
    AppIconComponent
  ],
  exports: [StyleGuideComponent, TypoComponent]
})
export class StyleGuideModule {}
