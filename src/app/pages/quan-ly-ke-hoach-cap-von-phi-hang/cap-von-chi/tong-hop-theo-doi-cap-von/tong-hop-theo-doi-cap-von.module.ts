import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopTheoDoiCapVonComponent } from './tong-hop-theo-doi-cap-von.component';
import { ThongTinTongHopTheoDoiCapVonComponent } from './thong-tin-tong-hop-theo-doi-cap-von/thong-tin-tong-hop-theo-doi-cap-von.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    TongHopTheoDoiCapVonComponent,
    ThongTinTongHopTheoDoiCapVonComponent,
  ],
  exports: [
    TongHopTheoDoiCapVonComponent,
    ThongTinTongHopTheoDoiCapVonComponent,
  ]
})
export class TongHopTheoDoiCapVonModule { }
