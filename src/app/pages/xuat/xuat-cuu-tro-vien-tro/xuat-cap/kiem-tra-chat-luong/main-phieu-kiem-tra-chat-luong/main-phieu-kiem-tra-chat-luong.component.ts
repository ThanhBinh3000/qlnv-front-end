import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-main-phieu-kiem-tra-chat-luong',
  templateUrl: './main-phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./main-phieu-kiem-tra-chat-luong.component.scss']
})
export class MainPhieuKiemTraChatLuongComponent implements OnInit {
  @Input() loaiVthh: string;


  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit() {
    console.log(this.loaiVthh);
  }
  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
