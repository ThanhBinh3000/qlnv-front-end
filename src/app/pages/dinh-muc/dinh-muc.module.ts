import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DinhMucRoutingModule } from './dinh-muc-routing.module';
import { DinhMucComponent } from './dinh-muc.component';


@NgModule({
    declarations: [
        DinhMucComponent,
    ],
    imports: [CommonModule, DinhMucRoutingModule, ComponentsModule, MainModule],
})
export class DinhMucModule { }
