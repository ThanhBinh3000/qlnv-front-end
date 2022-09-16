import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhPheDuyetPhuongAnComponent } from './quyet-dinh-phe-duyet-phuong-an.component';
import { ThongTinQuyetDinhPheDuyetPhuongAnComponent } from './thong-tin-quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,
  ],
  exports: [
    QuyetDinhPheDuyetPhuongAnComponent,
  ]
})
export class QuyetDinhPheDuyetPhuongAnModule { }
