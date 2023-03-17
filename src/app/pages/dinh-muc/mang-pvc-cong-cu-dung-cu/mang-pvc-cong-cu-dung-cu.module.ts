import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DinhMucTrangBiCongCuModule } from '../dinh-muc-trang-bi-cong-cu/dinh-muc-trang-bi-cong-cu.module';
import { HopDongMuaSamModule } from '../dinh-muc-trang-bi-cong-cu/hop-dong-mua-sam/hop-dong-mua-sam.module';
import { MayMocThietBiModule } from '../may-moc-thiet-bi/may-moc-thiet-bi.module';
import { ComponentsModule } from './../../../components/components.module';
import { MangPvcCongCuDungCuRoutingModule } from './mang-pvc-cong-cu-dung-cu-routing.module';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';
import { ThongTinTongHopDeXuatNhuCauChiCucComponent } from './tong-hop-de-xuat-nhu-cau-chi-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-chi-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-chi-cuc.component';
import { TongHopDeXuatNhuCauChiCucComponent } from './tong-hop-de-xuat-nhu-cau-chi-cuc/tong-hop-de-xuat-nhu-cau-chi-cuc.component';
import { DeXuatNcChiCucPvcComponent } from './de-xuat-nc-chi-cuc-pvc/de-xuat-nc-chi-cuc-pvc.component';
import { TongHopNcCucPvcComponent } from './tong-hop-nc-cuc-pvc/tong-hop-nc-cuc-pvc.component';
import { HopDongMuaSamPvcComponent } from './hop-dong-mua-sam-pvc/hop-dong-mua-sam-pvc.component';
import { BienBanGiaoNhanPvcComponent } from './bien-ban-giao-nhan-pvc/bien-ban-giao-nhan-pvc.component';
import { HienTrangCcdcPvcComponent } from './hien-trang-ccdc-pvc/hien-trang-ccdc-pvc.component';
import { ThemMoiBienBanPvcComponent } from './bien-ban-giao-nhan-pvc/them-moi-bien-ban-pvc/them-moi-bien-ban-pvc.component';
import { QdMuaSamPvcComponent } from './qd-mua-sam-pvc/qd-mua-sam-pvc.component';
import { TtPhanBoPvcComponent } from './tt-phan-bo-pvc/tt-phan-bo-pvc.component';
import { ThemMoiDxChiCucPvcComponent } from './de-xuat-nc-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc.component';
import { ThemMoiTongHopDxCucPvcComponent } from './tong-hop-nc-cuc-pvc/them-moi-tong-hop-dx-cuc-pvc/them-moi-tong-hop-dx-cuc-pvc.component';
import {ThemMoiQdMuaSamPvcComponent} from "./qd-mua-sam-pvc/them-moi-qd-mua-sam-pvc/them-moi-qd-mua-sam-pvc.component";
import { ThemMoiTtPhanBoPvcComponent } from './tt-phan-bo-pvc/them-moi-tt-phan-bo-pvc/them-moi-tt-phan-bo-pvc.component';
import { ThongTinPhanBoCtPvcComponent } from './tt-phan-bo-pvc/them-moi-tt-phan-bo-pvc/thong-tin-phan-bo-ct-pvc/thong-tin-phan-bo-ct-pvc.component';
import {ThemMoiHopDongPvcComponent} from "./hop-dong-mua-sam-pvc/them-moi-hop-dong-pvc/them-moi-hop-dong-pvc.component";
import {
  ThemMoiPhuLucPvcComponent
} from "./hop-dong-mua-sam-pvc/them-moi-hop-dong-pvc/them-moi-phu-luc-pvc/them-moi-phu-luc-pvc.component";
import {
  DialogPvcBbGiaoNhanComponent
} from "./bien-ban-giao-nhan-pvc/them-moi-bien-ban-pvc/dialog-pvc-bb-giao-nhan/dialog-pvc-bb-giao-nhan.component";
import { PvcThongTinHienTrangComponent } from './hien-trang-ccdc-pvc/pvc-thong-tin-hien-trang/pvc-thong-tin-hien-trang.component';

@NgModule({
  declarations: [
    MangPvcCongCuDungCuComponent,
    TongHopDeXuatNhuCauChiCucComponent,
    ThongTinTongHopDeXuatNhuCauChiCucComponent,
    DeXuatNcChiCucPvcComponent,
    TongHopNcCucPvcComponent,
    HopDongMuaSamPvcComponent,
    BienBanGiaoNhanPvcComponent,
    HienTrangCcdcPvcComponent,
    ThemMoiBienBanPvcComponent,
    QdMuaSamPvcComponent,
    TtPhanBoPvcComponent,
    ThemMoiDxChiCucPvcComponent,
    ThemMoiTongHopDxCucPvcComponent,
    ThemMoiQdMuaSamPvcComponent,
    ThemMoiTtPhanBoPvcComponent,
    ThongTinPhanBoCtPvcComponent,
    ThemMoiHopDongPvcComponent,
    ThemMoiPhuLucPvcComponent,
    DialogPvcBbGiaoNhanComponent,
    PvcThongTinHienTrangComponent
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
    TongHopDeXuatNhuCauChiCucComponent,
    ThemMoiBienBanPvcComponent,
  ]
})
export class MangPvcCongCuDungCuModule { }
