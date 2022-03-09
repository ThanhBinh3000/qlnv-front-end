import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SokiemtratranchiNSNNcuacacdonviRoutingModule } from './sokiemtratranchiNSNNcuacacdonvi-routing.module';
import { SokiemtratranchiNSNNcuacacdonviComponent } from './sokiemtratranchiNSNNcuacacdonvi.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [SokiemtratranchiNSNNcuacacdonviComponent],
  imports: [CommonModule, SokiemtratranchiNSNNcuacacdonviRoutingModule, ComponentsModule],
})
export class SokiemtratranchiNSNNcuacacdonviModule {}
