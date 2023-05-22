import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-luong-luong-thuc',
  templateUrl: './chat-luong-luong-thuc.component.html',
  styleUrls: ['./chat-luong-luong-thuc.component.scss']
})
export class ChatLuongLuongThucComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
