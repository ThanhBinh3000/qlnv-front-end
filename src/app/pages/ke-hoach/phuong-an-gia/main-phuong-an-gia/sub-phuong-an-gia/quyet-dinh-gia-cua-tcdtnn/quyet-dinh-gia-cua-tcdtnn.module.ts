import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhGiaCuaTcdtnnComponent } from './quyet-dinh-gia-cua-tcdtnn.component';
import { ThemMoiQdGiaTcdtnnComponent } from './them-moi-qd-gia-tcdtnn/them-moi-qd-gia-tcdtnn.component';


@NgModule({
  declarations: [QuyetDinhGiaCuaTcdtnnComponent, ThemMoiQdGiaTcdtnnComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhGiaCuaTcdtnnComponent],
})
export class QuyetDinhGiaCuaTcdtnnModule { }
