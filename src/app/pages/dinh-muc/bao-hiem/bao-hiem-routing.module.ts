import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoHiemComponent } from './bao-hiem.component';

const routes: Routes = [
    {
        path: '',
        component: BaoHiemComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BaoHiemRoutingModule { }
