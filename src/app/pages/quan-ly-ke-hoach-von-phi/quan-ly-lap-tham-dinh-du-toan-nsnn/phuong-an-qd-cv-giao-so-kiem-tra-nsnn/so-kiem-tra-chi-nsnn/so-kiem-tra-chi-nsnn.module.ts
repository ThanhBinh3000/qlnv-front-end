import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoKiemTraChiNsnnRoutingModule } from './so-kiem-tra-chi-nsnn-routing.module';
import { SoKiemTraChiNsnnComponent } from './so-kiem-tra-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [SoKiemTraChiNsnnComponent],
  imports: [CommonModule, SoKiemTraChiNsnnRoutingModule, ComponentsModule],
})
export class SoKiemTraChiNsnnModule {}
