import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KiemTraChatLuongRoutingModule } from './kiem-tra-chat-luong-routing.module';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';

@NgModule({
  declarations: [KiemTraChatLuongComponent],
  imports: [CommonModule, KiemTraChatLuongRoutingModule, ComponentsModule, MainModule],
})
export class KiemTraChatLuongModule { }
