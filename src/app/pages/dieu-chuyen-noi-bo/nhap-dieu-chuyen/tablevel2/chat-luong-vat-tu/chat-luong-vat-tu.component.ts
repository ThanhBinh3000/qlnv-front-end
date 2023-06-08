import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-luong-vat-tu',
  templateUrl: './chat-luong-vat-tu.component.html',
  styleUrls: ['./chat-luong-vat-tu.component.scss']
})
export class ChatLuongVatTuComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
