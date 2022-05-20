import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ChiCucRoutingModule } from './chi-cuc-routing.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ChiCucRoutingModule,
    ComponentsModule,
    MainModule
  ]
})
export class ChiCucModule { }
