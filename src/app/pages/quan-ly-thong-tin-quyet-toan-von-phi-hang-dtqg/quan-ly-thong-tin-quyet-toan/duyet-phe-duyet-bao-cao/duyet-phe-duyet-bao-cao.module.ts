import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DuyetPheDuyetBaoCaoComponent } from './duyet-phe-duyet-bao-cao.component';
import { DuyetPheDuyetBaoCaoRoutingModule } from './duyet-phe-duyet-bao-cao-routing.module';

@NgModule({
  declarations: [
    DuyetPheDuyetBaoCaoComponent,
  ],
  imports: [
    CommonModule,
    DuyetPheDuyetBaoCaoRoutingModule,
    ComponentsModule,
  ],
})

export class DuyetPheDuyetBaoCaoModule {}
