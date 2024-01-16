import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

import { CommonInterceptor } from './interceptor/common.interceptor';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NZ_I18N, NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { ObservableService } from './services/observable.service';
import { DirectivesModule } from './directives/directives.module';
import { Globals } from './shared/globals';
import { vi as viDateFs } from 'date-fns/locale';
registerLocaleData(vi);

const ngZorroConfig: NzConfig = {
  notification: { nzMaxStack: 1 },
  modal: { nzMaskClosable: false },
};

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    DirectivesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: CommonInterceptor,
    },
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    ObservableService,
    Globals,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private i18n: NzI18nService
  ) {
    this.i18n.setDateLocale(viDateFs)
  }
}
