import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-kehoach-luachon-muatructiep',
  templateUrl: './main-kehoach-luachon-muatructiep.component.html',
})
export class MainKehoachLuachonMuatructiepComponent implements OnInit {

  @Input() loaiVthh: string;
  @Input() tyVthh: any[] = [];

  constructor(public userService: UserService) { }

  ngOnInit(): void {

  }

  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
