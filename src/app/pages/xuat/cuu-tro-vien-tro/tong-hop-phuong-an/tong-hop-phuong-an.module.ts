import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopPhuongAnComponent } from './tong-hop-phuong-an.component';
import { ThongTinTongHopPhuongAnComponent } from './thong-tin-tong-hop-phuong-an/thong-tin-tong-hop-phuong-an.component';
import {QuyetDinhPheDuyetPhuongAnModule} from "../quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.module";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhPheDuyetPhuongAnModule,
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
