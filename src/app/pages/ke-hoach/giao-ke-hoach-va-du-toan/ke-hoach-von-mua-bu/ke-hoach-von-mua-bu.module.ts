import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeHoachVonMuaBuComponent } from './ke-hoach-von-mua-bu.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { QuyetDinhComponent } from './quyet-dinh/quyet-dinh.component';
import { ChiTieuKeHoachComponent } from './chi-tieu-ke-hoach/chi-tieu-ke-hoach.component';
import { DieuChinhKeHoachComponent } from './dieu-chinh-ke-hoach/dieu-chinh-ke-hoach.component';
import { TtcpMuabuComponent } from './quyet-dinh/ttcp-muabu/ttcp-muabu.component';
import { BtcMuaBuComponent } from './quyet-dinh/btc-mua-bu/btc-mua-bu.component';
import { UbtvqhMuabuComponent } from './quyet-dinh/ubtvqh-muabu/ubtvqh-muabu.component';
import { ThemMoiUbtvqhComponent } from './quyet-dinh/ubtvqh-muabu/them-moi-ubtvqh/them-moi-ubtvqh.component';
import { ThemMoiTtcpComponent } from './quyet-dinh/ttcp-muabu/them-moi-ttcp/them-moi-ttcp.component';
import { ThemMoiBtcComponent } from "./quyet-dinh/btc-mua-bu/them-moi-btc/them-moi-btc.component";

@NgModule({
  declarations: [
    KeHoachVonMuaBuComponent,
    QuyetDinhComponent,
    ChiTieuKeHoachComponent,
    DieuChinhKeHoachComponent,
    TtcpMuabuComponent,
    BtcMuaBuComponent,
    UbtvqhMuabuComponent,
    ThemMoiUbtvqhComponent,
    ThemMoiTtcpComponent,
    ThemMoiBtcComponent
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
