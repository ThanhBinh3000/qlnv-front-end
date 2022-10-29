import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BAO_CAO_KET_QUA } from './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.constant';
import { BaoCaoComponent } from './bao-cao.component';

const routes: Routes = [
    {
        path: '',
        component: BaoCaoComponent,
    },
    //////////// bao cao ket qua thuc hien von phi hang dtqg
    {
        path: BAO_CAO_KET_QUA + '/bao-cao/:id',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/nhom-chuc-nang-chi-cuc/bao-cao/bao-cao.module'
            ).then((m) => m.BaoCaoModule),
    },
    {
        path: BAO_CAO_KET_QUA + '/:baoCao/:loaiBaoCao/:dot/:nam',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/nhom-chuc-nang-chi-cuc/bao-cao/bao-cao.module'
            ).then((m) => m.BaoCaoModule),
    },
    {
        path: BAO_CAO_KET_QUA + '/tim-kiem',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/nhom-chuc-nang-chi-cuc/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.module'
            ).then((m) => m.TimKiemBaoCaoThucHienVonPhiHangDTQGModule),
    },
    {
        path: BAO_CAO_KET_QUA + '/ds-bao-cao-ket-qua-von-phi-hang-tu-dvi-cap-duoi',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/nhom-chuc-nang-khu-vuc/duyet-bao-cao-thuc-hien-von-phi/duyet-bao-cao-thuc-hien-von-phi.module'
            ).then((m) => m.DuyetBaoCaoThucHienVonPhiModule),
    },
    {
        path: BAO_CAO_KET_QUA + '/kiem-tra',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/nhom-chuc-nang-khu-vuc/tong-hop-bao-cao/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.module'
            ).then((m) => m.KiemTraTinhTrangPheDuyetBaoCaoTuChiCucModule),
    },
    {
        path: BAO_CAO_KET_QUA + '/tong-hop',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/nhom-chuc-nang-khu-vuc/tong-hop-bao-cao/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.module'
            ).then((m) => m.TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGModule),
    },
    {
        path: BAO_CAO_KET_QUA + '/khai-thac-bao-cao',
        loadChildren: () =>
            import(
                './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/khai-thac-bao-cao/khai-thac-bao-cao.module'
            ).then((m) => m.KhaiThacBaoCaoModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DatePipe],
})
export class BaoCaoRoutingModule { }
