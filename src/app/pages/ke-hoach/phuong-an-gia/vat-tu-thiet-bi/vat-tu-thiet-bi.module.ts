import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VatTuThietBiComponent } from './vat-tu-thiet-bi.component';

@NgModule({
  declarations: [VatTuThietBiComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,

  ],
  exports: [
    VatTuThietBiComponent,
  ]
})
export class VatTuThietBiModule { }
