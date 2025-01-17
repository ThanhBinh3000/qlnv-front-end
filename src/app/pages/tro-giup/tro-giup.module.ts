import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DirectivesModule } from "src/app/directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { MainModule } from "src/app/layout/main/main.module";
import { ComponentsModule } from "src/app/components/components.module";
import { TroGiupComponent } from './tro-giup.component';
import { TroGiupRoutingModule } from './tro-giup-routing.module';
import { HuongDanSuDungComponent } from './huong-dan-su-dung/huong-dan-su-dung.component';
import { GioiThieuHeThongComponent } from './gioi-thieu-he-thong/gioi-thieu-he-thong.component';

@NgModule({
    declarations: [
        TroGiupComponent, HuongDanSuDungComponent, GioiThieuHeThongComponent
    ],
    imports: [
        CommonModule,
        TroGiupRoutingModule,
        ComponentsModule,
        MainModule,
        DirectivesModule,
        NzStatisticModule,
        NzPipesModule,
    ]
})
export class TroGiupModule {
}
