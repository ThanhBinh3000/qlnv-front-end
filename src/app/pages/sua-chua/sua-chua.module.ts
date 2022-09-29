import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuaChuaRoutingModule } from './sua-chua-routing.module';
import { SuaChuaComponent } from './sua-chua.component';
import {MainModule} from "../../layout/main/main.module";
import {NzAffixModule} from "ng-zorro-antd/affix";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import { DanhSachHangDtqgComponent } from './danh-sach-hang-dtqg/danh-sach-hang-dtqg.component';
import { TongHopDanhSachComponent } from './tong-hop-danh-sach/tong-hop-danh-sach.component';
import { QuyetDinhSuaChuaComponent } from './quyet-dinh-sua-chua/quyet-dinh-sua-chua.component';
import { XuatHangDtqgComponent } from './xuat-hang-dtqg/xuat-hang-dtqg.component';
import { PhieuKiemDinhClComponent } from './phieu-kiem-dinh-cl/phieu-kiem-dinh-cl.component';
import { NhapHangDtqgComponent } from './nhap-hang-dtqg/nhap-hang-dtqg.component';
import { BaoCaoKqComponent } from './bao-cao-kq/bao-cao-kq.component';
import {ComponentsModule} from "../../components/components.module";
import {NzTreeViewModule} from "ng-zorro-antd/tree-view";
import {ThemMoiTongHopComponent} from "./tong-hop-danh-sach/them-moi-tong-hop/them-moi-tong-hop.component";
import {ThemMoiQdSuaChuaComponent} from "./quyet-dinh-sua-chua/them-moi-qd-sua-chua/them-moi-qd-sua-chua.component";
import { ThemMoiBaoCaoKqComponent } from './bao-cao-kq/them-moi-bao-cao-kq/them-moi-bao-cao-kq.component';


@NgModule({
    declarations: [
        SuaChuaComponent,
        DanhSachHangDtqgComponent,
        TongHopDanhSachComponent,
        QuyetDinhSuaChuaComponent,
        XuatHangDtqgComponent,
        PhieuKiemDinhClComponent,
        NhapHangDtqgComponent,
        BaoCaoKqComponent,
        ThemMoiTongHopComponent,
        ThemMoiQdSuaChuaComponent,
        ThemMoiBaoCaoKqComponent
    ],
  imports: [
    CommonModule,
    SuaChuaRoutingModule,
    MainModule,
    ComponentsModule,
    NzTreeViewModule
  ]
})
export class SuaChuaModule { }
