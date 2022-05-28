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
                redirectTo: 'dau-thau',
                pathMatch: 'full',
            },
            {
                path: 'dau-thau',
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
            {
                path: 'hop-dong/:type',
                loadChildren: () =>
                    import('../mua-hang/hop-dong/hop-dong.module').then(
                        (m) => m.HopDongModule,
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
