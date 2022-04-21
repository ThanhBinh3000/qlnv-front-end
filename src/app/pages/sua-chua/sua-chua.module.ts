import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { SuaChuaRoutingModule } from './sua-chua-routing.module';
import { SuaChuaComponent } from './sua-chua.component';


@NgModule({
    declarations: [
        SuaChuaComponent,
    ],
    imports: [CommonModule, SuaChuaRoutingModule, ComponentsModule, MainModule],
})
export class SuaChuaModule { }
