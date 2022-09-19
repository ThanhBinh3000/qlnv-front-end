import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { BanHangComponent } from './ban-hang.component';

const routes: Routes = [
    {
        path: '',
        component: BanHangComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'theo-phuong-thuc-ban-dau-gia',
                pathMatch: 'full',
            },
            {
                path: 'theo-phuong-thuc-ban-dau-gia',
                loadChildren: () =>
                    import('../ban-hang/dau-gia/dau-gia.module').then(
                        (m) => m.DauGiaModule,
                    ),
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BanHangRoutingModule { }
