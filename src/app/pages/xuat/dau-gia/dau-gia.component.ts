import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DAU_GIA_LIST } from './dau-gia.constant';

@Component({
  selector: 'app-dau-gia',
  templateUrl: './dau-gia.component.html',
  styleUrls: ['./dau-gia.component.scss'],
})
export class DauGiaComponent implements OnInit {
  searchValue = '';
  dauThauList = DAU_GIA_LIST;

  // search
  searchFilter = {
    soQD: '',
  };
  // modal
  isVisible = false;
  isVisible2 = false;

  constructor(
  ) { }

  ngOnInit(): void { }

  // modal func
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  //
  // modal func
  showModal2(): void {
    this.isVisible2 = true;
  }

  handleOk2(): void {
    this.isVisible2 = false;
  }

  handleCancel2(isVisible): void {
    this.isVisible2 = isVisible;
  }
}
