import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';


@Component({
  selector: 'app-danh-muc-don-vi',
  templateUrl: './danh-muc-don-vi.component.html',
  styleUrls: ['./danh-muc-don-vi.component.scss'],
})
export class DanhMucDonViComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
    maDonVi : ''
  };
  nodes: any = [];
  nodeSelected: any = []
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  async search() {
    console.log("avb");
  }

  clearFilter(){
    
  }

  nzCheck(event: NzFormatEmitEvent): void {
    // this.nodeSelected = event.keys[0];
    // this.selectedKeys = event.node.origin.data;
    // this.showDetailDonVi()
  }

  layTatCaDonViTheoTree() {
    
  }
  parentNodeSelected: any = [];
  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.keys[0];
      // this.selectedKeys = event.node.origin.data;
      this.parentNodeSelected = event?.parentNode?.origin
      // this.showDetailDonVi(event.keys[0])
    }

  }

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
