import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoNghiepVuQlyKhoRoutingModule } from './bao-cao-nghiep-vu-qly-kho-routing.module';
import { ThongTinHienTrangCaiTaoSuaChuaKho } from './thong-tin-hien-trang-cai-tao-sua-chua-kho/thong-tin-hien-trang-cai-tao-sua-chua-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BaoCaoNghiepVuQlyKhoComponent } from './bao-cao-nghiep-vu-qly-kho.component';
import { BaoCaoRaSoatTichLuongKho } from './bao-cao-ra-soat-tich-luong-kho/bao-cao-ra-soat-tich-luong-kho.component';
import { BaoCaoHienTrangKhoTangComponent } from './bao-cao-hien-trang-kho-tang/bao-cao-hien-trang-kho-tang.component';
import {NgApexchartsModule} from "ng-apexcharts";

@NgModule({
  declarations: [
    BaoCaoNghiepVuQlyKhoComponent,
    ThongTinHienTrangCaiTaoSuaChuaKho,
    BaoCaoRaSoatTichLuongKho,
    BaoCaoHienTrangKhoTangComponent
  ],
  imports: [
    CommonModule,
    BaoCaoNghiepVuQlyKhoRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule,
    NgApexchartsModule,
  ]
})
export class BaoCaoNghiepVuQlyKhoModule { }
