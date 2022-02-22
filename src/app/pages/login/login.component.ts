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
declare var vgcapluginObject: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private apiService: ApiService,
    private authService: AuthService,
    public router: Router,
  ) {}

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
        UserName: form.UserName,
        Password: form.Password,
      };
      this.apiService.login(user).subscribe((res: OldResponseData) => {
        if (res.success) {
          this.authService.saveToken(res.data.token);
          this.router.navigate(['/']);
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
        this.spinner.hide();
      });
    } catch (err) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
