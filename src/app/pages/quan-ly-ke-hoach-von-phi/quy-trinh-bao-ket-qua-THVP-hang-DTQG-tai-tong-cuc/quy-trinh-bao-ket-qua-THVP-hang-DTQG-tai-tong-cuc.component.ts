import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc',
  templateUrl: './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component.html',
  styleUrls: ['./quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component.scss'],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;

  constructor(
  ) {}

  ngOnInit(): void {
    
  }
}
