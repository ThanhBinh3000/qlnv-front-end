
import { NhuCauXuatHangVienTroComponent } from './nhu-cau-xuat-hang-vien-tro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhuCauXuatHangVienTroRoutingModule } from './nhu-cau-xuat-hang-vien-tro-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    NhuCauXuatHangVienTroComponent,
  ],
  imports: [
    CommonModule,
    NhuCauXuatHangVienTroRoutingModule,
    ComponentsModule,
  ],
})

export class NhuCauXuatHangVienTroModule {}
