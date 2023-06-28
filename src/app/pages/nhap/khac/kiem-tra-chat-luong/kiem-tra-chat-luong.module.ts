import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import { KiemTraChatLuongMenuComponent } from './kiem-tra-chat-luong-menu/kiem-tra-chat-luong-menu.component';
import { BienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan/bien-ban-nghiem-thu-bao-quan.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import {DirectivesModule} from "../../../../directives/directives.module";



@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    KiemTraChatLuongMenuComponent,
    BienBanNghiemThuBaoQuanComponent,
    LapBienBanNghiemThuBaoQuanComponent
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        MainModule,
        FormsModule,
        DirectivesModule,
    ],
  exports: [
    KiemTraChatLuongComponent
  ]
})
export class KiemTraChatLuongModule { }
