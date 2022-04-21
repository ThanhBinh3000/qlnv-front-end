import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { LuuKhoRoutingModule } from './luu-kho-routing.module';
import { LuuKhoComponent } from './luu-kho.component';


@NgModule({
    declarations: [
        LuuKhoComponent,
    ],
    imports: [CommonModule, LuuKhoRoutingModule, ComponentsModule, MainModule],
})
export class LuuKhoModule { }
