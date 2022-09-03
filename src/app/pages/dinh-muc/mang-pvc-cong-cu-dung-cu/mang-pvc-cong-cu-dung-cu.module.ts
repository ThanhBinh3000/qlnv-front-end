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

@NgModule({
  declarations: [
    MangPvcCongCuDungCuComponent,
    DeXuatNhuCauComponent,
    ThongTinDeXuatNhuCauComponent,
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
  ]
})
export class MangPvcCongCuDungCuModule { }
