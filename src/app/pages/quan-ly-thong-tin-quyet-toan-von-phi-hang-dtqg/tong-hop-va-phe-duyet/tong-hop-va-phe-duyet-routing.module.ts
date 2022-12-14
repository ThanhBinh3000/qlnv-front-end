import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopVaPheDuyetComponent } from './tong-hop-va-phe-duyet.component';

const routes: Routes = [
    {
        path: '',
        component: TongHopVaPheDuyetComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TongHopVaPheDuyetRoutingModule { }
