import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import {ToChucThanhLyRoutingModule} from "./to-chuc-thanh-ly-routing.module";
import {ToChucThanhLyComponent} from "./to-chuc-thanh-ly.component";
import {ThongTinDauGiaThanhLyComponent} from "./thong-tin-dau-gia-thanh-ly/thong-tin-dau-gia-thanh-ly.component";
import {
  ChiTietThongTinDauGiaThanhLyComponent
} from "./thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly.component";
import {
  ThongTinChiTietDauGiaThanhLyComponent
} from "./thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly/thong-tin-dau-gia-thanh-ly/thong-tin-chi-tiet-dau-gia-thanh-ly.component";



@NgModule({
  declarations: [
    ToChucThanhLyComponent,
    ThongTinDauGiaThanhLyComponent,
    ChiTietThongTinDauGiaThanhLyComponent,
    ThongTinChiTietDauGiaThanhLyComponent
  ],
  imports: [
    CommonModule,
    ToChucThanhLyRoutingModule,
    ComponentsModule
  ],
  exports: [
    ToChucThanhLyComponent,
  ]
})
export class ToChucThanhLyModule { }
