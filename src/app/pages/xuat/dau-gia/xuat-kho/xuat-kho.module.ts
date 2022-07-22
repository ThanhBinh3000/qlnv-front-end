import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NhapKhoComponent } from './nhap-kho.component';
import { XuatKhoComponent } from './xuat-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ChucNangXuatKhoComponent } from './chuc-nang-xuat-kho/chuc-nang-xuat-kho.component';
import { BangKeCanBangComponent } from './bang-ke-can-bang/bang-ke-can-bang.component';
import { ThongTinBangKeCanBangComponent } from './bang-ke-can-bang/thong-tin-bang-ke-can-bang/thong-tin-bang-ke-can-bang.component';

@NgModule({
  declarations: [
    XuatKhoComponent,
    ChucNangXuatKhoComponent,
    BangKeCanBangComponent,
    ThongTinBangKeCanBangComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    XuatKhoComponent,

  ]
})
export class XuatKhoModule { }
