import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimKiemSoKiemTraChiNsnnRoutingModule } from './tim-kiem-so-kiem-tra-chi-nsnn-routing.module';
import { TimKiemSoKiemTraChiNsnnComponent } from './tim-kiem-so-kiem-tra-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TimKiemSoKiemTraChiNsnnComponent],
  imports: [CommonModule, TimKiemSoKiemTraChiNsnnRoutingModule, ComponentsModule],
})
export class TimKiemSoKiemTraChiNsnnModule {}
