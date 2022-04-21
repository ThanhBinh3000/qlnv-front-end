import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DieuChuyenNoiBoRoutingModule } from './dieu-chuyen-noi-bo-routing.module';
import { DieuChuyenNoiBoComponent } from './dieu-chuyen-noi-bo.component';


@NgModule({
    declarations: [
        DieuChuyenNoiBoComponent,
    ],
    imports: [CommonModule, DieuChuyenNoiBoRoutingModule, ComponentsModule, MainModule],
})
export class DieuChuyenNoiBoModule { }
