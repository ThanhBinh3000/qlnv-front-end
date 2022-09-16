import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TongHopPhuongAnComponent } from './tong-hop-phuong-an.component';
import { ThongTinTongHopPhuongAnComponent } from './thong-tin-tong-hop-phuong-an/thong-tin-tong-hop-phuong-an.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TongHopPhuongAnComponent,
    ThongTinTongHopPhuongAnComponent,
  ],
  exports: [
    TongHopPhuongAnComponent,
  ]
})
export class TongHopPhuongAnModule { }
