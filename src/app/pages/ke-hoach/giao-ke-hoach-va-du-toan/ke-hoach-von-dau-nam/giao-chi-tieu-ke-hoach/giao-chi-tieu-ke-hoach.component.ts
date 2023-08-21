import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-giao-chi-tieu-ke-hoach',
  templateUrl: './giao-chi-tieu-ke-hoach.component.html',
  styleUrls: ['./giao-chi-tieu-ke-hoach.component.scss']
})
export class GiaoChiTieuKeHoachComponent implements OnInit {
  tabSelected = 'PA';

  constructor(
    public userService: UserService,
  ) {
  }

  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }
}
