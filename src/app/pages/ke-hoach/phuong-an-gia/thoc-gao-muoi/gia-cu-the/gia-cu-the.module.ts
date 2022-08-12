import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { GiaCuTheComponent } from './gia-cu-the.component';

@NgModule({
  declarations: [GiaCuTheComponent],
  imports: [CommonModule, ComponentsModule,],
  exports: [GiaCuTheComponent],
})
export class GiaCuTheModule { }
