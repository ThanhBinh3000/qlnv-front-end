import {Component, OnInit,} from '@angular/core';
import {Globals} from "../../../shared/globals";
import {UserService} from "../../../services/user.service";
import {Subject} from "rxjs";
@Component({
  selector: 'app-tong-hop-danh-sach',
  templateUrl: './tong-hop-danh-sach.component.html',
  styleUrls: ['./tong-hop-danh-sach.component.scss']
})
export class TongHopDanhSachComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals
  ) { }
  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tabSelected = 'thamdinh'
  selectTab(tab) {
    this.tabSelected = tab;
  }


}
