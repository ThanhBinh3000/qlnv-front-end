import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';

@Component({
  selector: 'chi-tiet-thong-tin-dau-thau',
  templateUrl: './chi-tiet-thong-tin-dau-thau.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-thau.component.scss'],
})
export class ChiTietThongTinDauThauComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToTTDT() {
    this.router.navigate(['/nhap/dau-thau/thong-tin-dau-thau']);
  }
}
