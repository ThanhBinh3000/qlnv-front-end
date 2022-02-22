import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuantriRoutingModule } from './quantri-routing.module';
import { QuantriComponent } from './quantri.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';

@NgModule({
  declarations: [
    QuantriComponent,
  
  ],
  imports: [
    CommonModule,
    QuantriRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class QuantriModule { }
