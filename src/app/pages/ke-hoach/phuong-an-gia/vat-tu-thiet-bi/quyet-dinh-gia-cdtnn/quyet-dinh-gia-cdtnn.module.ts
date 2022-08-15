import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhGiaCdtnnComponent } from './quyet-dinh-gia-cdtnn.component';


@NgModule({
  declarations: [QuyetDinhGiaCdtnnComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhGiaCdtnnComponent],
})
export class QuyetDinhGiaCdtnnModule { }
