import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoQuyetToanComponent } from './bao-cao-quyet-toan.component';
import { ThemBaoCaoQuyetToanComponent } from './them-bao-cao-quyet-toan/them-bao-cao-quyet-toan.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogThemBaoCaoQuyetToanComponent } from './dialog-them-bao-cao-quyet-toan/dialog-them-bao-cao-quyet-toan.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [BaoCaoQuyetToanComponent, ThemBaoCaoQuyetToanComponent, DialogThemBaoCaoQuyetToanComponent],
  exports: [BaoCaoQuyetToanComponent],
})
export class BaoCaoQuyetToanModule { }
