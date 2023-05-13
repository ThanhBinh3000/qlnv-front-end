import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { BaoCaoBoNganhComponent } from "./bao-cao-bo-nganh.component";

const routes: Routes = [{
  path: '',
  component: BaoCaoBoNganhComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'lap-bao-cao-bo-nganh',
      pathMatch: 'full'
    },
    {
      path: 'lap-bao-cao-bo-nganh',
      loadChildren: () =>
        import('./lap-bao-cao-bo-nganh/lap-bao-cao-bo-nganh.module').then((m) => m.LapBaoCaoBoNganhModule),
      canActivate: [AuthGuard],
    },
    // {
    //   path: 'bao-cao-chat-luong-hang-dtqg',
    //   loadChildren: () =>
    //     import('./bao-cao-chat-luong-hang-dtqg/bao-cao-chat-luong-hang-dtqg.module').then((m) => m.BaoCaoChatLuongHangDtqgModule),
    //   canActivate: [AuthGuard],
    // },
  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaoCaoBoNganhRoutingModule {
}
