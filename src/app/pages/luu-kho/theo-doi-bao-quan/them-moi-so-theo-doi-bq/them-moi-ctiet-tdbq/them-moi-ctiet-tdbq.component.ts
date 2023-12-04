import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {TongHopScService} from "../../../../../services/sua-chua/tongHopSc.service";
import {LOAI_HANG_DTQG} from "../../../../../constants/config";
import {TheoDoiBqService} from "../../../../../services/luu-kho/theo-doi-bq.service";
import {TheoDoiBqDtlService} from "../../../../../services/luu-kho/theoDoiBqDtl.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../../constants/message";
import {AMOUNT} from "../../../../../Utility/utils";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-them-moi-ctiet-tdbq',
  templateUrl: './them-moi-ctiet-tdbq.component.html',
  styleUrls: ['./them-moi-ctiet-tdbq.component.scss']
})
export class ThemMoiCtietTdbqComponent extends Base3Component implements OnInit {

  rowItem: ChiSoChatLuong = new ChiSoChatLuong();
  listBpxl: any[] = [];
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  dataHdr: any;
  isXacNhan: boolean = false;
  dataTk: any;
  dataKtv: any;
  dataLdcc: any;
  thoiGianConLaiBh: any;
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqDtlService: TheoDoiBqDtlService,
    private danhMucService: DanhMucService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqDtlService);
    this.formData = this.fb.group({
      id: [null,],
      idHdr: [null, [Validators.required]],
      idNguoiKtra: [null],
      tenNguoiKtra: [null, [Validators.required]],
      ngayKtra: [null, [Validators.required]],
      loaiVthh: [null, [Validators.required]],
      tenLoaiVthh: [null, [Validators.required]],
      cloaiVthh: [null,],
      tenCloaiVthh: [null,],
      dviTinh: [null, [Validators.required]],
      vaiTro: [null, [Validators.required]],
      tenVaiTro: [null, [Validators.required]],
      nguyenNhan: [null],
      dienBien: [null],
      bienPhapXl: [null],
      soLuongXl: [0, [Validators.required]],
      moTa: [null],
      idDataTk: [],
      idDataKtv: [],
      idDataLdcc: [],
      trangThai: [],
    })
  }


  async ngOnInit() {
    if (this.id) {
      await this.detail(this.id).then((res) => {
        for (const property in this.rowItem) {
          console.log(property, res[property]);
          this.rowItem[property] = res[property];
        }
      });
    } else {
      this.formData.patchValue({
        tenNguoiKtra: this.userInfo.TEN_DAY_DU,
        ngayKtra: dayjs().format('YYYY-MM-DD'),
        loaiVthh: this.dataHdr.loaiVthh,
        tenLoaiVthh: this.dataHdr.tenLoaiVthh,
        cloaiVthh: this.dataHdr.cloaiVthh,
        tenCloaiVthh: this.dataHdr.tenCloaiVthh,
        dviTinh: this.dataHdr.dviTinh,
        idHdr: this.dataHdr.id,
        vaiTro: this.userInfo.POSITION,
        tenVaiTro: this.userInfo.POSITION_NAME,
        idDataTk: this.dataTk?.id,
        idDataKtv: this.dataKtv?.id,
        idDataLdcc: this.dataLdcc?.id,
      })
      this.rowItem.tongSoLuong = this.dataHdr.soLuong;
    }
    this.loadDataCombobox();
  }

  async loadDataCombobox() {
    this.listBpxl = [];
    await this.danhMucService.danhMucChungGetAll('BIEN_PHAP_XU_LY').then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        console.log(this.formData.value.loaiVthh);
        if (this.formData.value.loaiVthh?.startsWith('02')) {
          this.listBpxl = res.data.filter(item => item.phanLoai.includes('VT'));
        } else {
          this.listBpxl = res.data.filter(item => item.phanLoai.includes('LT'));
        }
      }
    });
  }

  handleOk(isApprove) {
    let body = {
      ...this.formData.value,
      ...this.rowItem
    };
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isApprove) {
          this.formData.patchValue({
            id: res.id
          })
          this.handleApprove();
        } else {
          this._modalRef.close();
        }
      }
    });
  }

  handleApprove() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn xác nhận thông tin ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            trangThai: this.STATUS.DA_HOAN_THANH,
          }
          let res = await this.theoDoiBqDtlService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
            this.spinner.hide();
            this._modalRef.close();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  onCancel() {
    this._modalRef.close();
  }

  disabled(): boolean {
    if (this.formData.value.id) {
      return !(this.formData.value.ngayKtra == dayjs().format('YYYY-MM-DD') && this.formData.value.idNguoiKtra == this.userInfo.ID && this.formData.value.trangThai == this.STATUS.DU_THAO);
    } else {
      return false
    }
  }

  protected readonly AMOUNT = AMOUNT;
}

export class ChiSoChatLuong {
  // LT
  tongSoLuong: number = 0;
  anToan: number = 0;
  khongAnToan: number = 0;
  nongDo: number = 0;
  nhietDo: number = 0;
  doAm: number = 0;
  hatVang: number = 0;
  camQuan: string = '';
  tinhTrangNamMoc: string = '';
  conTrungSong: number = 0;
  // Muoi them
  muiVi: string = '';
  benNgoaiCoHat: string = '';
  //VT
  baoQuanLanDau: number = 0;
  anToanBqtx: number = 0;
  coBienDongBqtx: number = 0;
  tongCongBqtx: number = 0;
  anToanBqdk: number = 0;
  coBienDongBqdk: number = 0;
  tongCongBqdk: number = 0;
  anToanPktb: number = 0;
  coBienDongPktb: number = 0;
  daKhacPhucHh: number = 0;
  vuotQuyenHanHh: number = 0;
  daKhacPhucTb: number = 0;
  vuotQuyenHanTb: number = 0;
}
