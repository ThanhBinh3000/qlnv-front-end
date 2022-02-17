import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { DanhSachDanhMucPhuongThucDauThau, ThemSuaDanhMucPhuongThucDauThau } from './components';
import { DanhMucPhuongThucDauThauContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DanhMucPhuongThucDauThauContainer, DanhSachDanhMucPhuongThucDauThau, ThemSuaDanhMucPhuongThucDauThau],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [DanhMucPhuongThucDauThauContainer, DanhSachDanhMucPhuongThucDauThau, ThemSuaDanhMucPhuongThucDauThau],
})
export class DanhMucPhuongThucDauThauLazyModule {}
