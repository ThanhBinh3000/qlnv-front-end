import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DauGiaComponent } from './dau-gia.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DauGiaRoutingModule } from './dau-gia-routing.module';
import { ThongTinLuongThucComponent } from './thong-tin-luong-thuc/thong-tin-luong-thuc.component';
import { LuaChonInComponent } from './lua-chon-in/lua-chon-in.component';

@NgModule({
  declarations: [
    DauGiaComponent,
    ThongTinLuongThucComponent,
    LuaChonInComponent,
  ],
  imports: [CommonModule, ComponentsModule, DauGiaRoutingModule],
})
export class DauGiaModule {}
