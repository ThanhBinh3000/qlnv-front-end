import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { LapThamDinhComponent } from './lap-tham-dinh.component';

@NgModule({
    declarations: [
        LapThamDinhComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        RouterModule,
    ],
    exports: [
        LapThamDinhComponent,
    ]
})
export class LapThamDinhModule { }
