import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LapThamDinhComponent } from './lap-tham-dinh.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { RouterModule } from '@angular/router';

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
