import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import BorderAndShadowStyleGuideComponent from './border-shadow/border-shadow.component';
import ButtonsStyleGuideComponent from './buttons/buttons.component';
import ColorsComponent from './colors/colors.component';
import FormStyleGuideComponent from './form/form.component';
import GeneralStyleGuideComponent from './general/general.component';
import NotiStyleGuideComponent from './notify/notify.component';
import SkeletonsStyleGuideComponent from './skeletons/skeletons.component';
import SpacesComponent from './spaces/spaces.component';
import { StyleGuideComponent } from './style-guide.component';
import TagsStyleGuideComponent from './tags/tags.component';
import TypoComponent from './typo/typo.component';
import IconsComponent from './icons/icons.component';
import OthersStyleGuideComponent from './others/others.component';
import CombineApiStyleGuideComponent from './compine-api/compine-api.component';
import ArrayFormStyleGuideComponent from './form-array/form-array.component';
import PaginationStyleGuideComponent from './pagination/pagination.component';
const routes: Routes = [
  {
    path: '',
    component: StyleGuideComponent,

    children: [
      {
        path: 'general',
        component: GeneralStyleGuideComponent
      },
      {
        path: 'colors',
        component: ColorsComponent
      },
      {
        path: 'typo',
        component: TypoComponent
      },
      {
        path: 'spaces',
        component: SpacesComponent
      },
      {
        path: 'border-shadow',
        component: BorderAndShadowStyleGuideComponent
      },
      {
        path: 'buttons',
        component: ButtonsStyleGuideComponent
      },
      {
        path: 'pagination',
        component: PaginationStyleGuideComponent
      },
      {
        path: 'notify',
        component: NotiStyleGuideComponent
      },
      {
        path: 'icons',
        component: IconsComponent
      },
      {
        path: 'tags',
        component: TagsStyleGuideComponent
      },
      {
        path: 'form',
        component: FormStyleGuideComponent
      },
      {
        path: 'skeletons',
        component: SkeletonsStyleGuideComponent
      },
      {
        path: 'combine-apis',
        component: CombineApiStyleGuideComponent
      },
      {
        path: 'array-form',
        component: ArrayFormStyleGuideComponent
      },
      {
        path: 'others',
        component: OthersStyleGuideComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StyleGuideRoutingModule {}
