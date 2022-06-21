import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangHongHocGiamChatLuongComponent } from './hang-hong-hoc-giam-chat-luong.component';

@NgModule({
  declarations: [HangHongHocGiamChatLuongComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangHongHocGiamChatLuongComponent],
})
export class HangHongHocGiamChatLuongModule {}
