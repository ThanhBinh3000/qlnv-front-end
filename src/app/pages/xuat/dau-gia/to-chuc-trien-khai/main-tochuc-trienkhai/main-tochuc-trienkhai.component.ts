import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from "../../../../../services/user.service";

@Component({
  selector: 'app-main-tochuc-trienkhai',
  templateUrl: './main-tochuc-trienkhai.component.html',
  styleUrls: ['./main-tochuc-trienkhai.component.scss']
})
export class MainTochucTrienkhaiComponent implements OnInit {
  @Input() inputLoaiVthh: string;
  @Input()
  listVthh: any[] = [];
  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
