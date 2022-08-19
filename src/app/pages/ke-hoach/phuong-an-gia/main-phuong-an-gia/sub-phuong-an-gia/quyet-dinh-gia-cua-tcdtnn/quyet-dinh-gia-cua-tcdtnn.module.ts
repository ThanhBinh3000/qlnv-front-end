import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhGiaCuaTcdtnnComponent } from './quyet-dinh-gia-cua-tcdtnn.component';


@NgModule({
  declarations: [QuyetDinhGiaCuaTcdtnnComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhGiaCuaTcdtnnComponent],
})
export class QuyetDinhGiaCuaTcdtnnModule { }
