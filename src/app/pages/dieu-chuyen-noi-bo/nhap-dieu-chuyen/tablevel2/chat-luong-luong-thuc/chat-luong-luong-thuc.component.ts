import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-chat-luong-luong-thuc',
  templateUrl: './chat-luong-luong-thuc.component.html',
  styleUrls: ['./chat-luong-luong-thuc.component.scss']
})
export class ChatLuongLuongThucComponent extends Base2Component implements OnInit {

  @Input() loaiDc: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      ngayDuyetTc: null,
      ngayHieuLuc: null,
      loaiDc: null,
      trichYeu: null,
    })
    this.filterTable = {
      nam: '',
      soQdinh: '',
      ngayLapKh: '',
      ngayDuyetTcTu: '',
      loaiDc: '',
      trichYeu: '',
      tenDvi: '',
      tenTrangThai: '',
    };
  }

  tabSelected: number = 0;

  ngOnInit(): void {
    console.log('ChatLuongLuongThucComponent', this.loaiDc)
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
