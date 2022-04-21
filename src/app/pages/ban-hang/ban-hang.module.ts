import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { BanHangRoutingModule } from './ban-hang-routing.module';
import { BanHangComponent } from './ban-hang.component';


@NgModule({
    declarations: [
        BanHangComponent,
    ],
    imports: [CommonModule, BanHangRoutingModule, ComponentsModule, MainModule],
})
export class BanHangModule { }
