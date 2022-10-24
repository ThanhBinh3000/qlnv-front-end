import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { VonPhiHangCuaBoNganhComponent } from './von-phi-hang-cua-bo-nganh.component';
import {VonPhiHangCuaBoNganhRoutingModule} from "./von-phi-hang-cua-bo-nganh-routing.module";


@NgModule({
  declarations: [
    VonPhiHangCuaBoNganhComponent,
  ],
  imports: [
    CommonModule,
    VonPhiHangCuaBoNganhRoutingModule,
    ComponentsModule,
  ],
})
export class VonPhiHangCuaBoNganhModule { }
