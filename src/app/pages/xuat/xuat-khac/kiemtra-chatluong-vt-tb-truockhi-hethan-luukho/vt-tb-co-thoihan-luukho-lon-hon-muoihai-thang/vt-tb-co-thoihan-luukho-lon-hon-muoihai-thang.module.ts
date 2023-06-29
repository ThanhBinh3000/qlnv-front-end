import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToanBoDanhSachVt12ThComponent } from './toan-bo-danh-sach/toan-bo-danh-sach-vt12th.component';
import { TongHopDanhSachComponent } from './tong-hop-danh-sach/tong-hop-danh-sach.component';
import { KeHoachXuatHangCuaCucComponent } from './ke-hoach-xuat-hang-cua-cuc/ke-hoach-xuat-hang-cua-cuc.component';
import { TongHopKeHoachXuatHangComponent } from './tong-hop-ke-hoach-xuat-hang/tong-hop-ke-hoach-xuat-hang.component';
import { KeHoachXuatHangCuaTongCucComponent } from './ke-hoach-xuat-hang-cua-tong-cuc/ke-hoach-xuat-hang-cua-tong-cuc.component';
import {DirectivesModule} from "../../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../../components/components.module";




@NgModule({
  declarations: [
    ToanBoDanhSachVt12ThComponent,
    TongHopDanhSachComponent,
    KeHoachXuatHangCuaCucComponent,
    TongHopKeHoachXuatHangComponent,
    KeHoachXuatHangCuaTongCucComponent
  ],
  exports: [
    ToanBoDanhSachVt12ThComponent,
    TongHopDanhSachComponent,
    KeHoachXuatHangCuaCucComponent,
    TongHopKeHoachXuatHangComponent,
    KeHoachXuatHangCuaTongCucComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ]
})
export class VtTbCoThoihanLuukhoLonHonMuoihaiThangModule { }
