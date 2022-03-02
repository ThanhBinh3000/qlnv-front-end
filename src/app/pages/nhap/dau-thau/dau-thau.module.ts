import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DauThauComponent, ThemMoiDeXuatKeHoachLuaChonNhaThauComponent],
  imports: [CommonModule, DauThauRoutingModule, ComponentsModule],
})
export class DauThauModule {}
