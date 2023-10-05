import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from "../../../../../services/user.service";

@Component({
  selector: 'app-main-tochuc-trienkhi-bantructiep',
  templateUrl: './main-tochuc-trienkhi-bantructiep.component.html',
  styleUrls: ['./main-tochuc-trienkhi-bantructiep.component.scss']
})
export class MainTochucTrienkhiBantructiepComponent implements OnInit {
  @Input() inputLoaiVthh: string;
  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
