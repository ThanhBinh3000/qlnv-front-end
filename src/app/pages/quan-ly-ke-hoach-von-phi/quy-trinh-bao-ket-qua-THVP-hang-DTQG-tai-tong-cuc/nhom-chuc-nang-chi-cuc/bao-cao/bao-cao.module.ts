import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoComponent } from './bao-cao.component';import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCao05Component } from './bao-cao-05/bao-cao-05.component';
import { BaoCao04bComponent } from './bao-cao-04b/bao-cao-04b.component';
import { BaoCao04anComponent } from './bao-cao-04an/bao-cao-04an.component';
import { BaoCao04axComponent } from './bao-cao-04ax/bao-cao-04ax.component';
import { BaoCao03Component } from './bao-cao-03/bao-cao-03.component';
import { BaoCao02Component } from './bao-cao-02/bao-cao-02.component';

@NgModule({
  declarations: [BaoCaoComponent, BaoCao05Component, BaoCao04bComponent, BaoCao04anComponent, BaoCao04axComponent,BaoCao03Component,BaoCao02Component],
  imports: [CommonModule, BaoCaoRoutingModule, ComponentsModule],
})
export class BaoCaoModule {}
