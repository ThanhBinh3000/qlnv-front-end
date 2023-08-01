import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';

import { KeHoachVonDauNamModule } from "../../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";
import {DieuchinhKehoachMuattModule} from "../dieuchinh-kehoach-muatt/dieuchinh-kehoach-muatt.module";
import {QdKhUyQuyenMuaLeComponent} from "./qd-kh-uy-quyen-mua-le.component";
import {
  ThemmoiQdKhUyQuyenMuaLeComponent
} from "./themmoi-qd-kh-uy-quyen-mua-le/themmoi-qd-kh-uy-quyen-mua-le.component";
import {HopdongBangkePhieumuahangModule} from "../hopdong-bangke-phieumuahang/hopdong-bangke-phieumuahang.module";
@NgModule({
  declarations: [
    QdKhUyQuyenMuaLeComponent,
    ThemmoiQdKhUyQuyenMuaLeComponent
  ],
  exports: [
    QdKhUyQuyenMuaLeComponent,
    ThemmoiQdKhUyQuyenMuaLeComponent

  ],
    imports: [
        CommonModule,
        ComponentsModule,
        MainModule,
        KeHoachVonDauNamModule,
        DieuchinhKehoachMuattModule,
        HopdongBangkePhieumuahangModule
    ]
})
export class QdKhUyQuyenMuaLeModule { }
