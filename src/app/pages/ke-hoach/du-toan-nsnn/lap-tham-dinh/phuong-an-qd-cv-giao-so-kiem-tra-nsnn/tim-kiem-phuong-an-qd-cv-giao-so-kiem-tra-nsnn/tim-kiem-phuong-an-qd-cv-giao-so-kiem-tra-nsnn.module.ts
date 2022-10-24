import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnRoutingModule } from './tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn-routing.module';
import { TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnComponent } from './tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnComponent],
  imports: [CommonModule, TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnRoutingModule, ComponentsModule],
})
export class TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnModule {}
