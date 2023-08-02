import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatRoutingModule } from './xuat-routing.module';
import { XuatComponent } from './xuat.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { XuatTieuHuyComponent } from './xuat-tieu-huy/xuat-tieu-huy.component';
import {XuatTieuHuyModule} from "./xuat-tieu-huy/xuat-tieu-huy.module";
import { BienBanLayMauComponent } from './kiem-tra-chat-luong/bien-ban-lay-mau/bien-ban-lay-mau.component';
import { ChiTietBienBanLayMauComponent } from './kiem-tra-chat-luong/bien-ban-lay-mau/chi-tiet-bien-ban-lay-mau/chi-tiet-bien-ban-lay-mau.component';

@NgModule({
  declarations: [XuatComponent, XuatTieuHuyComponent, BienBanLayMauComponent, ChiTietBienBanLayMauComponent],
  imports: [CommonModule, XuatRoutingModule, ComponentsModule, MainModule, XuatTieuHuyModule],
  exports: [
    BienBanLayMauComponent
  ]
})
export class XuatModule {}
