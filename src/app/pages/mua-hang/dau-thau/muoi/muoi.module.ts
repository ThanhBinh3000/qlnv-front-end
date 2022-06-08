import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { MuoiRoutingModule } from './muoi-routing.module';
import { MuoiComponent } from './muoi.component';

@NgModule({
  declarations: [
    MuoiComponent,
  ],
  imports: [
    CommonModule,
    MuoiRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class MuoiModule { }