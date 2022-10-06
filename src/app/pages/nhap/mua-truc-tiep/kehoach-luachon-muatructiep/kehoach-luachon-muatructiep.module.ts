import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KehoachLuachonMuatructiepComponent } from './kehoach-luachon-muatructiep.component';
import { CucComponent } from './cuc/cuc.component';
import { MainCucComponent } from './cuc/main-cuc/main-cuc.component';
import { DanhsachKehoachMuatructiepComponent } from './cuc/danhsach-kehoach-muatructiep/danhsach-kehoach-muatructiep.component';
import { ThemmoiKehoachMuatructiepComponent } from './cuc/danhsach-kehoach-muatructiep/themmoi-kehoach-muatructiep/themmoi-kehoach-muatructiep.component';
import { TongCucComponent } from './tong-cuc/tong-cuc.component';
import { MainTongCucComponent } from './tong-cuc/main-tong-cuc/main-tong-cuc.component';
import { TongHopKhmttComponent } from './tong-cuc/tong-hop-khmtt/tong-hop-khmtt.component';
import { ThemMoiKhmttComponent } from './tong-cuc/them-moi-khmtt/them-moi-khmtt.component';
import { ThemmoiTonghopKhmttComponent } from './tong-cuc/tong-hop-khmtt/themmoi-tonghop-khmtt/themmoi-tonghop-khmtt.component';
import { QuyetdinhPheduyetKhmttComponent } from './tong-cuc/quyetdinh-pheduyet-khmtt/quyetdinh-pheduyet-khmtt.component';
import { ThemmoiQuyetdinhKhmttComponent } from './tong-cuc/quyetdinh-pheduyet-khmtt/themmoi-quyetdinh-khmtt/themmoi-quyetdinh-khmtt.component';
import { ThongtinDexuatMuattComponent } from './tong-cuc/quyetdinh-pheduyet-khmtt/themmoi-quyetdinh-khmtt/thongtin-dexuat-muatt/thongtin-dexuat-muatt.component';
@NgModule({
  declarations: [
    KehoachLuachonMuatructiepComponent,
    CucComponent,
    MainCucComponent,
    DanhsachKehoachMuatructiepComponent,
    ThemmoiKehoachMuatructiepComponent,
    TongCucComponent,
    MainTongCucComponent,
    TongHopKhmttComponent,
    ThemMoiKhmttComponent,
    ThemmoiTonghopKhmttComponent,
    QuyetdinhPheduyetKhmttComponent,
    ThemmoiQuyetdinhKhmttComponent,
    ThongtinDexuatMuattComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    KehoachLuachonMuatructiepComponent,
    CucComponent,
    MainCucComponent,
    TongCucComponent,
  ]
})
export class KehoachLuachonMuatructiepModule { }
