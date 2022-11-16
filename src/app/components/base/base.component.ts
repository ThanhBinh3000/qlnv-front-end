import { Component, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { UserLogin } from "../../models/userlogin";
import { UserService } from "../../services/user.service";
import { STATUS } from "../../constants/status";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  listNam: any[] = [];
  userInfo: UserLogin;
  STATUS = STATUS
  formData: FormGroup
  constructor(
  ) { }

  ngOnInit(): void {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

}
