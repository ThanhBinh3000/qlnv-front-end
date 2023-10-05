import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';

@Component({
  selector: 'quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongComponent implements OnInit {
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
  redirectToThemMoiPhieuKiemNghiemChatLuong() {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/',
      0,
    ]);
  }
}
