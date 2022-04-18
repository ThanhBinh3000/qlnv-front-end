import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ThocRoutingModule } from './thoc-routing.module';
import { ThocComponent } from './thoc.component';

@NgModule({
  declarations: [
    ThocComponent,
  ],
  imports: [
    CommonModule,
    ThocRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class ThocModule { }