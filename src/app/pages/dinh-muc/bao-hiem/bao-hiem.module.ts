import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoHiemComponent } from './bao-hiem.component';
import { BaoHiemRoutingModule } from './bao-hiem-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BaoHiemRoutingModule,
  ],
  declarations: [BaoHiemComponent]
})
export class BaoHiemModule { }
