import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhGiaBtcComponent } from './quyet-dinh-gia-btc.component';


@NgModule({
  declarations: [QuyetDinhGiaBtcComponent,],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhGiaBtcComponent],
})
export class QuyetDinhGiaBtcModule { }
