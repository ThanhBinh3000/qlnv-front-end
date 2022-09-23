import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KehoachLuachonMuatructiepComponent } from './kehoach-luachon-muatructiep.component';
import { CucComponent } from './cuc/cuc.component';
import { MainCucComponent } from './cuc/main-cuc/main-cuc.component';
import { DanhsachKehoachMuatructiepComponent } from './cuc/danhsach-kehoach-muatructiep/danhsach-kehoach-muatructiep.component';
import { ThemmoiKehoachMuatructiepComponent } from './cuc/danhsach-kehoach-muatructiep/themmoi-kehoach-muatructiep/themmoi-kehoach-muatructiep.component';
@NgModule({
  declarations: [
    KehoachLuachonMuatructiepComponent,
    CucComponent,
    MainCucComponent,
    DanhsachKehoachMuatructiepComponent,
    ThemmoiKehoachMuatructiepComponent,
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
  ]
})
export class KehoachLuachonMuatructiepModule { }
