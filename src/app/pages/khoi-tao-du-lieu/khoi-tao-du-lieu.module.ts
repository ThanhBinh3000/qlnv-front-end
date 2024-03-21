import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhoiTaoDuLieuComponent } from './khoi-tao-du-lieu.component';
import { MainModule } from '../../layout/main/main.module';
import { ComponentsModule } from '../../components/components.module';
import { KhoiTaoDuLieuRoutingModule } from './khoi-tao-du-lieu-routing.module';
import { HtCongCuDungCuComponent } from './ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component';




@NgModule({
  declarations: [
    KhoiTaoDuLieuComponent,
    HtCongCuDungCuComponent,
  ],
  imports: [
    CommonModule,
    MainModule,
    KhoiTaoDuLieuRoutingModule,
    ComponentsModule,
  ],
})
export class KhoiTaoDuLieuModule { }
