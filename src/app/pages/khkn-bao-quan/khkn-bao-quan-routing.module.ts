import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KhknBaoQuanComponent } from './khkn-bao-quan.component';

const routes: Routes = [
    {
        path: '',
        component: KhknBaoQuanComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KhknBaoQuanRoutingModule { }
