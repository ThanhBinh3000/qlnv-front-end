import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachGiaoNhapHangComponent } from './danh-sach-giao-nhap-hang/danh-sach-giao-nhap-hang.component';
import { GiaoNhapHangComponent } from './giao-nhap-hang.component';
import { ThemmoiQdinhNhapXuatHangComponent } from './themmoi-qdinh-nhap-xuat-hang/themmoi-qdinh-nhap-xuat-hang.component';

@NgModule({
    declarations: [
        GiaoNhapHangComponent,
        DanhSachGiaoNhapHangComponent,
        ThemmoiQdinhNhapXuatHangComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        GiaoNhapHangComponent,
        DanhSachGiaoNhapHangComponent,
    ]
})
export class GiaoNhapHangModule { }
