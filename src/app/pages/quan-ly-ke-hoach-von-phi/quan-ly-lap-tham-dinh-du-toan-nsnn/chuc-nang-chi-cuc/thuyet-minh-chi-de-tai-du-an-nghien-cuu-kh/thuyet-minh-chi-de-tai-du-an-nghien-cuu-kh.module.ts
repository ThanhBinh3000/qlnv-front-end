import { ThuyetMinhChiDeTaiDuAnNghienCuuKhComponent } from './thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThuyetMinhChiDeTaiDuAnNghienCuuKhRoutingModule } from './thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ThuyetMinhChiDeTaiDuAnNghienCuuKhComponent,
  ],
  imports: [
    CommonModule,
    ThuyetMinhChiDeTaiDuAnNghienCuuKhRoutingModule,
    ComponentsModule,
  ],
})

export class ThuyetMinhChiDeTaiDuAnNghienCuuKhModule {}
