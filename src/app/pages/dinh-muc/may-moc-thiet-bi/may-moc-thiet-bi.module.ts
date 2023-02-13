import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DinhMucTrangBiCongCuModule } from '../dinh-muc-trang-bi-cong-cu/dinh-muc-trang-bi-cong-cu.module';
import { HopDongMuaSamModule } from '../dinh-muc-trang-bi-cong-cu/hop-dong-mua-sam/hop-dong-mua-sam.module';
import { ComponentsModule } from './../../../components/components.module';
import { DeXuatNhuCauChiCucComponent } from './de-xuat-nhu-cau-chi-cuc/de-xuat-nhu-cau-chi-cuc.component';
import { ThongTinDeXuatNhuCauChiCucComponent } from './de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component';
import { MayMocThietBiRoutingModule } from './may-moc-thiet-bi-routing.module';
import { MayMocThietBiComponent } from './may-moc-thiet-bi.component';
import { DinhMucTrangBiComponent } from './dinh-muc-trang-bi/dinh-muc-trang-bi.component';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { HienTrangMayMocComponent } from './hien-trang-may-moc/hien-trang-may-moc.component';

@NgModule({
  declarations: [
    MayMocThietBiComponent,
    DeXuatNhuCauChiCucComponent,
    ThongTinDeXuatNhuCauChiCucComponent,
    DinhMucTrangBiComponent,
    BienBanGiaoNhanComponent,
    HienTrangMayMocComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MayMocThietBiRoutingModule,
    DinhMucTrangBiCongCuModule,
    HopDongMuaSamModule,
  ],
  exports: [
    MayMocThietBiComponent,
    DeXuatNhuCauChiCucComponent,
  ]
})
export class MayMocThietBiModule { }
