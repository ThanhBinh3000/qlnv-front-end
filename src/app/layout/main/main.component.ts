import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Cleave from 'cleave.js';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ObservableService } from 'src/app/services/observable.service';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  userInfo: UserLogin;
  constructor(
    private authService: AuthService,
    private router: Router,
    private observableService: ObservableService,
    private userService: UserService,
    private donviService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event) {
          const datesCollection = <HTMLCollection>(
            document.getElementsByClassName('input-date')
          );
          let dates = Array.from(datesCollection);

          dates.forEach(function (date) {
            new Cleave(date, {
              date: true,
              delimiter: '/',
              datePattern: ['d', 'm', 'Y'],
            });
          });
        }
      });
  }

  ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
  }

  logOut() {
    this.authService.logout();
  }
}
