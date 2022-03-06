import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class DieuChinhChiTieuKeHoachNamComponent implements OnInit {
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
      '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      0,
    ]);
  }

  redirectSuaThongTinChiTieuKeHoachNam(id) {
    this.router.navigate([
      '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      id,
    ]);
  }
}
