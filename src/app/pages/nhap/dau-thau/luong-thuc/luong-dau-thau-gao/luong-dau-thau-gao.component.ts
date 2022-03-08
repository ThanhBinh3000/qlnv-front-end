import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: ' ',
  templateUrl: './luong-dau-thau-gao.component.html',
  styleUrls: ['./luong-dau-thau-gao.component.scss'],
})
export class LuongDauThauGaoComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
  };
  tabSelected: string = 'phuong-an-tong-hop';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/nhap/dau-thau/luong-dau-thau-gao/thong-tin-luong-dau-thau-gao/',
      0,
    ]);
  }

  redirectSuaThongTinChiTieuKeHoachNam(id) {
    this.router.navigate([
      '/nhap/dau-thau/luong-dau-thau-gao/thong-tin-luong-dau-thau-gao/',
      id,
    ]);
  }
}
