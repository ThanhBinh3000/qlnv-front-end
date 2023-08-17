import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {QuyHoachKhoService} from "../../../../../../services/quy-hoach-kho.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {chain} from 'lodash';
import {StorageService} from "../../../../../../services/storage.service";
import {
  ThemSoKhoTheKhoComponent
} from "../../../../../luu-kho/quan-ly-so-the-kho/so-kho-the-kho/them-so-kho-the-kho/them-so-kho-the-kho.component";
import {
  PopUpChiTietQuyHoachKhoComponent
} from "../pop-up-chi-tiet-quy-hoach-kho/pop-up-chi-tiet-quy-hoach-kho.component";
import {NumberToRoman} from "../../../../../../shared/commonFunction";


@Component({
  selector: 'app-them-moi-qd',
  templateUrl: './them-moi-qd.component.html',
  styleUrls: ['./them-moi-qd.component.scss']
})
export class ThemMoiQdComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  @Input() type: string;
  maQd: string;
  talbePhuLucI: any[] = [];
  talbePhuLucII: any[] = [];
  talbePhuLucIView: any[] = [];
  talbePhuLucIIView: any[] = [];

  constructor(
    httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyHoachKhoService: QuyHoachKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyHoachKhoService);
    this.formData = this.fb.group({
      id: [null],
      namKeHoach: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soQuyetDinh: [null, [Validators.required]],
      soQdBtc: [null, [Validators.required]],
      trichYeu: [null],
      ngayKy: [null, [Validators.required]],
      namBatDau: [null, [Validators.required]],
      namKetThuc: [null, [Validators.required]],
      moTa: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/QĐ-BTC';
    this.getDataDetail(this.idInput);
    this.spinner.hide();
  }

  async getDataDetail(id) {

  }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userService.isCuc() ? this.userInfo.MA_DVI : this.formData.value.maDvi;
    body.soCongVan = body.soCongVan ? body.soCongVan + this.maQd : this.maQd;
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.createUpdate(body);
  }

  openModalCreate(idx: number, type: string) {
    const modalCreate = this.modal.create({
      nzTitle: 'BẢNG TỔNG HỢP CÁC ĐIỂM KHO LƯƠNG THỰC, VẬT TƯ QUY HOẠCH',
      nzContent: PopUpChiTietQuyHoachKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzBodyStyle: {'overflow-y': 'auto'},
      nzStyle: {top: '100px'},
      nzWidth: '1000px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalCreate.afterClose.subscribe((data) => {
      if (data) {
        console.log(data,22222)
        if (idx) {
          if (type == '00') {
            this.talbePhuLucI[idx] = data
          }
          if (type == '01') {
            this.talbePhuLucII[idx] = data
          }
        } else {
            if (type == '00') {
              this.talbePhuLucI = [...this.talbePhuLucI, data]
            }
            if (type == '01') {
              this.talbePhuLucII = [...this.talbePhuLucII, data]
            }
        }
        this.convertTreView(type)
      }
    })
  };

  convertTreView(type: string) {
    if (type == '00') {
      this.talbePhuLucIView = chain(this.talbePhuLucI)
        .groupBy("vungMien")
        .map((value, key) => {
          return {
            tenVungMien: key,
            children: value
          };
        }).value();
      console.log(this.talbePhuLucIView,123)
    }
    if (type == '01') {
      this.talbePhuLucIIView = chain(this.talbePhuLucII)
        .groupBy("vungMien")
        .map((value, key) => {
          return {
            tenVungMien: key,
            children: value
          };
        }).value();
    }
  }
}
