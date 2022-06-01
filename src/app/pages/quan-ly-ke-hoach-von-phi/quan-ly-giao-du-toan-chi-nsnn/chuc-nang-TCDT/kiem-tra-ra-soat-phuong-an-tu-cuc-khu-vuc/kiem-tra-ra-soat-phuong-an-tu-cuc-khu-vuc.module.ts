import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { KiemTraRaSoatPhuongAnTuCucKhuVucRoutingModule } from './kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc-routing.module';
import { KiemTraRaSoatPhuongAnTuCucKhuVucComponent } from './kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.component';

@NgModule({
  declarations: [KiemTraRaSoatPhuongAnTuCucKhuVucComponent],
  imports: [CommonModule, KiemTraRaSoatPhuongAnTuCucKhuVucRoutingModule, ComponentsModule],
})
export class KiemTraRaSoatPhuongAnTuCucKhuVucModule {}
