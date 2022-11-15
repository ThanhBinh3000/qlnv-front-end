import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phieu-kiem-nghiem-chat-luong',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class PhieuKiemNghiemChatLuongComponent implements OnInit {
  @Input() typeVthh: string;
  constructor() { }

  ngOnInit(): void {
  }

}
