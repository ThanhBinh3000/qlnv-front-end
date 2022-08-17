import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhDieuChinhCdtnnComponent } from './quyet-dinh-dieu-chinh-cdtnn.component';


@NgModule({
  declarations: [QuyetDinhDieuChinhCdtnnComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhDieuChinhCdtnnComponent],
})
export class QuyetDinhDieuChinhCdtnnModule { }
