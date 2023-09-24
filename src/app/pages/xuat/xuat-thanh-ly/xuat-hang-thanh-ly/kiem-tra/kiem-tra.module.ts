import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KiemTraRoutingModule } from './kiem-tra-routing.module';
import { KiemTraComponent } from './kiem-tra.component';
import {ComponentsModule} from "../../../../../components/components.module";


@NgModule({
  declarations: [
    KiemTraComponent
  ],
  imports: [
    CommonModule,
    KiemTraRoutingModule,
    ComponentsModule
  ]
})
export class KiemTraModule { }
