import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { REGION_API_TOKEN } from './types';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [BrowserAnimationsModule, HttpClientModule],
    providers: [
        {
            provide: REGION_API_TOKEN,
            useValue: environment.api,
        },
    ],
})
export class CoreModule {}
