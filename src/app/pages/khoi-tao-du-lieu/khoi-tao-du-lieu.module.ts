import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KhoiTaoDuLieuRoutingModule} from './khoi-tao-du-lieu-routing.module';
import {ComponentsModule} from "../../components/components.module";
import {MainModule} from "../../layout/main/main.module";
import {KhoiTaoDuLieuComponent} from "./khoi-tao-du-lieu.component";
import {HtCongCuDungCuComponent} from "./ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component";
import { HtMayMocThietBiComponent } from './ht-may-moc-thiet-bi/ht-may-moc-thiet-bi.component';
import { HopDongComponent } from './hop-dong/hop-dong.component';
import {HopDongModule} from "./hop-dong/hop-dong.module";
import { CongTacDauGiaComponent } from './cong-tac-dau-gia/cong-tac-dau-gia.component';
import { CongTacDauThauComponent } from './cong-tac-dau-thau/cong-tac-dau-thau.component';
import {CongTacDauGiaModule} from "./cong-tac-dau-gia/cong-tac-dau-gia.module";


@NgModule({
  declarations: [KhoiTaoDuLieuComponent, HtCongCuDungCuComponent, HtMayMocThietBiComponent, HopDongComponent, CongTacDauGiaComponent, CongTacDauThauComponent],
  imports: [
    CommonModule,
    KhoiTaoDuLieuRoutingModule,
    ComponentsModule,
    MainModule,
    HopDongModule,
    CongTacDauGiaModule
  ]
})
export class KhoiTaoDuLieuModule { }
