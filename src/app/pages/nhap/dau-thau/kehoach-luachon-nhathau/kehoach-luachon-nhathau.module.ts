import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DanhsachKehoachLcntComponent } from './danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiKehoachLcntComponent } from './danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { QuyetdinhPheduyetKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { TongHopKhlcntComponent } from './tong-hop-khlcnt/tong-hop-khlcnt.component';
import { ThongtinDexuatComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/thongtin-dexuat/thongtin-dexuat.component';
import { MainKehoachLuachonNhathauComponent } from './main-kehoach-luachon-nhathau/main-kehoach-luachon-nhathau.component';
import { FormsModule } from "@angular/forms";
import {
  KeHoachVonDauNamModule
} from "../../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";
import { ThemmoiKehoachLcntVtComponent } from './danhsach-kehoach-lcnt/themmoi-kehoach-lcnt-vt/themmoi-kehoach-lcnt-vt.component';
import { ThemmoiQuyetdinhKhlcntVtComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt-vt/themmoi-quyetdinh-khlcnt-vt.component';
import { ThongtinDexuatVtComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt-vt/thongtin-dexuat-vt/thongtin-dexuat-vt.component';
import { DieuchinhLuachonNhathauComponent } from "./dieuchinh-luachon-nhathau/dieuchinh-luachon-nhathau.component";
import {
  ThemMoiDieuChinhComponent
} from "./dieuchinh-luachon-nhathau/themmoi-dieuchinh/themmoi-dieuchinh.component";
import {
  ThongtinDieuchinhComponent
} from "./dieuchinh-luachon-nhathau/themmoi-dieuchinh/thongtin-dieuchinh/thongtin-dieuchinh.component";
import { ThemmoiDieuchinhVtComponent } from './dieuchinh-luachon-nhathau/themmoi-dieuchinh-vt/themmoi-dieuchinh-vt.component';
import {
  ThongtinDieuchinhVtComponent
} from "./dieuchinh-luachon-nhathau/themmoi-dieuchinh-vt/thongtin-dieuchinh-vt/thongtin-dieuchinh-vt.component";


@NgModule({
  declarations: [
    KeHoachLuachonNhathauComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiKehoachLcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    ThemmoiQuyetdinhKhlcntComponent,
    TongHopKhlcntComponent,
    ThemmoiTonghopKhlcntComponent,
    ThongtinDexuatComponent,
    MainKehoachLuachonNhathauComponent,
    ThemmoiKehoachLcntVtComponent,
    ThemmoiQuyetdinhKhlcntVtComponent,
    ThongtinDexuatVtComponent,
    DieuchinhLuachonNhathauComponent,
    ThemMoiDieuChinhComponent,
    ThongtinDieuchinhComponent,
    ThongtinDieuchinhVtComponent,
    ThemmoiDieuchinhVtComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
    KeHoachVonDauNamModule
  ],
  exports: [
    KeHoachLuachonNhathauComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiKehoachLcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    ThemmoiQuyetdinhKhlcntComponent,
    TongHopKhlcntComponent,
    ThemmoiTonghopKhlcntComponent,
    ThongtinDexuatComponent,
    MainKehoachLuachonNhathauComponent,
    DieuchinhLuachonNhathauComponent,
    ThemmoiQuyetdinhKhlcntVtComponent
  ]
})
export class KehoachLuachonNhathauModule { }
