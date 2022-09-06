import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhGiaCuaTcdtnnComponent } from './quyet-dinh-gia-cua-tcdtnn.component';
import { ThemMoiQdGiaTcdtnnLtComponent } from './them-moi-qd-gia-tcdtnn-lt/them-moi-qd-gia-tcdtnn-lt.component';
import { ThemMoiQdGiaTcdtnnVtComponent } from './them-moi-qd-gia-tcdtnn-vt/them-moi-qd-gia-tcdtnn-vt.component';


@NgModule({
  declarations: [QuyetDinhGiaCuaTcdtnnComponent, ThemMoiQdGiaTcdtnnLtComponent,ThemMoiQdGiaTcdtnnVtComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhGiaCuaTcdtnnComponent],
})
export class QuyetDinhGiaCuaTcdtnnModule { }
