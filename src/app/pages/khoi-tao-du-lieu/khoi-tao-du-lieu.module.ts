import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KhoiTaoDuLieuRoutingModule} from './khoi-tao-du-lieu-routing.module';
import {ComponentsModule} from "../../components/components.module";
import {MainModule} from "../../layout/main/main.module";
import {KhoiTaoDuLieuComponent} from "./khoi-tao-du-lieu.component";
import {HtCongCuDungCuComponent} from "./ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component";
import { HtMayMocThietBiComponent } from './ht-may-moc-thiet-bi/ht-may-moc-thiet-bi.component';


@NgModule({
  declarations: [KhoiTaoDuLieuComponent, HtCongCuDungCuComponent, HtMayMocThietBiComponent],
  imports: [
    CommonModule,
    KhoiTaoDuLieuRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class KhoiTaoDuLieuModule { }