import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThocGaoMuoiComponent } from './thoc-gao-muoi.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { GiaCuTheModule } from './gia-cu-the/gia-cu-the.module';
import { MuaToiDaBanToiThieuModule } from './mua-toi-da-ban-toi-thieu/mua-toi-da-ban-toi-thieu.module';

@NgModule({
  declarations: [ThocGaoMuoiComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    GiaCuTheModule,
    MuaToiDaBanToiThieuModule,
  ],
  exports: [
    ThocGaoMuoiComponent,
  ]
})
export class ThocGaoMuoiModule { }
