import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { KiemTraRoutingModule } from './kiem-tra-routing.module';
import { KiemTraComponent } from './kiem-tra.component';



@NgModule({
  declarations: [KiemTraComponent],
  imports: [CommonModule, KiemTraRoutingModule, ComponentsModule],
})
export class KiemTraModule {}
