import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KiemSoatQuyenTruyCapComponent } from './kiem-soat-quyen-truy-cap/kiem-soat-quyen-truy-cap.component';
import { QuanLyCanBoComponent } from './quan-ly-can-bo/quan-ly-can-bo.component';
import { QuanLyQuyenComponent } from './quan-ly-quyen/quan-ly-quyen.component';
import { QuanTriHeThongNewRoutingModule } from './quan-tri-he-thong-routing.module';
import { QuanTriHeThongNewComponent } from './quan-tri-he-thong.component';

@NgModule({
  declarations: [
    QuanLyCanBoComponent,
    QuanTriHeThongNewComponent,
    QuanLyQuyenComponent,
    KiemSoatQuyenTruyCapComponent
  ],
  imports: [CommonModule, QuanTriHeThongNewRoutingModule, ComponentsModule, MainModule, NzTreeViewModule],

})
export class QuanTriHeThongNewModule { }
