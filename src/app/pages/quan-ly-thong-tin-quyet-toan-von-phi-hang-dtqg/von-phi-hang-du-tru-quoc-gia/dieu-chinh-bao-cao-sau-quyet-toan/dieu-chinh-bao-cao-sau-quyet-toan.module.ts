import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DieuChinhBaoCaoSauQuyetToanComponent } from './dieu-chinh-bao-cao-sau-quyet-toan.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogThemDieuChinhComponent } from './dialog-them-dieu-chinh/dialog-them-dieu-chinh.component';
import { ThemBaoCaoDieuChinhSauQuyetToanComponent } from './them-bao-cao-dieu-chinh-sau-quyet-toan/them-bao-cao-dieu-chinh-sau-quyet-toan.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [DieuChinhBaoCaoSauQuyetToanComponent, DialogThemDieuChinhComponent, ThemBaoCaoDieuChinhSauQuyetToanComponent],
  exports: [DieuChinhBaoCaoSauQuyetToanComponent],
})
export class DieuChinhBaoCaoSauQuyetToanModule { }
