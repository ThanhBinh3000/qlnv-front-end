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
import {MmDxCucComponent} from "./mm-dx-cuc/mm-dx-cuc.component";
import {ThemMoiMmDxCucComponent} from "./mm-dx-cuc/them-moi-mm-dx-cuc/them-moi-mm-dx-cuc.component";
import { MmTongHopDxCucComponent } from './mm-tong-hop-dx-cuc/mm-tong-hop-dx-cuc.component';
import { MmThemMoiTongHopDxCucComponent } from './mm-tong-hop-dx-cuc/mm-them-moi-tong-hop-dx-cuc/mm-them-moi-tong-hop-dx-cuc.component';
import { MmQdMuaSamComponent } from './mm-qd-mua-sam/mm-qd-mua-sam.component';
import { MmThemMoiQdMuaSamComponent } from './mm-qd-mua-sam/mm-them-moi-qd-mua-sam/mm-them-moi-qd-mua-sam.component';
import {MmThemMoiTtPhanBoComponent} from "./mm-tt-phan-bo/mm-them-moi-tt-phan-bo/mm-them-moi-tt-phan-bo.component";
import {MmThongTinHopDongComponent} from "./mm-hop-dong/mm-thong-tin-hop-dong/mm-thong-tin-hop-dong.component";
import { MmThongTinPhanBoCtComponent } from './mm-tt-phan-bo/mm-them-moi-tt-phan-bo/mm-thong-tin-phan-bo-ct/mm-thong-tin-phan-bo-ct.component';
import {
    MmThemMoiPhuLucComponent
} from "./mm-hop-dong/mm-thong-tin-hop-dong/mm-them-moi-phu-luc/mm-them-moi-phu-luc.component";
import {
    MmThemMoiBbGiaoNhanComponent
} from "./mm-bien-ban-giao-nhan/mm-them-moi-bb-giao-nhan/mm-them-moi-bb-giao-nhan.component";
import { DialogMmBbGiaoNhanComponent } from './mm-bien-ban-giao-nhan/mm-them-moi-bb-giao-nhan/dialog-mm-bb-giao-nhan/dialog-mm-bb-giao-nhan.component';
import { MmThongTinHienTrangComponent } from './mm-hien-trang-ccdc/mm-thong-tin-hien-trang/mm-thong-tin-hien-trang.component';
import { MmDialogThongBaoTuChoiComponent } from './mm-tong-hop-dx-cuc/mm-dialog-thong-bao-tu-choi/mm-dialog-thong-bao-tu-choi.component';

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
        MmTtPhanBoComponent,
        MmDxCucComponent,
        ThemMoiMmDxCucComponent,
        MmTongHopDxCucComponent,
        MmThemMoiTongHopDxCucComponent,
        MmQdMuaSamComponent,
        MmThemMoiQdMuaSamComponent,
        MmThemMoiQdMuaSamComponent,
        MmThemMoiTtPhanBoComponent,
        MmThongTinHopDongComponent,
        MmThongTinPhanBoCtComponent,
        MmThemMoiPhuLucComponent,
        MmThemMoiBbGiaoNhanComponent,
        DialogMmBbGiaoNhanComponent,
        MmThongTinHienTrangComponent,
        MmDialogThongBaoTuChoiComponent
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
        ThongTinDeXuatNhuCauChiCucComponent,
    ]
})
export class MayMocThietBiModule { }
