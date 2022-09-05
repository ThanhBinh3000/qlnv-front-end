import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from './../../../components/components.module';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { ThongTinBienBanGiaoNhanComponent } from './bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';
import { DanhSachDinhMucTrangBiCongCuComponent } from './danh-sach-dinh-muc-trang-bi-cong-cu/danh-sach-dinh-muc-trang-bi-cong-cu.component';
import { ThongTinDinhMucTrangBiCongCuComponent } from './danh-sach-dinh-muc-trang-bi-cong-cu/thong-tin-dinh-muc-trang-bi-cong-cu/thong-tin-dinh-muc-trang-bi-cong-cu.component';
import { DeXuatNhuCauCuaCacCucComponent } from './de-xuat-nhu-cau-cua-cac-cuc/de-xuat-nhu-cau-cua-cac-cuc.component';
import { ThongTinDeXuatNhuCauCuaCacCucComponent } from './de-xuat-nhu-cau-cua-cac-cuc/thong-tin-de-xuat-nhu-cau-cua-cac-cuc/thong-tin-de-xuat-nhu-cau-cua-cac-cuc.component';
import { DinhMucTrangBiCongCuRoutingModule } from './dinh-muc-trang-bi-cong-cu-routing.module';
import { DinhMucTrangBiCongCuComponent } from './dinh-muc-trang-bi-cong-cu.component';
import { DinhMucTrangBiComponent } from './dinh-muc-trang-bi/dinh-muc-trang-bi.component';
import { ThongTinDinhMucTrangBiComponent } from './dinh-muc-trang-bi/thong-tin-dinh-muc-trang-bi/thong-tin-dinh-muc-trang-bi.component';
import { HienTrangMayMocThietBiComponent } from './hien-trang-may-moc-thiet-bi/hien-trang-may-moc-thiet-bi.component';
import { HopDongMuaSamModule } from './hop-dong-mua-sam/hop-dong-mua-sam.module';
import { QuyetDinhMuaSamComponent } from './quyet-dinh-mua-sam/quyet-dinh-mua-sam.component';
import { ThongTinQuyetDinhMuaSamComponent } from './quyet-dinh-mua-sam/thong-tin-quyet-dinh-mua-sam/thong-tin-quyet-dinh-mua-sam.component';
import { ThongTinTongHopDeXuatNhuCauCuaCacCucComponent } from './tong-hop-de-xuat-nhu-cau-cua-cac-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-cua-cac-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-cua-cac-cuc.component';
import { TongHopDeXuatNhuCauCuaCacCucComponent } from './tong-hop-de-xuat-nhu-cau-cua-cac-cuc/tong-hop-de-xuat-nhu-cau-cua-cac-cuc.component';

@NgModule({
  declarations: [
    DinhMucTrangBiCongCuComponent,
    DinhMucTrangBiComponent,
    ThongTinDinhMucTrangBiComponent,
    TongHopDeXuatNhuCauCuaCacCucComponent,
    ThongTinTongHopDeXuatNhuCauCuaCacCucComponent,
    QuyetDinhMuaSamComponent,
    ThongTinQuyetDinhMuaSamComponent,
    DeXuatNhuCauCuaCacCucComponent,
    ThongTinDeXuatNhuCauCuaCacCucComponent,
    DanhSachDinhMucTrangBiCongCuComponent,
    ThongTinDinhMucTrangBiCongCuComponent,
    HienTrangMayMocThietBiComponent,
    BienBanGiaoNhanComponent,
    ThongTinBienBanGiaoNhanComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DinhMucTrangBiCongCuRoutingModule,
    HopDongMuaSamModule,
  ],
  exports: [
    DinhMucTrangBiCongCuComponent,
    DinhMucTrangBiComponent,
    TongHopDeXuatNhuCauCuaCacCucComponent,
    QuyetDinhMuaSamComponent,
    DeXuatNhuCauCuaCacCucComponent,
    DanhSachDinhMucTrangBiCongCuComponent,
    HienTrangMayMocThietBiComponent,
    BienBanGiaoNhanComponent,
  ]
})
export class DinhMucTrangBiCongCuModule { }
