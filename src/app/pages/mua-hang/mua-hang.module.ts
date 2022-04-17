import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DauThauTabComponent } from './dat-thau-tab/dau-thau-tab.component';
import { MuaHangRoutingModule } from './mua-hang-routing.module';
import { MuaHangComponent } from './mua-hang.component';
import { MuaTrucTiepTabComponent } from './mua-truc-tiep-tab/mua-truc-tiep-tab.component';


@NgModule({
    declarations: [
        MuaHangComponent,
        DauThauTabComponent,
        MuaTrucTiepTabComponent,
    ],
    imports: [CommonModule, MuaHangRoutingModule, ComponentsModule, MainModule],
})
export class MuaHangModule { }
