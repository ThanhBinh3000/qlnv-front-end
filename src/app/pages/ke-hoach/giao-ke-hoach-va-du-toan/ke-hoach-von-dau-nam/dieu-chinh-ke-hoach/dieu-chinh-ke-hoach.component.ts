import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dieu-chinh-ke-hoach',
  templateUrl: './dieu-chinh-ke-hoach.component.html',
  styleUrls: ['./dieu-chinh-ke-hoach.component.scss']
})
export class DieuChinhKeHoachComponent implements OnInit {
  tabSelect: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  deXuatId: number = 0;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
  }

  selectTabDieuChinh(item) {
    this.tabSelect = 1;
    this.isDetail = true;
    this.isView = item.isView;
    this.deXuatId = item.deXuatId;
  }

}
