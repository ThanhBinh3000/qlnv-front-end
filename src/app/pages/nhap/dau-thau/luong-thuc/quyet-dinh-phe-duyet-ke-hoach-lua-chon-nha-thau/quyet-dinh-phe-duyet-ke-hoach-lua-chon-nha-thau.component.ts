import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau',
  templateUrl: './quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component.scss'],
})
export class QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
  };
  tabSelected: string = 'phuong-an-phe-duyet';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  redirectChiTiet(id: number) {
    this.router.navigate([
      '/nhap/dau-thau/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/',
      id,
    ]);
  }
}
