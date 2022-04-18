import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { MuaHangRoutingModule } from './mua-hang-routing.module';
import { MuaHangComponent } from './mua-hang.component';


@NgModule({
    declarations: [
        MuaHangComponent,
    ],
    imports: [CommonModule, MuaHangRoutingModule, ComponentsModule, MainModule],
})
export class MuaHangModule { }
