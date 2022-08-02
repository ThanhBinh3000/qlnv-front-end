import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { QuanTriDanhMucRoutingModule } from './quantridanhmuc-routing.module';
import { QuanTriDanhMucComponent } from './quantridanhmuc.component';
import { DanhMucDungChungComponent } from './danh-muc-dung-chung/danh-muc-dung-chung.component';
import { ThemDanhMucDungChungComponent } from './danh-muc-dung-chung/them-danh-muc-dung-chung/them-danh-muc-dung-chung.component';

@NgModule({
  declarations: [
    QuanTriDanhMucComponent,
    DanhMucDungChungComponent,
    ThemDanhMucDungChungComponent
  ],
  imports: [CommonModule, QuanTriDanhMucRoutingModule, ComponentsModule, MainModule, NzTreeViewModule],

})
export class QuanTriDanhMucModule { }
