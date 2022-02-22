import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerDirective } from './datepicker.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { ScrollAffixDirective } from './scroll-affix.directive';

@NgModule({
  declarations: [
    DatepickerDirective,
    NumberOnlyDirective,
    ScrollAffixDirective,
  ],
  imports: [CommonModule],
  exports: [DatepickerDirective, NumberOnlyDirective, ScrollAffixDirective],
})
export class DirectivesModule {}
