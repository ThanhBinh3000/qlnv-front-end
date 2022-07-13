import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { DieuChinhModule } from './dieu-chinh/dieu-chinh.module';
import { GiaoNhapHangModule } from './giao-nhap-hang/giao-nhap-hang.module';
import { HopDongModule } from './hop-dong/hop-dong.module';
import { KehoachLuachonNhathauModule } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.module';
import { KiemTraChatLuongModule } from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
import { NhapKhoModule } from './nhap-kho/nhap-kho.module';
import { TrienkhaiLuachonNhathauModule } from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.module';

@NgModule({
  declarations: [
    DauThauComponent,
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KiemTraChatLuongModule,
    GiaoNhapHangModule,
    NhapKhoModule,
    DieuChinhModule,
    HopDongModule,
    KehoachLuachonNhathauModule,
    TrienkhaiLuachonNhathauModule,
  ],
})
export class DauThauModule { }
