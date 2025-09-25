import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemPipe } from './pipes/item.pipe';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { OffClickDirective } from './directives/off-click.directive';
import { TreeSelectDefaultOptions } from './models/tree-select-default-options';
import { InputTreeDropdownComponent } from './input-tree-dropdown.component';
import { InputTreeDropdownItemComponent } from './components/input-tree-dropdown-item/input-tree-dropdown-item.component';
import { ClearInputDirectiveModule } from '@app/shared/directives/clear-input/clear-input.directive.module';

@NgModule({
  imports: [CommonModule, FormsModule, ClearInputDirectiveModule],
  declarations: [
    InputTreeDropdownComponent,
    InputTreeDropdownItemComponent,
    OffClickDirective,
    ItemPipe
  ],
  exports: [InputTreeDropdownComponent]
})
export class InputTreeDropdownModule {
  public static forRoot(
    options: TreeSelectDefaultOptions
  ): ModuleWithProviders<InputTreeDropdownModule> {
    return {
      ngModule: InputTreeDropdownModule,
      providers: [{ provide: TreeSelectDefaultOptions, useValue: options }]
    };
  }
}
