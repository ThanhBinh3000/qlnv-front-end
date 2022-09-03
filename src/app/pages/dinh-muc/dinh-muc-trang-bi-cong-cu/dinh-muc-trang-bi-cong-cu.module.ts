import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HopDongMuaSamModule } from '../mang-pvc-cong-cu-dung-cu/hop-dong-mua-sam/hop-dong-mua-sam.module';
import { MayMocThietBiModule } from '../may-moc-thiet-bi/may-moc-thiet-bi.module';
import { ComponentsModule } from './../../../components/components.module';
import { DinhMucTrangBiCongCuRoutingModule } from './dinh-muc-trang-bi-cong-cu-routing.module';
import { DinhMucTrangBiCongCuComponent } from './dinh-muc-trang-bi-cong-cu.component';
import { DinhMucTrangBiComponent } from './dinh-muc-trang-bi/dinh-muc-trang-bi.component';
import { ThongTinDinhMucTrangBiComponent } from './dinh-muc-trang-bi/thong-tin-dinh-muc-trang-bi/thong-tin-dinh-muc-trang-bi.component';

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
    MayMocThietBiModule,
    HopDongMuaSamModule,
  ],
  exports: [
    DinhMucTrangBiCongCuComponent,
    DinhMucTrangBiComponent,
  ]
})
export class DinhMucTrangBiCongCuModule { }
