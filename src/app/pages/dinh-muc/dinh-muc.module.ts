import { NzAffixModule } from 'ng-zorro-antd/affix';
import { DirectivesModule } from './../../directives/directives.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DinhMucRoutingModule } from './dinh-muc-routing.module';
import { DinhMucComponent } from './dinh-muc.component';
import { DinhMucPhiBaoQuanComponent } from './dinh-muc-phi-bao-quan/dinh-muc-phi-bao-quan.component';


@NgModule({
    declarations: [
        DinhMucComponent,
        DinhMucPhiBaoQuanComponent,
    ],
    imports: [
        CommonModule,
        DinhMucRoutingModule,
        ComponentsModule,
        MainModule,
        NzAffixModule,
        DirectivesModule
    ],
})
export class DinhMucModule { }
