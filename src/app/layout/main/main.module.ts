import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { IndexComponent } from '../../pages/index/index.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HeaderComponent } from './header/header.component';
import { MainRouterComponent } from './main-router/main-router.component';
import { ErrorComponent } from './error/error.component';
import { NotAuthenComponent } from './error/not-authen/not-authen.component';
import { NotFoundComponent } from './error/not-found/not-found.component';

@NgModule({
  declarations: [
    MainComponent,
    IndexComponent,
    HeaderComponent,
    MainRouterComponent,
    ErrorComponent,
    NotAuthenComponent,
    NotFoundComponent,
  ],
  imports: [CommonModule, MainRoutingModule, ComponentsModule],
  exports: [MainRouterComponent],
})
export class MainModule { }
