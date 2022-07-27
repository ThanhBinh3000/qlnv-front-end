import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BangKeCanBangComponent } from './bang-ke-can-bang/bang-ke-can-bang.component';
import { ThongTinBangKeCanBangComponent } from './bang-ke-can-bang/thong-tin-bang-ke-can-bang/thong-tin-bang-ke-can-bang.component';
import { BangKeXuatVatTuComponent } from './bang-ke-xuat-vat-tu/bang-ke-xuat-vat-tu.component';
import { BienBanHaoDoiComponent } from './bien-ban-hao-doi/bien-ban-hao-doi.component';
import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { ThemMoiBienBanTinhKhoComponent } from './bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';
import { ChucNangXuatKhoComponent } from './chuc-nang-xuat-kho/chuc-nang-xuat-kho.component';
import { QuanLyPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho/quan-ly-phieu-xuat-kho.component';
import { ThongTinBienBanHaoDoiComponent } from './bien-ban-hao-doi/thong-tin-bien-ban-hao-doi/thong-tin-bien-ban-hao-doi.component';
import { XuatKhoComponent } from './xuat-kho.component';
import { ThemMoiPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
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
    BienBanHaoDoiComponent,
    BangKeXuatVatTuComponent,
    ThongTinBienBanHaoDoiComponent
  ],
  imports: [
    CommonModule,
     ComponentsModule,
      DirectivesModule ],
  exports: [
    XuatKhoComponent,
    BangKeCanBangComponent,
    QuanLyPhieuXuatKhoComponent,
    BienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    BangKeXuatVatTuComponent

  ]
})
export class XuatKhoModule { }
