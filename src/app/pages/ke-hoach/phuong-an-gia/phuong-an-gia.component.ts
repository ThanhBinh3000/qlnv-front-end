import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {Router} from "@angular/router";

@Component({
  selector: 'app-phuong-an-gia',
  templateUrl: './phuong-an-gia.component.html',
  styleUrls: ['./phuong-an-gia.component.scss']
})
export class PhuongAnGiaComponent implements OnInit {

  constructor(
    public globals: Globals,
    public userService: UserService,
    public router: Router,
  ) { }
  tabSelected: number = 0;
  ngOnInit() {
    if (!this.userService.isAccessPermisson('KHVDTNSNN_PAGIA')) {
      this.router.navigateByUrl('/error/401')
    }
  }
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
