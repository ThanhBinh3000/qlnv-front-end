import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinMuaTrucTiepTCComponent } from './thong-tin-mua-truc-tiep-tc.component';
import { ThongTinMuaTrucTiepTCRoutingModule } from './thong-tin-mua-truc-tiep-tc-routing.module';

@NgModule({
  declarations: [ThongTinMuaTrucTiepTCComponent],
  imports: [CommonModule, ThongTinMuaTrucTiepTCRoutingModule, ComponentsModule],
})
export class ThongTinMuaTrucTiepTCModule {}
