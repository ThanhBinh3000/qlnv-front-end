import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanLyChatLuongRoutingModule } from './quan-ly-chat-luong-routing.module';
import { QuanLyChatLuongComponent } from './quan-ly-chat-luong.component';


@NgModule({
    declarations: [
        QuanLyChatLuongComponent,
    ],
    imports: [CommonModule, QuanLyChatLuongRoutingModule, ComponentsModule, MainModule],
})
export class QuanLyChatLuongModule { }
