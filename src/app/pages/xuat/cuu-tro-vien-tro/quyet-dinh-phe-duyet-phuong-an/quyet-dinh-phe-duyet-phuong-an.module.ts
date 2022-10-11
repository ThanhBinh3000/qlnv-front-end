import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {QuyetDinhPheDuyetPhuongAnComponent} from "./quyet-dinh-phe-duyet-phuong-an.component";
import {
  ThongTinQuyetDinhPheDuyetPhuongAnComponent
} from "./thong-tin-quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an.component";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,
  ],
  exports: [
    QuyetDinhPheDuyetPhuongAnComponent,
  ]
})
export class QuyetDinhPheDuyetPhuongAnModule {
}
