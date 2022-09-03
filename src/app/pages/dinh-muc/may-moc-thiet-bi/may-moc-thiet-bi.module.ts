import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayMocThietBiComponent } from './may-moc-thiet-bi.component';
import { MayMocThietBiRoutingModule } from './may-moc-thiet-bi-routing.module';
import { DeXuatNhuCauChiCucComponent } from './de-xuat-nhu-cau-chi-cuc/de-xuat-nhu-cau-chi-cuc.component';
import { ThongTinDeXuatNhuCauChiCucComponent } from './de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component';
import { HienTrangMayMocThietBiComponent } from './hien-trang-may-moc-thiet-bi/hien-trang-may-moc-thiet-bi.component';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { ThongTinBienBanGiaoNhanComponent } from './bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';

@NgModule({
  declarations: [
    MayMocThietBiComponent,
    DeXuatNhuCauChiCucComponent,
    ThongTinDeXuatNhuCauChiCucComponent,
    BienBanGiaoNhanComponent,
    ThongTinBienBanGiaoNhanComponent,
    HienTrangMayMocThietBiComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MayMocThietBiRoutingModule,
  ],
  exports: [
    MayMocThietBiComponent,
    DeXuatNhuCauChiCucComponent,
    BienBanGiaoNhanComponent,
    HienTrangMayMocThietBiComponent,
  ]
})
export class MayMocThietBiModule { }
