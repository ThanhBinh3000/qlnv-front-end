import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class ChiTieuKeHoachNamComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
  };
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { }

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      0,
    ]);
  }

  redirectSuaThongTinChiTieuKeHoachNam(id) {
    this.router.navigate([
      '/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      id,
    ]);
  }
}
