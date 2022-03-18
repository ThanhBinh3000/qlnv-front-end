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
  selector: 'quan-ly-phieu-kiem-tra-chat-luong-hang',
  templateUrl: './quan-ly-phieu-kiem-tra-chat-luong-hang.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-tra-chat-luong-hang.component.scss'],
})
export class QuanLyPhieuKiemTraChatLuongHangComponent implements OnInit {
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

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  redirectToThemMoi() {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/',
      0,
    ]);
  }
}
