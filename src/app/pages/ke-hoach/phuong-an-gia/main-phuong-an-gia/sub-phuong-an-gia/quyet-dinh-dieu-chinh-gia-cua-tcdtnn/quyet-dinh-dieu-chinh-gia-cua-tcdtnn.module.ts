import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhDieuChinhGiaCuaTcdtnnComponent } from './quyet-dinh-dieu-chinh-gia-cua-tcdtnn.component';

@NgModule({
  declarations: [QuyetDinhDieuChinhGiaCuaTcdtnnComponent,],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhDieuChinhGiaCuaTcdtnnComponent],
})
export class QuyetDinhDieuChinhGiaCuaTcdtnnModule { }
