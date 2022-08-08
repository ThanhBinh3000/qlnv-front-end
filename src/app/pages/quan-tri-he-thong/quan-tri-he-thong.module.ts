import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanLyCanBoComponent } from './quan-ly-can-bo/quan-ly-can-bo.component';
import { QuanTriHeThongNewRoutingModule } from './quan-tri-he-thong-routing.module';
import { QuanTriHeThongNewComponent } from './quan-tri-he-thong.component';

@NgModule({
  declarations: [
    QuanLyCanBoComponent,
    QuanTriHeThongNewComponent
  ],
  imports: [CommonModule, QuanTriHeThongNewRoutingModule, ComponentsModule, MainModule, NzTreeViewModule],

})
export class QuanTriHeThongNewModule { }
