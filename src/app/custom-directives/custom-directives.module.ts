import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoveIconTitleDirective } from 'src/app/custom-directives/remove-icon-title.directive';
import { AddClassToHeaderDirective } from './add-class-to-header.directive';
import { CopyTextClipboardDirective } from './copy-text-clipboard.directive';
import { TooltipDirective } from './tooltip.directive'; 


@NgModule({
  declarations: [RemoveIconTitleDirective, AddClassToHeaderDirective, CopyTextClipboardDirective, TooltipDirective],
  imports: [
    CommonModule
  ],
  exports: [RemoveIconTitleDirective, AddClassToHeaderDirective, CopyTextClipboardDirective, TooltipDirective]
})
export class CustomDirectivesModule { }
