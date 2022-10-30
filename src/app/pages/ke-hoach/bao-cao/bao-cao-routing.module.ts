import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoCaoComponent } from './bao-cao.component';

const routes: Routes = [
    {
        path: '',
        component: BaoCaoComponent,
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DatePipe],
})
export class BaoCaoRoutingModule { }
