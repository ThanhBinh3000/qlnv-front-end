import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../../services/user.service";
import {Globals} from "../../../../../shared/globals";

@Component({
  selector: 'app-kiem-tra-chat-luong-menu',
  templateUrl: './kiem-tra-chat-luong-menu.component.html',
  styleUrls: ['./kiem-tra-chat-luong-menu.component.scss']
})
export class KiemTraChatLuongMenuComponent implements OnInit {
  @Input() typeVthh: string;
  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit(): void {
    this.tabSelected = this.typeVthh.startsWith('02') ? 4 : 0;
  }
  tabSelected: number = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
