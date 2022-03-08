import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';

@Component({
  selector: 'thong-tin-dau-thau',
  templateUrl: './thong-tin-dau-thau.component.html',
  styleUrls: ['./thong-tin-dau-thau.component.scss'],
})
export class ThongTinDauThauComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToChiTiet() {
    this.router.navigate(['/nhap/dau-thau/chi-tiet-thong-tin-dau-thau', 1]);
  }
}
