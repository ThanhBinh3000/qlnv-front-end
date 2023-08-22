import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DieuChinhBaoCaoSauQuyetToanComponent } from './dieu-chinh-bao-cao-sau-quyet-toan.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogThemDieuChinhComponent } from './dialog-them-dieu-chinh/dialog-them-dieu-chinh.component';
import { ThemBaoCaoDieuChinhSauQuyetToanComponent } from './them-bao-cao-dieu-chinh-sau-quyet-toan/them-bao-cao-dieu-chinh-sau-quyet-toan.component';
import { DialogAddVatTuComponent } from './dialog-add-vat-tu/dialog-add-vat-tu.component';
import { AddDieuChinhQuyetToanComponent } from './add-dieu-chinh-quyet-toan/add-dieu-chinh-quyet-toan.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule
    ],
    declarations: [
        DieuChinhBaoCaoSauQuyetToanComponent,
        DialogThemDieuChinhComponent,
        ThemBaoCaoDieuChinhSauQuyetToanComponent,
        DialogAddVatTuComponent,
        AddDieuChinhQuyetToanComponent],
    exports: [DieuChinhBaoCaoSauQuyetToanComponent],
})
export class DieuChinhBaoCaoSauQuyetToanModule { }
