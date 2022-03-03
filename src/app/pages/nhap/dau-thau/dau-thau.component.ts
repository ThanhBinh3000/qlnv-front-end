import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DAU_THAU_LIST } from './dau-thau.constant';
@Component({
  selector: 'app-dau-thau',
  templateUrl: './dau-thau.component.html',
  styleUrls: ['./dau-thau.component.scss'],
})
export class DauThauComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  visible = false;
  searchValue = '';
  dauThauList = DAU_THAU_LIST;
  searchFilter = {
    soDeXuat: '',
  };
  isCreate: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  receiveMessage($event) {
    this.isCreate = $event;
    console.log(this.isCreate);
  }
  redirectToThemMoi() {
    this.router.navigate([
      '/nhap/dau-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau',
      1,
    ]);
  }
}
