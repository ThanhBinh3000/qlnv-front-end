import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NhapKhoComponent } from './nhap-kho.component';
import { XuatKhoComponent } from './xuat-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ChucNangXuatKhoComponent } from './chuc-nang-xuat-kho/chuc-nang-xuat-kho.component';
import { BangKeCanBangComponent } from './bang-ke-can-bang/bang-ke-can-bang.component';
import { ThongTinBangKeCanBangComponent } from './bang-ke-can-bang/thong-tin-bang-ke-can-bang/thong-tin-bang-ke-can-bang.component';
import { ThemMoiPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
import { QuanLyPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho/quan-ly-phieu-xuat-kho.component';
import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { ThemMoiBienBanTinhKhoComponent } from './bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';

@NgModule({
  declarations: [
    XuatKhoComponent,
    ChucNangXuatKhoComponent,
    BangKeCanBangComponent,
    ThongTinBangKeCanBangComponent,
    QuanLyPhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
  ],
  imports: [CommonModule, ComponentsModule, DirectivesModule],
  exports: [
    XuatKhoComponent,
    ChucNangXuatKhoComponent,
    BangKeCanBangComponent,
    QuanLyPhieuXuatKhoComponent,
  ],
})
export class XuatKhoModule {}
