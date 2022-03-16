import { DsKhoachPboGiaoDtoanChoDonViComponent } from './ds-khoach-pbo-giao-dtoan-cho-don-vi.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsKhoachPboGiaoDtoanChoDonViRoutingModule } from './ds-khoach-pbo-giao-dtoan-cho-don-vi-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DsKhoachPboGiaoDtoanChoDonViComponent,
  ],
  imports: [
    CommonModule,
    DsKhoachPboGiaoDtoanChoDonViRoutingModule,
    ComponentsModule,
  ],
})

export class DsKhoachPboGiaoDtoanChoDonViModule {}
