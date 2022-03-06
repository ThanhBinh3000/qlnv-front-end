import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'luong-dau-thau-gao',
  templateUrl: './luong-dau-thau-gao.component.html',
  styleUrls: ['./luong-dau-thau-gao.component.scss'],
})
export class LuongDauThauGaoComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
  };
  tabSelected: string = 'phuong-an-tong-hop'
  constructor(private router: Router) { }

  ngOnInit(): void { }

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/nhap/dau-thau/thong-tin-luong-dau-thau-gao/',
      0,
    ]);
  }

  redirectSuaThongTinChiTieuKeHoachNam(id) {
    this.router.navigate([
      '/nhap/dau-thau/thong-tin-luong-dau-thau-gao/',
      id,
    ]);
  }
}
