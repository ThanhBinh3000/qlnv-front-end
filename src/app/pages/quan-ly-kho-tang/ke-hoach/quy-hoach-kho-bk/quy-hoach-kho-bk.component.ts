import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-quy-hoach-kho-bk',
  templateUrl: './quy-hoach-kho-bk.component.html',
  styleUrls: ['./quy-hoach-kho-bk.component.scss']
})
export class QuyHoachKhoBkComponent implements OnInit {
  tabSelected: string = "qdqh";
  constructor(
    public userService : UserService,
    private router  :Router
  ) { }
  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_QHK')) {
      this.router.navigateByUrl('/error/401')
    }
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
