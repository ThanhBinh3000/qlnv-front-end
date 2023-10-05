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
import { ThemQlQuyenComponent } from './ql-quyen/them-ql-quyen/them-ql-quyen.component';
import { ThemQlNhomQuyenComponent } from './ql-nhomquyen/them-ql-nhom-quyen/them-ql-nhom-quyen.component';
import { NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ThemQlTSHethongComponent } from './ql-ts-hethong/them-ql-ts-hethong/them-ql-ts-hethong.component';
import { QlKhoaMokhoaComponent } from './ql-khoa-mokhoa/ql-khoa-mokhoa.component';
import { ThemQlCMTSoComponent } from './ql-cmt-so/them-ql-cmt-so/them-ql-cmt-so.component';
import { QlCMTSOComponent } from './ql-cmt-so/ql-cmt-so.component';

@NgModule({
  declarations: [
    QuanTriHeThongComponent,
    DanhSachComponent,
    QlQuyenComponent,
    QlNhomQuyenComponent,
    QlLsTruyCapComponent,
    QlThamSoHeThongComponent,
    ThemMoiNSDComponent,
    ThemQlQuyenComponent,
    ThemQlNhomQuyenComponent,
    ThemQlTSHethongComponent,
    QlKhoaMokhoaComponent,
    ThemQlCMTSoComponent,
    QlCMTSOComponent
  ],
  imports: [CommonModule, QuanTriHeThongRoutingModule, ComponentsModule, MainModule, NzTreeViewModule],

})
export class QuanTriHeThongModule { }
