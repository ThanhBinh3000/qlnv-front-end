import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VonPhiHangDuTruQuocGiaComponent } from './von-phi-hang-du-tru-quoc-gia.component';

const routes: Routes = [
    {
        path: '',
        component: VonPhiHangDuTruQuocGiaComponent,
        children: [
            {
                path: '',
                redirectTo: 'von-phi-hang-du-tru-quoc-gia',
                pathMatch: 'full',
            },
            {
                path: 'bao-cao-quyet-toan',
                loadChildren: () =>
                    import(
                        './bao-cao-quyet-toan/bao-cao-quyet-toan.module'
                    ).then((m) => m.BaoCaoQuyetToanModule),
            },
            {
                path: 'dieu-chinh-so-lieu-quyet-toan',
                loadChildren: () =>
                    import(
                        './dieu-chinh-bao-cao-sau-quyet-toan/dieu-chinh-bao-cao-sau-quyet-toan.module'
                    ).then((m) => m.DieuChinhBaoCaoSauQuyetToanModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VonPhiHangDuTruQuocGiaRoutingModule { }
