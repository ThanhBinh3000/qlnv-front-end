import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MuaTrucTiepRoutingModule } from './mua-truc-tiep-routing.module';
import { MuaTrucTiepComponent } from './mua-truc-tiep.component';
import { KehoachLuachonMuatructiepModule } from './kehoach-luachon-muatructiep/kehoach-luachon-muatructiep.module';
import { TochucTrienkhaiMuatructiepModule } from './tochuc-trienkhai-muatructiep/tochuc-trienkhai-muatructiep.module';
import { DieuchinhKehoachMuattComponent } from './dieuchinh-kehoach-muatt/dieuchinh-kehoach-muatt.component';
import { DieuchinhKehoachMuattModule } from './dieuchinh-kehoach-muatt/dieuchinh-kehoach-muatt.module';
import { HopdongBangkePhieumuahangComponent } from './hopdong-bangke-phieumuahang/hopdong-bangke-phieumuahang.component';
import { HopdongBangkePhieumuahangModule } from './hopdong-bangke-phieumuahang/hopdong-bangke-phieumuahang.module';
import { GiaoNhapHangMuattComponent } from './giao-nhap-hang-muatt/giao-nhap-hang-muatt.component';
import { GiaoNhapHangMuattModule } from './giao-nhap-hang-muatt/giao-nhap-hang-muatt.module';


@NgModule({
  declarations: [
    MuaTrucTiepComponent,




  ],
  imports: [
    CommonModule,
    MuaTrucTiepRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KehoachLuachonMuatructiepModule,
    TochucTrienkhaiMuatructiepModule,
    DieuchinhKehoachMuattModule,
    HopdongBangkePhieumuahangModule,
    GiaoNhapHangMuattModule
  ],
})
export class MuaTrucTiepModule { }
