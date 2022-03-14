import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dau-thau',
  templateUrl: './dau-thau.component.html',
  styleUrls: ['./dau-thau.component.scss'],
})
export class DauThauComponent implements OnInit {
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
