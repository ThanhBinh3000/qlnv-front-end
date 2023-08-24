import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddDieuChinhQuyetToanComponent } from './add-dieu-chinh-quyet-toan/add-dieu-chinh-quyet-toan.component';
import { DialogAddVatTuComponent } from './dialog-add-vat-tu/dialog-add-vat-tu.component';
import { DialogThemDieuChinhComponent } from './dialog-them-dieu-chinh/dialog-them-dieu-chinh.component';
import { DieuChinhBaoCaoSauQuyetToanComponent } from './dieu-chinh-bao-cao-sau-quyet-toan.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule
    ],
    declarations: [
        DieuChinhBaoCaoSauQuyetToanComponent,
        DialogThemDieuChinhComponent,
        DialogAddVatTuComponent,
        AddDieuChinhQuyetToanComponent],
    exports: [DieuChinhBaoCaoSauQuyetToanComponent],
})
export class DieuChinhBaoCaoSauQuyetToanModule { }
