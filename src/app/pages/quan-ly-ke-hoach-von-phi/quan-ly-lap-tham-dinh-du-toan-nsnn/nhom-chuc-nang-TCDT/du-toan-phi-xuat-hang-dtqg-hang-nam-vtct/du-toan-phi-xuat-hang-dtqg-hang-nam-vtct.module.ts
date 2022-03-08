import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuToanPhiXuatHangDtqgHangNamVtctRoutingModule } from './du-toan-phi-xuat-hang-dtqg-hang-nam-vtct-routing.module';
import { DuToanPhiXuatHangDtqgHangNamVtctComponent } from './du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DuToanPhiXuatHangDtqgHangNamVtctComponent,
  ],
  imports: [
    CommonModule,
    DuToanPhiXuatHangDtqgHangNamVtctRoutingModule,
    ComponentsModule,
  ],
})

export class DuToanPhiNhapXuatDtqgHangNamVtctModule {}
