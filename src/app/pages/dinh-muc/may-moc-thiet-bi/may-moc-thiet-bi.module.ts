import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DinhMucTrangBiCongCuModule } from '../dinh-muc-trang-bi-cong-cu/dinh-muc-trang-bi-cong-cu.module';
import { HopDongMuaSamModule } from '../dinh-muc-trang-bi-cong-cu/hop-dong-mua-sam/hop-dong-mua-sam.module';
import { ComponentsModule } from './../../../components/components.module';
import { DeXuatNhuCauChiCucComponent } from './de-xuat-nhu-cau-chi-cuc/de-xuat-nhu-cau-chi-cuc.component';
import { ThongTinDeXuatNhuCauChiCucComponent } from './de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component';
import { MayMocThietBiRoutingModule } from './may-moc-thiet-bi-routing.module';
import { MayMocThietBiComponent } from './may-moc-thiet-bi.component';
import { MmBienBanGiaoNhanComponent } from './mm-bien-ban-giao-nhan/mm-bien-ban-giao-nhan.component';
import { MmHienTrangCcdcComponent } from './mm-hien-trang-ccdc/mm-hien-trang-ccdc.component';
import { MmDinhMucTrangBiComponent } from './mm-dinh-muc-trang-bi/mm-dinh-muc-trang-bi.component';
import {
    MmThemMoiDmTrangBiComponent
} from "./mm-dinh-muc-trang-bi/mm-them-moi-dm-trang-bi/mm-them-moi-dm-trang-bi.component";
import { MmHopDongComponent } from './mm-hop-dong/mm-hop-dong.component';
import { MmTtPhanBoComponent } from './mm-tt-phan-bo/mm-tt-phan-bo.component';

@NgModule({
    declarations: [
        MayMocThietBiComponent,
        DeXuatNhuCauChiCucComponent,
        ThongTinDeXuatNhuCauChiCucComponent,
        MmBienBanGiaoNhanComponent,
        MmHienTrangCcdcComponent,
        MmDinhMucTrangBiComponent,
        MmThemMoiDmTrangBiComponent,
        MmHopDongComponent,
        MmTtPhanBoComponent
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
