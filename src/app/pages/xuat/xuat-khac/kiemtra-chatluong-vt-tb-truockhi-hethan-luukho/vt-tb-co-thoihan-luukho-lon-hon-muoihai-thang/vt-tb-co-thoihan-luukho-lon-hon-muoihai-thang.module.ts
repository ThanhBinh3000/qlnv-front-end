import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToanBoDanhSachComponent } from './toan-bo-danh-sach/toan-bo-danh-sach.component';
import { TongHopDanhSachComponent } from './tong-hop-danh-sach/tong-hop-danh-sach.component';
import { KeHoachXuatHangCuaCucComponent } from './ke-hoach-xuat-hang-cua-cuc/ke-hoach-xuat-hang-cua-cuc.component';
import { TongHopKeHoachXuatHangComponent } from './tong-hop-ke-hoach-xuat-hang/tong-hop-ke-hoach-xuat-hang.component';
import { KeHoachXuatHangCuaTongCucComponent } from './ke-hoach-xuat-hang-cua-tong-cuc/ke-hoach-xuat-hang-cua-tong-cuc.component';
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzSelectModule} from "ng-zorro-antd/select";
import {DirectivesModule} from "../../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../../components/components.module";




@NgModule({
  declarations: [
    ToanBoDanhSachComponent,
    TongHopDanhSachComponent,
    KeHoachXuatHangCuaCucComponent,
    TongHopKeHoachXuatHangComponent,
    KeHoachXuatHangCuaTongCucComponent
  ],
  exports: [
    ToanBoDanhSachComponent,
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
