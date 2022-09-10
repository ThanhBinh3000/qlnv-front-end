import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanLyKhoTangRoutingModule } from './quan-ly-kho-tang-routing.module';
import { QuanLyKhoTangComponent } from './quan-ly-kho-tang.component';
import { MangLuoiKhoComponent } from './mang-luoi-kho/mang-luoi-kho.component';
import { KeHoachComponent } from './ke-hoach/ke-hoach.component';


@NgModule({
    declarations: [
        QuanLyKhoTangComponent,
        MangLuoiKhoComponent,
        KeHoachComponent,
    ],
    imports: [CommonModule, QuanLyKhoTangRoutingModule, ComponentsModule, MainModule],
})
export class QuanLyKhoTangModule { }
