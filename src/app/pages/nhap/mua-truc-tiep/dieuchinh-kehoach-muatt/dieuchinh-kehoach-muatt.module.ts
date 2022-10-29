import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainModule } from 'src/app/layout/main/main.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DieuchinhKehoachMuattComponent } from './dieuchinh-kehoach-muatt.component';
import { DieuchinhLuachonMuattComponent } from './dieuchinh-luachon-muatt/dieuchinh-luachon-muatt.component';
import { ThemmoiDieuchinhMuattComponent } from './dieuchinh-luachon-muatt/themmoi-dieuchinh-muatt/themmoi-dieuchinh-muatt.component';
import { ThongtinDieuchinhComponent } from './dieuchinh-luachon-muatt/themmoi-dieuchinh-muatt/thongtin-dieuchinh/thongtin-dieuchinh.component';
@NgModule({
  declarations: [
    DieuchinhKehoachMuattComponent,
    DieuchinhLuachonMuattComponent,
    ThemmoiDieuchinhMuattComponent,
    ThongtinDieuchinhComponent

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    DieuchinhKehoachMuattComponent
  ]
})
export class DieuchinhKehoachMuattModule { }
