import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopComponent } from './tong-hop.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    TongHopComponent,
  ],
  exports: [
    TongHopComponent,
  ]
})
export class TongHopModule { }
