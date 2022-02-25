import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachRoutingModule } from './ke-hoach-routing.module';
import { KeHoachComponent } from './ke-hoach.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';

@NgModule({
  declarations: [KeHoachComponent],
  imports: [CommonModule, KeHoachRoutingModule, ComponentsModule, MainModule],
})
export class KeHoachModule {}
