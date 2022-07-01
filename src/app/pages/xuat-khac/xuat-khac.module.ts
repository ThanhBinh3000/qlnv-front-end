import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { XuatKhacRoutingModule } from './xuat-khac-routing.module';
import { XuatKhacComponent } from './xuat-khac.component';


@NgModule({
    declarations: [
        XuatKhacComponent,
    ],
    imports: [CommonModule, XuatKhacRoutingModule, ComponentsModule, MainModule],
})
export class XuatKhacModule { }
