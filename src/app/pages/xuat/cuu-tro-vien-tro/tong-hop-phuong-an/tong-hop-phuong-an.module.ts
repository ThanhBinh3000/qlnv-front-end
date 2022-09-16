import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopPhuongAnComponent } from './tong-hop-phuong-an.component';
import { ThongTinTongHopPhuongAnComponent } from './thong-tin-tong-hop-phuong-an/thong-tin-tong-hop-phuong-an.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    TongHopPhuongAnComponent,
    ThongTinTongHopPhuongAnComponent,
  ],
  exports: [
    TongHopPhuongAnComponent,
  ]
})
export class TongHopPhuongAnModule { }
