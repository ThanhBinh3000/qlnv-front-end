import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HopDongRoutingModule } from './hop-dong-routing.module';
import { HopDongMuaComponent } from './hop-dong-mua/hop-dong-mua.component';
import { HopDongBanComponent } from './hop-dong-ban/hop-dong-ban.component';
import { HopDongKinhTeDtxdComponent } from './hop-dong-kinh-te-dtxd/hop-dong-kinh-te-dtxd.component';
import { HopDongSuaChuaLonComponent } from './hop-dong-sua-chua-lon/hop-dong-sua-chua-lon.component';
import { HopDongSuaChuaTxComponent } from './hop-dong-sua-chua-tx/hop-dong-sua-chua-tx.component';
import { HopDongPvcCcdcComponent } from './hop-dong-pvc-ccdc/hop-dong-pvc-ccdc.component';
import { HopDongMmTbcdComponent } from './hop-dong-mm-tbcd/hop-dong-mm-tbcd.component';


@NgModule({
  declarations: [
    HopDongMuaComponent,
    HopDongBanComponent,
    HopDongKinhTeDtxdComponent,
    HopDongSuaChuaLonComponent,
    HopDongSuaChuaTxComponent,
    HopDongPvcCcdcComponent,
    HopDongMmTbcdComponent
  ],
  exports: [
    HopDongMuaComponent,
    HopDongBanComponent,
    HopDongKinhTeDtxdComponent,
    HopDongSuaChuaLonComponent,
    HopDongSuaChuaTxComponent,
    HopDongPvcCcdcComponent,
    HopDongMmTbcdComponent
  ],
  imports: [
    CommonModule,
    HopDongRoutingModule
  ]
})
export class HopDongModule { }
