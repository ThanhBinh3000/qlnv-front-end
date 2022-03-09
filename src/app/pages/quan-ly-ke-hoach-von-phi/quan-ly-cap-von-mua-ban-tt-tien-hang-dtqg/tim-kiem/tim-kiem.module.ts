import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimKiemRoutingModule } from './tim-kiem-routing.module';
import { TimKiemComponent } from './tim-kiem.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TimKiemComponent],
  imports: [CommonModule, TimKiemRoutingModule, ComponentsModule],
})
export class TimKiemModule {}
