import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from '../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
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
  selector: 'them-moi-phieu-nhap-day-kho',
  templateUrl: './them-moi-phieu-nhap-day-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-day-kho.component.scss'],
})
export class ThemMoiPhieuNhapDayKhoComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
  ) {}

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
      }
    });
  }
  back() {
    this.router.navigate(['nhap/dau-thau/quan-ly-phieu-nhap-day-kho']);
  }
}
