import { NhanGhiNhanThongTinPboDuAnComponent } from './nhan-ghi-nhan-thong-tin-pbo-du-an.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhanGhiNhanThongTinPboDuAnRoutingModule } from './nhan-ghi-nhan-thong-tin-pbo-du-an-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhanGhiNhanThongTinPboDuAnComponent,
  ],
  imports: [
    CommonModule,
    NhanGhiNhanThongTinPboDuAnRoutingModule,
    ComponentsModule,
  ],
})

export class NhanGhiNhanThongTinPboDuAnModule {}
