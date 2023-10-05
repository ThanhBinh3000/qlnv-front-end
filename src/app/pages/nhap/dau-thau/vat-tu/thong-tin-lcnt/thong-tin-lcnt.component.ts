import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'thong-tin-lcnt',
  templateUrl: './thong-tin-lcnt.component.html',
  styleUrls: ['./thong-tin-lcnt.component.scss'],
})
export class ThongTinLCNTComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  redirectToChiTiet() {
    this.router.navigate(['/nhap/dau-thau/vat-tu/thong-tin-lcnt/chi-tiet-thong-tin-lcnt', 1]);
  }
}
