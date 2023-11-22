import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-main-ke-hoach-ban-truc-tiep',
  templateUrl: './main-ke-hoach-ban-truc-tiep.component.html',
  styleUrls: ['./main-ke-hoach-ban-truc-tiep.component.scss']
})
export class MainKeHoachBanTrucTiepComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() inputLoaiVthh: string;
  @Input() idInput: number;
  @Input()
  listVthh: any[] = [];
  @Output()
  showListEvent = new EventEmitter<any>();

  constructor(
    public userService: UserService
  ) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
