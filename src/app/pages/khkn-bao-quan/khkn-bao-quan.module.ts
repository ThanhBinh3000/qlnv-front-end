import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KhknBaoQuanRoutingModule } from './khkn-bao-quan-routing.module';
import { KhknBaoQuanComponent } from './khkn-bao-quan.component';


@NgModule({
    declarations: [
        KhknBaoQuanComponent,
    ],
    imports: [CommonModule, KhknBaoQuanRoutingModule, ComponentsModule, MainModule],
})
export class KhknBaoQuanModule { }
