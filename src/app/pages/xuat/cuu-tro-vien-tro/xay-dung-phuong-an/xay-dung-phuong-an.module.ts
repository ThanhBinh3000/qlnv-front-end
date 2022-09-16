import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XayDungPhuongAnComponent } from './xay-dung-phuong-an.component';
import { ThongTinXayDungPhuongAnComponent } from './thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    XayDungPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,
  ],
  exports: [
    XayDungPhuongAnComponent,
  ]
})
export class XayDungPhuongAnModule { }
