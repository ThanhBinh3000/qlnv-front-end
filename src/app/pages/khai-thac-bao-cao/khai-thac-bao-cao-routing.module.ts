import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { KhaiThacBaoCaoComponent } from "./khai-thac-bao-cao.component";
import { BaoCaoTheoTtqdComponent } from "./bao-cao-theo-ttqd/bao-cao-theo-ttqd.component";

const routes: Routes = [{
  path: '',
  component: KhaiThacBaoCaoComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'bao-cao-theo-ttqd',
      pathMatch: 'full'
    },
    {
      path: '/bao-cao-chat-luong-hang-dtqg',
      redirectTo: 'bao-cao-chat-luong-hang-dtqg',
      canActivate: [AuthGuard],
    },
    /*
    {
      path: 'bao-cao-theo-ttqd',
      component: BaoCaoTheoTtqdComponent,
      canActivate: [AuthGuard],
    },*/
    {
      path: 'bao-cao-theo-ttqd',
      loadChildren: () =>
        import('./bao-cao-theo-ttqd/bao-cao-theo-ttqd.module').then((m) => m.BaoCaoTheoTtqdModule),
    },
    {
      path: 'bao-cao-chat-luong-hang-dtqg',
      loadChildren: () =>
        import('./bao-cao-chat-luong-hang-dtqg/bao-cao-chat-luong-hang-dtqg.module').then((m) => m.BaoCaoChatLuongHangDtqgModule),
    },
  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhaiThacBaoCaoRoutingModule {
}
