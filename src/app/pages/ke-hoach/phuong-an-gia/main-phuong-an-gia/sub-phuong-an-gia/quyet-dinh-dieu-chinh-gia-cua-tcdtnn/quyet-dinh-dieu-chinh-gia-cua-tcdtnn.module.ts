import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhDieuChinhGiaCuaTcdtnnComponent } from './quyet-dinh-dieu-chinh-gia-cua-tcdtnn.component';
import { ThemMoiQdDcgComponent } from './them-moi-qd-dcg/them-moi-qd-dcg.component';

@NgModule({
  declarations: [QuyetDinhDieuChinhGiaCuaTcdtnnComponent, ThemMoiQdDcgComponent,],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhDieuChinhGiaCuaTcdtnnComponent],
})
export class QuyetDinhDieuChinhGiaCuaTcdtnnModule { }
