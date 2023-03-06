import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { ThemMoiPhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';
import { MainPhieuKiemTraChatLuongComponent } from './main-phieu-kiem-tra-chat-luong/main-phieu-kiem-tra-chat-luong.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { PhieuKiemTraChatLuongComponent } from './phieu-kiem-tra-chat-luong/phieu-kiem-tra-chat-luong.component';
import { ThemMoiPhieuKiemTraChatLuongComponent } from './phieu-kiem-tra-chat-luong/them-moi-phieu-kiem-tra-chat-luong/them-moi-phieu-kiem-tra-chat-luong.component';



@NgModule({
  declarations: [
    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    MainPhieuKiemTraChatLuongComponent,
    KiemTraChatLuongComponent,
    PhieuKiemTraChatLuongComponent,
    ThemMoiPhieuKiemTraChatLuongComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KiemTraChatLuongComponent
  ]
})
export class KiemTraChatLuongModule { }
