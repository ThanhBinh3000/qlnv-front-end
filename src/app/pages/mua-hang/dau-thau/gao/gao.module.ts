import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { GaoRoutingModule } from './gao-routing.module';
import { GaoComponent } from './gao.component';

@NgModule({
  declarations: [
    GaoComponent,
  ],
  imports: [
    CommonModule,
    GaoRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class GaoModule { }