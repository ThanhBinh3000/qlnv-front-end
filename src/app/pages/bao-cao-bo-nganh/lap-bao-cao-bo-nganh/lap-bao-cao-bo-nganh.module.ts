import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguonHinhThanhDtqgComponent } from './nguon-hinh-thanh-dtqg/nguon-hinh-thanh-dtqg.component';
import { LapBaoCaoBoNganhRoutingModule } from "./lap-bao-cao-bo-nganh-routing.module";
import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { NzTreeViewModule } from "ng-zorro-antd/tree-view";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzIconModule } from "ng-zorro-antd/icon";
import { LapBaoCaoBoNganhComponent } from "./lap-bao-cao-bo-nganh.component";
import { ThemMoiNguonHinhThanhDtqgComponent } from './nguon-hinh-thanh-dtqg/them-moi-nguon-hinh-thanh-dtqg/them-moi-nguon-hinh-thanh-dtqg.component';
import { ThopNhapXuatHangDTQGComponent } from "./thop-nhap-xuat-hang-dtqg/thop-nhap-xuat-hang-dtqg.component";
import {
  ThemMoiThopNhapXuatHangDtqgComponent
} from "./thop-nhap-xuat-hang-dtqg/them-moi-thop-nhap-xuat-hang-dtqg/them-moi-thop-nhap-xuat-hang-dtqg.component";
import { TangHangDtqgComponent } from './tang-hang-dtqg/tang-hang-dtqg.component';
import { ThemMoiTangHangDtqgComponent } from './tang-hang-dtqg/them-moi-tang-hang-dtqg/them-moi-tang-hang-dtqg.component';
import { GiamHangDtqgComponent } from './giam-hang-dtqg/giam-hang-dtqg.component';
import { ThemMoiGiamHangDtqgComponent } from './giam-hang-dtqg/them-moi-giam-hang-dtqg/them-moi-giam-hang-dtqg.component';
import { ThemMoiLuanPhienDoiHangDtqgComponent } from './luan-phien-doi-hang-dtqg/them-moi-luan-phien-doi-hang-dtqg/them-moi-luan-phien-doi-hang-dtqg.component';
import { LuanPhienDoiHangDtqgComponent } from './luan-phien-doi-hang-dtqg/luan-phien-doi-hang-dtqg.component';
import { KhNhapXuatCtVtBqHangDtqgComponent } from './kh-nhap-xuat-ct-vt-bq-hang-dtqg/kh-nhap-xuat-ct-vt-bq-hang-dtqg.component';
import { ThemMoiKhNhapXuatCtVtBqHangDtqgComponent } from './kh-nhap-xuat-ct-vt-bq-hang-dtqg/them-moi-kh-nhap-xuat-ct-vt-bq-hang-dtqg/them-moi-kh-nhap-xuat-ct-vt-bq-hang-dtqg.component';
import { NhapXuatTonKhoHangDtqgComponent } from './nhap-xuat-ton-kho-hang-dtqg/nhap-xuat-ton-kho-hang-dtqg.component';
import { ThemMoiNhapXuatTonKhoHangDtqgComponent } from './nhap-xuat-ton-kho-hang-dtqg/them-moi-nhap-xuat-ton-kho-hang-dtqg/them-moi-nhap-xuat-ton-kho-hang-dtqg.component';
import { TongChiMuaHangComponent } from './tong-chi-mua-hang/tong-chi-mua-hang.component';
import { ThemMoiTongChiMuaHangComponent } from './tong-chi-mua-hang/them-moi-tong-chi-mua-hang/them-moi-tong-chi-mua-hang.component';
import { SlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg/sl-gtri-hang-dtqg.component';
import { ThemMoiSlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg/them-moi-sl-gtri-hang-dtqg/them-moi-sl-gtri-hang-dtqg.component';
import { DialogThemMoiSlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg.component';



@NgModule({
  declarations: [
    LapBaoCaoBoNganhComponent,
    NguonHinhThanhDtqgComponent,
    ThemMoiNguonHinhThanhDtqgComponent,
    ThopNhapXuatHangDTQGComponent,
    ThemMoiThopNhapXuatHangDtqgComponent,
    TangHangDtqgComponent,
    ThemMoiTangHangDtqgComponent,
    GiamHangDtqgComponent,
    ThemMoiGiamHangDtqgComponent,
    ThemMoiLuanPhienDoiHangDtqgComponent,
    LuanPhienDoiHangDtqgComponent,
    KhNhapXuatCtVtBqHangDtqgComponent,
    ThemMoiKhNhapXuatCtVtBqHangDtqgComponent,
    NhapXuatTonKhoHangDtqgComponent,
    ThemMoiNhapXuatTonKhoHangDtqgComponent,
    ThemMoiNguonHinhThanhDtqgComponent,
    TongChiMuaHangComponent,
    ThemMoiTongChiMuaHangComponent,
    SlGtriHangDtqgComponent,
    ThemMoiSlGtriHangDtqgComponent,
    DialogThemMoiSlGtriHangDtqgComponent
  ],
  imports: [
    CommonModule,
    LapBaoCaoBoNganhRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule
  ]
})
export class LapBaoCaoBoNganhModule { }
