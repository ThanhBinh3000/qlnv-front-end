import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TestJoinPhuLucRoutingModule } from './test-join-phu-luc-routing.module';
import { TestJoinPhuLucComponent } from './test-join-phu-luc.component';
import { TestPl1Component } from './test-pl1/test-pl1.component';
import { TestPl2Component } from './test-pl2/test-pl2.component';

@NgModule({
  declarations: [
    TestJoinPhuLucComponent,
    TestPl1Component,
    TestPl2Component
  ],
  imports: [
    CommonModule,
    TestJoinPhuLucRoutingModule,
    ComponentsModule,
  ],
})

export class TestJoinPhuLucModule {}
