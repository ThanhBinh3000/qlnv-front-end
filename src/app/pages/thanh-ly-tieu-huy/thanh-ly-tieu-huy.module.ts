import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ThanhLyTieuHuyRoutingModule } from './thanh-ly-tieu-huy-routing.module';
import { ThanhLyTieuHuyComponent } from './thanh-ly-tieu-huy.component';


@NgModule({
    declarations: [
        ThanhLyTieuHuyComponent,
    ],
    imports: [CommonModule, ThanhLyTieuHuyRoutingModule, ComponentsModule, MainModule],
})
export class ThanhLyTieuHuyModule { }
