import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuaHangComponent } from './mua-hang.component';

const routes: Routes = [
    {
        path: '',
        component: MuaHangComponent,
        children: [
            {
                path: '',
                redirectTo: 'theo-phuong-thuc-dau-thau',
                pathMatch: 'full',
            },
            {
                path: 'theo-phuong-thuc-dau-thau',
                loadChildren: () =>
                    import('../mua-hang/dau-thau/dau-thau.module').then(
                        (m) => m.DauThauModule,
                    ),
            },
            {
                path: 'mua-truc-tiep',
                loadChildren: () =>
                    import('../mua-hang/mua-truc-tiep/mua-truc-tiep.module').then(
                        (m) => m.MuaTrucTiepModule,
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MuaHangRoutingModule { }
