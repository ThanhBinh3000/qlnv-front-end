import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DonviService} from 'src/app/services/donvi.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service'
import {Validators} from '@angular/forms';
import {QuanLySoKhoTheKhoService} from 'src/app/services/quan-ly-so-kho-the-kho.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NgxSpinnerService} from "ngx-spinner";
import {Base2Component} from "../../../../../components/base2/base2.component";
import dayjs from "dayjs";

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
// @ts-ignore
export class ThemSoKhoTheKhoComponent extends Base2Component implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();
  @Input() idInput: number;
  @Input() isView: any;
  listType = [{"ma": "00", "giaTri": "Sổ kho"}, {"ma": "01", "giaTri": "Thẻ kho"}];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private dmService: DanhMucService,
    private donviService: DonviService,
    private _modalRef: NzModalRef
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLySoKhoTheKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year')],
      nguoiLap: [null],
      maDvi: [null],
      tenDvi: [null],
      keToanTruong: [null],
      thuTruong: [null],
      maDiemKho: [null],
      maNhaKho: [null],
      maNganKho: [null],
      maLoKho: [null],
      tenHangHoa: [null],
      ten: [null],
      ngayMo: [null],
      ngayDong: [null],
      isDongSo: [false],
      ngayTaoTu: [null],
      ngayTaoDen: [false],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loai: ['00']
    });
  }

  async ngOnInit() {
    try {

    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  tuChoi() {

  }

  pheDuyet() {

  }

  save(isGuiDuyet: boolean) {

  }

  quayLai() {
    this._modalRef.close();
  }
}
