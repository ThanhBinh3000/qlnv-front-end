import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.component';
import { DieuchinhLuachonNhathauComponent } from './dieuchinh-luachon-nhathau/dieuchinh-luachon-nhathau.component';
import { CucComponent } from './kehoach-luachon-nhathau/luong-thuc/cuc/cuc.component';
import { TongCucComponent } from './kehoach-luachon-nhathau/luong-thuc/tong-cuc/tong-cuc.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.component';


@NgModule({
  declarations: [
    DauThauComponent,
    TrienkhaiLuachonNhathauComponent,
    DieuchinhLuachonNhathauComponent,
    KeHoachLuachonNhathauComponent,
  ],
  imports: [CommonModule, DauThauRoutingModule, ComponentsModule],
})
export class DauThauModule { }
