import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KehoachLuachonMuatructiepComponent } from './kehoach-luachon-muatructiep.component';
import { TongHopKhmttComponent } from './tong-hop-khmtt/tong-hop-khmtt.component';
import { ThemmoiTonghopKhmttComponent } from './tong-hop-khmtt/themmoi-tonghop-khmtt/themmoi-tonghop-khmtt.component';
import { QuyetdinhPheduyetKhmttComponent } from './quyetdinh-pheduyet-khmtt/quyetdinh-pheduyet-khmtt.component';
import { ThemmoiQuyetdinhKhmttComponent } from './quyetdinh-pheduyet-khmtt/themmoi-quyetdinh-khmtt/themmoi-quyetdinh-khmtt.component';
import { ThongtinDexuatMuattComponent } from './quyetdinh-pheduyet-khmtt/themmoi-quyetdinh-khmtt/thongtin-dexuat-muatt/thongtin-dexuat-muatt.component';
import { MainKehoachLuachonMuatructiepComponent } from './main-kehoach-luachon-muatructiep/main-kehoach-luachon-muatructiep.component';
import { DanhsachKehoachMuatructiepComponent } from './danhsach-kehoach-muatructiep/danhsach-kehoach-muatructiep.component';
import { ThemmoiKehoachMuatructiepComponent } from './danhsach-kehoach-muatructiep/themmoi-kehoach-muatructiep/themmoi-kehoach-muatructiep.component';
import { KeHoachVonDauNamModule } from "../../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";
import {DieuchinhKehoachMuattModule} from "../dieuchinh-kehoach-muatt/dieuchinh-kehoach-muatt.module";
@NgModule({
  declarations: [
    KehoachLuachonMuatructiepComponent,
    DanhsachKehoachMuatructiepComponent,
    ThemmoiKehoachMuatructiepComponent,
    TongHopKhmttComponent,
    ThemmoiTonghopKhmttComponent,
    QuyetdinhPheduyetKhmttComponent,
    ThemmoiQuyetdinhKhmttComponent,
    ThongtinDexuatMuattComponent,
    MainKehoachLuachonMuatructiepComponent,
  ],
  exports: [
    KehoachLuachonMuatructiepComponent,
    ThemmoiKehoachMuatructiepComponent
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        MainModule,
        KeHoachVonDauNamModule,
        DieuchinhKehoachMuattModule
    ]
})
export class KehoachLuachonMuatructiepModule { }
