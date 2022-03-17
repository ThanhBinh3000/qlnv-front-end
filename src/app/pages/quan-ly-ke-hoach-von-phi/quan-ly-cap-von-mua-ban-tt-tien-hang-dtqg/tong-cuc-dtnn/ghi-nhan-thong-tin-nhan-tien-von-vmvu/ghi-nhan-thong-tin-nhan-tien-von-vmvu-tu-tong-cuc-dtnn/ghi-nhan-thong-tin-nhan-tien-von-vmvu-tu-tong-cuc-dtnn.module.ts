import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnRoutingModule } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn-routing.module';
import { GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnComponent } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnComponent
  ],
  imports: [
    CommonModule,
    GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnModule {}
