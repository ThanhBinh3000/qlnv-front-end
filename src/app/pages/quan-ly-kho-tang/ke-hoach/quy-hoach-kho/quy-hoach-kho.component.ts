import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-quy-hoach-kho',
  templateUrl: './quy-hoach-kho.component.html',
  styleUrls: ['./quy-hoach-kho.component.scss']
})
export class QuyHoachKhoComponent implements OnInit {
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
