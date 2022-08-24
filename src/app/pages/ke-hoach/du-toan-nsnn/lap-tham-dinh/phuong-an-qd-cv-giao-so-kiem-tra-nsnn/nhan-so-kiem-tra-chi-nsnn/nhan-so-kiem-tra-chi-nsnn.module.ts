import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhanSoKiemTraChiNsnnRoutingModule } from './nhan-so-kiem-tra-chi-nsnn-routing.module';
import { NhanSoKiemTraChiNsnnComponent } from './nhan-so-kiem-tra-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [NhanSoKiemTraChiNsnnComponent],
  imports: [CommonModule, NhanSoKiemTraChiNsnnRoutingModule, ComponentsModule],
})
export class NhanSoKiemTraChiNsnnModule {}
