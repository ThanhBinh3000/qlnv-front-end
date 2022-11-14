import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bien-ban-lay-ban-giao-mau',
  templateUrl: './bien-ban-lay-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-ban-giao-mau.component.scss']
})
export class BienBanLayBanGiaoMauComponent implements OnInit {
  @Input() typeVthh: string;
  constructor() { }

  ngOnInit(): void {
  }

}
