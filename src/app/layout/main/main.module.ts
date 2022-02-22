import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { IndexComponent } from '../../pages/index/index.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HeaderComponent } from './header/header.component';
import { MainRouterComponent } from './main-router/main-router.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    MainComponent,
    IndexComponent,
    HeaderComponent,
    MainRouterComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ComponentsModule,
    NgApexchartsModule
  ],
  exports: [
    MainRouterComponent
  ]
})
export class MainModule { }
