import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bien-ban-gui-hang',
  templateUrl: './bien-ban-gui-hang.component.html',
  styleUrls: ['./bien-ban-gui-hang.component.scss']
})
export class BienBanGuiHangComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
