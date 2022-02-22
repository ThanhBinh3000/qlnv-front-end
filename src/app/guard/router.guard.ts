import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { NhomQuyenService } from '../services/nhomquyen.service';
import { ObservableService } from '../services/observable.service';

@Injectable({
  providedIn: 'root',
})
export class RouterGuard implements CanActivate {
  lstRouter = [];
  constructor(
    private nhomQuyenService: NhomQuyenService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
    //   return new Promise(res => {
    //     this.nhomQuyenService.layTatCaChucNangUser().then(
    //         (rs) => {
    //             if (rs.success) {
    //               this.lstRouter = rs.data;
    //               const router = state.url;
    //               if (this.lstRouter.includes(router) || router === "/index") {
    //                 res(true);
    //               }
    //               else {
    //                 this.router.navigate(['/index']);
    //                 res(false);
    //               }
    //             } else {
    //               this.router.navigate(['/']);
    //               res(false);
    //             }
    //         }
    //     );
    // });
  }
}
