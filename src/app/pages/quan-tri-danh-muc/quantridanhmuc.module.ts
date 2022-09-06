import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { QuanTriDanhMucRoutingModule } from './quantridanhmuc-routing.module';
import { QuanTriDanhMucComponent } from './quantridanhmuc.component';
import { DanhMucDungChungComponent } from './danh-muc-dung-chung/danh-muc-dung-chung.component';
import { ThemDanhMucDungChungComponent } from './danh-muc-dung-chung/them-danh-muc-dung-chung/them-danh-muc-dung-chung.component';
import { DanhMucDonViComponent } from './danh-muc-don-vi/danh-muc-don-vi.component';
import { NewDonViComponent } from './danh-muc-don-vi/new-don-vi/new-don-vi.component';

@NgModule({
  declarations: [
    QuanTriDanhMucComponent,
    DanhMucDungChungComponent,
    ThemDanhMucDungChungComponent,
    DanhMucDonViComponent,
    NewDonViComponent,
  ],
  imports: [CommonModule, QuanTriDanhMucRoutingModule, ComponentsModule, MainModule, NzTreeViewModule],

})
export class QuanTriDanhMucModule { }
