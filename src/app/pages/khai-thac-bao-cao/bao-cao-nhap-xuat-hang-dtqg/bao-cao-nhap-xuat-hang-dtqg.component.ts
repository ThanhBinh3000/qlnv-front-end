import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";

@Component({
  selector: 'app-bao-cao-nhap-xuat-hang-dtqg',
  templateUrl: './bao-cao-nhap-xuat-hang-dtqg.component.html',
  styleUrls: ['./bao-cao-nhap-xuat-hang-dtqg.component.scss']
})
export class BaoCaoNhapXuatHangDtqgComponent implements OnInit, AfterViewInit{
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
