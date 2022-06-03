import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  referTab(event) {
    let loatVthh = this.router.url.split('/')[4];
    this.router.navigate(['/mua-hang/dau-thau/' + event.url + '/' + loatVthh]);
  }

  tabs = [
    {
      url: 'kehoach-luachon-nhathau',
      name: 'Kế hoạch lựa chọn nhà thầu',
    },
    {
      url: 'trienkhai-luachon-nhathau',
      name: 'Tổ chức triển khai kế hoạch lcnt',
    },
    {
      url: 'dieuchinh-luachon-nhathau',
      name: 'Điều chỉnh kế hoạch lcnt',
    }
  ];

}
