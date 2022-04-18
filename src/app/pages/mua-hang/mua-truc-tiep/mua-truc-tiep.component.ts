import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-mua-truc-tiep',
  templateUrl: './mua-truc-tiep.component.html',
  styleUrls: ['./mua-truc-tiep.component.scss'],
})
export class MuaTrucTiepComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
}
