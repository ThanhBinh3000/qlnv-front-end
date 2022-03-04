import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { DanhSachDauThauComponent } from './danh-sach-dau-thau/danh-sach-dau-thau.component';

@NgModule({
  declarations: [
    DauThauComponent,
    ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
    LuongDauThauGaoComponent,
    DanhSachDauThauComponent,
  ],
  imports: [CommonModule, DauThauRoutingModule, ComponentsModule],
})
export class DauThauModule {}
