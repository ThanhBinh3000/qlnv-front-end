import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Input() loaiVthh: string;


  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit() {
  }
  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
