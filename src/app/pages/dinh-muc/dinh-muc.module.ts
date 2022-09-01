import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DinhMucPhiBaoQuanComponent } from './dinh-muc-phi-bao-quan/dinh-muc-phi-bao-quan.component';
import { ThongTinDinhMucPhiBaoQuanComponent } from './dinh-muc-phi-bao-quan/thong-tin-dinh-muc-phi-bao-quan/thong-tin-dinh-muc-phi-bao-quan.component';
import { DinhMucRoutingModule } from './dinh-muc-routing.module';
import { DinhMucComponent } from './dinh-muc.component';


@NgModule({
    declarations: [
        DinhMucComponent,
        DinhMucPhiBaoQuanComponent,
        ThongTinDinhMucPhiBaoQuanComponent,
    ],
    imports: [CommonModule, DinhMucRoutingModule, ComponentsModule, MainModule],
})
export class DinhMucModule { }
