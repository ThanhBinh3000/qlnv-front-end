import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DinhMucTrangBiCongCuModule } from '../dinh-muc-trang-bi-cong-cu/dinh-muc-trang-bi-cong-cu.module';
import { HopDongMuaSamModule } from '../dinh-muc-trang-bi-cong-cu/hop-dong-mua-sam/hop-dong-mua-sam.module';
import { MayMocThietBiModule } from '../may-moc-thiet-bi/may-moc-thiet-bi.module';
import { ComponentsModule } from './../../../components/components.module';
import { DeXuatNhuCauComponent } from './de-xuat-nhu-cau/de-xuat-nhu-cau.component';
import { ThongTinDeXuatNhuCauComponent } from './de-xuat-nhu-cau/thong-tin-de-xuat-nhu-cau/thong-tin-de-xuat-nhu-cau.component';
import { MangPvcCongCuDungCuRoutingModule } from './mang-pvc-cong-cu-dung-cu-routing.module';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';
import { ThongTinTongHopDeXuatNhuCauChiCucComponent } from './tong-hop-de-xuat-nhu-cau-chi-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-chi-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-chi-cuc.component';
import { TongHopDeXuatNhuCauChiCucComponent } from './tong-hop-de-xuat-nhu-cau-chi-cuc/tong-hop-de-xuat-nhu-cau-chi-cuc.component';
import { DeXuatNcChiCucPvcComponent } from './de-xuat-nc-chi-cuc-pvc/de-xuat-nc-chi-cuc-pvc.component';
import { DeXuatNcCucPvcComponent } from './de-xuat-nc-cuc-pvc/de-xuat-nc-cuc-pvc.component';
import { TongHopNcCucPvcComponent } from './tong-hop-nc-cuc-pvc/tong-hop-nc-cuc-pvc.component';
import { HopDongMuaSamPvcComponent } from './hop-dong-mua-sam-pvc/hop-dong-mua-sam-pvc.component';
import { BienBanGiaoNhanPvcComponent } from './bien-ban-giao-nhan-pvc/bien-ban-giao-nhan-pvc.component';
import { HienTrangCcdcPvcComponent } from './hien-trang-ccdc-pvc/hien-trang-ccdc-pvc.component';

@NgModule({
  declarations: [
    MangPvcCongCuDungCuComponent,
    DeXuatNhuCauComponent,
    ThongTinDeXuatNhuCauComponent,
    TongHopDeXuatNhuCauChiCucComponent,
    ThongTinTongHopDeXuatNhuCauChiCucComponent,
    DeXuatNcChiCucPvcComponent,
    DeXuatNcCucPvcComponent,
    TongHopNcCucPvcComponent,
    HopDongMuaSamPvcComponent,
    BienBanGiaoNhanPvcComponent,
    HienTrangCcdcPvcComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MangPvcCongCuDungCuRoutingModule,
    MayMocThietBiModule,
    HopDongMuaSamModule,
    DinhMucTrangBiCongCuModule,
  ],
  exports: [
    MangPvcCongCuDungCuComponent,
    DeXuatNhuCauComponent,
    TongHopDeXuatNhuCauChiCucComponent,
  ]
})
export class MangPvcCongCuDungCuModule { }
