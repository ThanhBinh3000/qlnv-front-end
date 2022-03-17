import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'quan-ly-phieu-nhap-kho',
  templateUrl: './quan-ly-phieu-nhap-kho.component.html',
  styleUrls: ['./quan-ly-phieu-nhap-kho.component.scss'],
})
export class QuanLyPhieuNhapKhoComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
  ) {}

  async ngOnInit() {}
  redirectToThemMoiPhieuNhapkho() {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/',
      0,
    ]);
  }
}
