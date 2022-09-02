import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DinhMucTrangBiCongCuComponent } from './dinh-muc-trang-bi-cong-cu.component';
import { DinhMucTrangBiComponent } from './dinh-muc-trang-bi/dinh-muc-trang-bi.component';
import { ThongTinDinhMucTrangBiComponent } from './dinh-muc-trang-bi/thong-tin-dinh-muc-trang-bi/thong-tin-dinh-muc-trang-bi.component';
import { DinhMucTrangBiCongCuRoutingModule } from './dinh-muc-trang-bi-cong-cu-routing.module';

@NgModule({
  declarations: [
    DinhMucTrangBiCongCuComponent,
    DinhMucTrangBiComponent,
    ThongTinDinhMucTrangBiComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DinhMucTrangBiCongCuRoutingModule,
  ],
  exports: [
    DinhMucTrangBiCongCuComponent,
    DinhMucTrangBiComponent,
  ]
})
export class DinhMucTrangBiCongCuModule { }
