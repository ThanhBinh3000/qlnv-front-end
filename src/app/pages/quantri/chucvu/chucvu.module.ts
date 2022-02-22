import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChucvuRoutingModule } from './chucvu-routing.module';
import { ChucvuComponent } from './chucvu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemchucvuComponent } from './themchucvu/themchucvu.component';

@NgModule({
  declarations: [ChucvuComponent, ThemchucvuComponent],
  imports: [CommonModule, ChucvuRoutingModule, ComponentsModule],
})
export class ChucvuModule {}
