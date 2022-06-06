import { ThemMoiPhieuNhapDayKhoComponent } from './quan-ly-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhapKhoComponent } from './nhap-kho.component';
import { ChucNangNhapKhoComponent } from './chuc-nang-nhap-kho/chuc-nang-nhap-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { QuanLyPhieuNhapDayKhoComponent } from './quan-ly-phieu-nhap-day-kho/quan-ly-phieu-nhap-day-kho.component';
import { QuanLyPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';
import { QuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/quan-ly-bang-ke-can-hang.component';
import { ThongTinQuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang.component';

@NgModule({
  declarations: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
    QuanLyPhieuNhapDayKhoComponent,
    ThemMoiPhieuNhapDayKhoComponent,
    QuanLyPhieuNhapKhoComponent,
    ThemMoiPhieuNhapKhoComponent,
    QuanLyBangKeCanHangComponent,
    ThongTinQuanLyBangKeCanHangComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
    QuanLyPhieuNhapDayKhoComponent,
    QuanLyPhieuNhapKhoComponent,
    QuanLyBangKeCanHangComponent,
  ]
})
export class NhapKhoModule { }
