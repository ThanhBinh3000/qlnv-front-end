import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAPIService } from 'src/app/services/user/userApi.service';
import { StorageService } from 'src/app/services/storage.service';
import { STORAGE_KEY } from 'src/app/constants/config';
import { LIST_PAGES } from '../../layout/main/main-routing.constant';

declare var vgcapluginObject: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  lstPage = [];

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private apiService: ApiService,
    private authService: AuthService,
    private userAPIService: UserAPIService,
    public router: Router,
    private storageService: StorageService,
  ) {
    this.lstPage = LIST_PAGES;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formLogin = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      rememberMe: [''],
    });
  }

  login(form) {
    this.helperService.markFormGroupTouched(this.formLogin);
    if (this.formLogin.invalid) {
      return;
    }

    this.spinner.show();
    try {
      const user = {
        username: form.UserName,
        password: form.Password,
      };
      let allRoles = '';
      this.apiService.login(user).subscribe(async (res: OldResponseData) => {
        if (res.data) {
          this.authService.saveToken(res.data.token);
          let jsonData = '';
          let permission = await this.userAPIService.getPermission();
          let dvql = await this.userAPIService.getDvql();
          if (permission.msg == MESSAGE.SUCCESS) {
            let data = permission.data;
            if (data && data.length > 0) {
              jsonData = JSON.stringify(data);
              allRoles = jsonData;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, permission.msg);
          }
          if (dvql.msg == MESSAGE.SUCCESS) {
            this.storageService.set(STORAGE_KEY.DVQL, dvql.data);
          } else {
            this.notification.error(MESSAGE.ERROR, permission.msg);
          }
          this.storageService.set(STORAGE_KEY.PERMISSION, jsonData);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        if (allRoles) {
          this.router.navigate([this.setDefultModule(allRoles)]);
        } else {
          this.notification.warning(MESSAGE.WARNING, 'Không có quyền truy cập.');
          return;
        }
        this.spinner.hide();
      });
    } catch (err) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  setDefultModule(jsonData) {
    let url = '';
    jsonData = JSON.parse(jsonData);
    for (let item of this.lstPage) {
      if (!item.code || jsonData.includes(item.code)) {
        url = item.route;
        if (url) {
          break;
        }
      }
    }
    return url;
  }

}
