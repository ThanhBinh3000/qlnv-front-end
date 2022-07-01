import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NhapKhacRoutingModule } from './nhap-khac-routing.module';
import { NhapKhacComponent } from './nhap-khac.component';


@NgModule({
    declarations: [
        NhapKhacComponent,
    ],
    imports: [CommonModule, NhapKhacRoutingModule, ComponentsModule, MainModule],
})
export class NhapKhacModule { }
