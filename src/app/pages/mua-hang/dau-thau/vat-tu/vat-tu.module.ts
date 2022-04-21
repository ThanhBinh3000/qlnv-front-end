import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { VatTuRoutingModule } from './vat-tu-routing.module';
import { VatTuComponent } from './vat-tu.component';

@NgModule({
  declarations: [
    VatTuComponent,
  ],
  imports: [
    CommonModule,
    VatTuRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class VatTuModule { }