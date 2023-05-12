import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";

@Component({
  selector: 'app-lap-bao-cao-bo-nganh',
  templateUrl: './lap-bao-cao-bo-nganh.component.html',
  styleUrls: ['./lap-bao-cao-bo-nganh.component.scss']
})
export class LapBaoCaoBoNganhComponent implements OnInit, AfterViewInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
