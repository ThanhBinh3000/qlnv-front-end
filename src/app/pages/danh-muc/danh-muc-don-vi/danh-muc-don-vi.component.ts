import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';

@Component({
  selector: 'app-danh-muc-don-vi',
  templateUrl: './danh-muc-don-vi.component.html',
  styleUrls: ['./danh-muc-don-vi.component.scss'],
})
export class DanhMucDonViComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
  };
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { }

  redirectThongTinDanhMucDonVi() {
    this.router.navigate([
      '/kehoach/thong-tin-danh-muc-don-vi',
      0,
    ]);
  }

  redirectSuaThongTinDanhMucDonVi(id) {
    this.router.navigate([
      '/kehoach/thong-tin-danh-muc-don-vi',
      id,
    ]);
  }
}
