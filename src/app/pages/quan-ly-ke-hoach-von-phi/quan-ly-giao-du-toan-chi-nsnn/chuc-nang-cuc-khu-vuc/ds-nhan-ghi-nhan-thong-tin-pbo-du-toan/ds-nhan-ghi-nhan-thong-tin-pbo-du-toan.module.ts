import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsNhanGhiNhanThongTinPboDuAnRoutingModule } from './ds-nhan-ghi-nhan-thong-tin-pbo-du-toan-routing.module';
import { DsNhanGhiNhanThongTinPboDuAnComponent } from './ds-nhan-ghi-nhan-thong-tin-pbo-du-toan.component';

@NgModule({
  declarations: [
    DsNhanGhiNhanThongTinPboDuAnComponent,
  ],
  imports: [
    CommonModule,
    DsNhanGhiNhanThongTinPboDuAnRoutingModule,
    ComponentsModule,
  ],
})

export class DsNhanGhiNhanThongTinPboDuAnModule {}
