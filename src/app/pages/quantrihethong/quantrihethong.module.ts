import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanTriHeThongRoutingModule } from './quantrihethong-routing.module';
import { QuanTriHeThongComponent } from './quantrihethong.component';
import { DanhSachComponent } from './danhsach/danhsach.component';
import { QlQuyenComponent } from './ql-quyen/ql-quyen.component';
import { QlNhomQuyenComponent } from './ql-nhomquyen/ql-nhomquyen.component';
import { QlLsTruyCapComponent } from './ql-ls-truycap/ql-ls-truycap.component';
import { QlThamSoHeThongComponent } from './ql-ts-hethong/ql-ts-hethong.component';
import { ThemMoiNSDComponent } from './danhsach/them-ql-nguoisudung/tm-nguoisudung.component';

@NgModule({
  declarations: [
    QuanTriHeThongComponent,
    DanhSachComponent,
    QlQuyenComponent,
    QlNhomQuyenComponent,
    QlLsTruyCapComponent,
    QlThamSoHeThongComponent,
    ThemMoiNSDComponent
  ],
  imports: [CommonModule, QuanTriHeThongRoutingModule, ComponentsModule, MainModule],

})
export class QuanTriHeThongModule { }
