import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BangKeXuatVatTuComponent } from './bang-ke-xuat-vat-tu/bang-ke-xuat-vat-tu.component';
import { BienBanHaoDoiComponent } from './bien-ban-hao-doi/bien-ban-hao-doi.component';
import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { ThemMoiBienBanTinhKhoComponent } from './bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';
import { ChucNangXuatKhoComponent } from './chuc-nang-xuat-kho/chuc-nang-xuat-kho.component';
import { QuanLyPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho/quan-ly-phieu-xuat-kho.component';
import { ThongTinBienBanHaoDoiComponent } from './bien-ban-hao-doi/thong-tin-bien-ban-hao-doi/thong-tin-bien-ban-hao-doi.component';
import { XuatKhoComponent } from './xuat-kho.component';
import { ThemMoiPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
import { ThongTinBangKeVatTuComponent } from './bang-ke-xuat-vat-tu/thong-tin-bang-ke-vat-tu/thong-tin-bang-ke-vat-tu.component';
import { BanKeCanHangComponent } from './ban-ke-can-hang/ban-ke-can-hang.component';
import { ThongTinBangKeCanHangComponent } from './ban-ke-can-hang/thong-tin-bang-ke-can-hang/thong-tin-bang-ke-can-hang.component';
@NgModule({
  declarations: [
    XuatKhoComponent,
    ChucNangXuatKhoComponent,
    QuanLyPhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    BangKeXuatVatTuComponent,
    ThongTinBienBanHaoDoiComponent,
    ThongTinBangKeVatTuComponent,
    BanKeCanHangComponent,
    ThongTinBangKeCanHangComponent,
  ],
  imports: [
    CommonModule,
     ComponentsModule,
      DirectivesModule ],
  exports: [
    XuatKhoComponent,
    QuanLyPhieuXuatKhoComponent,
    BienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    BangKeXuatVatTuComponent,
    BanKeCanHangComponent

  ]
})
export class XuatKhoModule { }
