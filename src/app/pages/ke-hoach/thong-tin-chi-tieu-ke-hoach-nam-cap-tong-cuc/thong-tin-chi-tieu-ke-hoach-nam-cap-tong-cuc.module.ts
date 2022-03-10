import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThongTinChiTieuKeHoachNamRoutingModule } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc-routing.module';
import { ThongTinChiTieuKeHoachNamComponent } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { LuaChonInComponent } from './lua-chon-in/lua-chon-in.component';

@NgModule({
  declarations: [ThongTinChiTieuKeHoachNamComponent, LuaChonInComponent],
  imports: [
    CommonModule,
    ThongTinChiTieuKeHoachNamRoutingModule,
    ComponentsModule,
  ],
})
export class ThongTinChiTieuKeHoachNamModule {}
