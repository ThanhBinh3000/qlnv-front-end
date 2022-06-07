import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeHoachVonMuaBuComponent } from './ke-hoach-von-mua-bu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    KeHoachVonMuaBuComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KeHoachVonMuaBuComponent,
  ]
})
export class KeHoachVonMuaBuModule { }
