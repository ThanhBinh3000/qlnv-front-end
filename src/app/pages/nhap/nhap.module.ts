import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapRoutingModule } from './nhap-routing.module';
import { NhapComponent } from './nhap.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';

@NgModule({
  declarations: [NhapComponent],
  imports: [CommonModule, NhapRoutingModule, ComponentsModule, MainModule],
})
export class NhapModule {}
