import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'chi-tiet-thong-tin-goi-thau',
  templateUrl: './chi-tiet-thong-tin-goi-thau.component.html',
  styleUrls: ['./chi-tiet-thong-tin-goi-thau.component.scss'],
})
export class ChiTietThongTinGoiThauComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.formData = this.fb.group({});
  }

  redirectToTTDT() {
    this.router.navigate(['/nhap/dau-thau/vat-tu/thong-tin-lcnt/chi-tiet-thong-tin-lcnt/', 0]);
  }
}
