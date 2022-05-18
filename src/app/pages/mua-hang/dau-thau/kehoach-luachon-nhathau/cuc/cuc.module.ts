import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CucRoutingModule } from './cuc-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CucRoutingModule,
    ComponentsModule, 
    MainModule
  ]
})
export class CucModule { }
