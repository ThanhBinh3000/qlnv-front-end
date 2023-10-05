import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddQuyetToanComponent } from './add-quyet-toan/add-quyet-toan.component';
import { BaoCaoQuyetToanComponent } from './bao-cao-quyet-toan.component';
import { DialogAddVatTuComponent } from './dialog-add-vat-tu/dialog-add-vat-tu.component';
import { DialogThemBaoCaoQuyetToanComponent } from './dialog-them-bao-cao-quyet-toan/dialog-them-bao-cao-quyet-toan.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule
    ],
    declarations: [
        BaoCaoQuyetToanComponent,
        DialogThemBaoCaoQuyetToanComponent,
        AddQuyetToanComponent,
        DialogAddVatTuComponent
    ],
    exports: [BaoCaoQuyetToanComponent],
})
export class BaoCaoQuyetToanModule { }
