import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../constants/message";
import {STATUS} from "../../../../../constants/status";
import {convertTienTobangChu} from "../../../../../shared/commonFunction";
import {AMOUNT_NO_DECIMAL} from "../../../../../Utility/utils";
import dayjs from "dayjs";
import {HopdongService} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/hopdong.service";

@Component({
  selector: 'app-them-moi-phu-luc-hd',
  templateUrl: './them-moi-phu-luc-hd.component.html',
  styleUrls: ['./them-moi-phu-luc-hd.component.scss']
})
export class ThemMoiPhuLucHdComponent extends Base2Component implements OnInit {
  @Input() id: number
  @Input() isView: boolean
  @Input() dataHdr: any
  @Input() tablePl: any
  @Output()
  goBackEvent = new EventEmitter<any>();
  @Input() listDiaDiem: any
  checkDtl: boolean
  dataKlcvEdit: { [key: string]: { edit: boolean; data: KhoiLuongCongViec } } = {};
  soLuong: number;
  expandSetString = new Set<string>();
  rowItemKlcv: KhoiLuongCongViec = new KhoiLuongCongViec();
  dataKlcv: any[] = [];
  AMOUNT = AMOUNT_NO_DECIMAL
  hauToSoHd = "/" + dayjs().get('year') + "/PLHĐ";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private hopdongService: HopdongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      namKeHoach: [null],
      soHd: [null],
      soHdHdr: [null],
      tenHd: [null],
      ngayHieuLucHdr: [null],
      ngayHieuLuc: [null, Validators.required],
      noiDungPl: [null],
      noiDungDc: [null],
      thoiGianThHd: [null],
      thoiGianThHdHdr: [null],
      ghiChu: [null],
      listKtTdxdHopDongKlcv: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      hdHdrId: [null],
      loai: ['01'],
      isKhoiTao: [1],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.id > 0) {
        await this.detail(this.id);
      } else {
        this.initForm()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goBackHdr() {
    this._modalRef.close(true);
  }

  initForm() {
    if (this.dataHdr) {
      this.formData.patchValue({
        namKeHoach : this.dataHdr.namKeHoach,
        tenHd: this.dataHdr.tenHd,
        soHdHdr: this.dataHdr.soHd,
        ngayHieuLucHdr: this.dataHdr.ngayHieuLuc,
        thoiGianThHdHdr: this.dataHdr.thoiGianThHd,
        hdHdrId : this.dataHdr.id
      })
      this.dataKlcv = this.dataHdr.listKtTdxdHopDongKlcv && this.dataHdr.listKtTdxdHopDongKlcv.length > 0 ? this.dataHdr.listKtTdxdHopDongKlcv : []
      this.updateEditKLCongViecCache()
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.hopdongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let detailhdr = res.data.hopDongHdr
          this.listDiaDiem = []
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.formData.patchValue({
            soHd : this.formData.value.soHd ?  this.formData.value.soHd.split('/')[0] : '',
            soHdHdr : detailhdr?.soHd,
            ngayHieuLucHdr : detailhdr?.ngayHieuLuc,
            thoiGianThHdHdr : detailhdr?.thoiGianThHd
          })
          this.dataKlcv = data.listKtTdxdHopDongKlcv
          this.updateEditKLCongViecCache();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async save(isKy?) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.dataKlcv && this.dataKlcv.length > 0) {
      this.dataKlcv.forEach(item => {
        item.id = null
      })
      this.formData.patchValue({
        soHd : this.formData.value.soHd ? this.formData.value.soHd +  this.hauToSoHd : this.formData.value.soHd,
        listKtTdxdHopDongKlcv : this.dataKlcv
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Danh sách khối lượng công việc không được để trống.");
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.patchValue({
      maDvi : this.userInfo.MA_DVI,
      capDvi : this.userInfo.CAP_DVI,
    })
    if (isKy) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Ký hợp đồng",
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.createUpdate(this.formData.value);
            if (res) {
              let body = {
                id: res.id,
                trangThai: STATUS.DA_KY,
              }
              let res1 = await this.hopdongService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this._modalRef.close(true)
              }
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
    } else {
      let res = await this.createUpdate(this.formData.value);
      if (res) {
        this.id = res.id
        this.formData.patchValue({
          id : res.id,
          trangThai : res.trangThai
        })
      }
    }
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
        trangThai = STATUS.DA_KY;
        break;
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn ký?')
  }



  calThanhTien(action, idx?) {
    if (action == 'add') {
      if (this.rowItemKlcv.donGia && this.rowItemKlcv.khoiLuong) {
        this.rowItemKlcv.thanhTien = this.rowItemKlcv.donGia * this.rowItemKlcv.khoiLuong;
      }
    } else {
      if (this.dataKlcvEdit[idx].data.donGia && this.dataKlcvEdit[idx].data.khoiLuong) {
        this.dataKlcvEdit[idx].data.thanhTien = this.dataKlcvEdit[idx].data.khoiLuong * this.dataKlcvEdit[idx].data.donGia;
      }
    }
  }

  addKlCongViec() {
    if (!this.rowItemKlcv.tenCongViec || !this.rowItemKlcv.donGia || !this.rowItemKlcv.khoiLuong) {
      this.notification.error(MESSAGE.ERROR, "Yêu cầu nhập đủ thông tin.");
      return;
    }
    this.rowItemKlcv.thanhTien = this.rowItemKlcv.donGia * this.rowItemKlcv.khoiLuong;
    this.dataKlcv = [...this.dataKlcv, this.rowItemKlcv];
    this.rowItemKlcv = new KhoiLuongCongViec();
    this.updateEditKLCongViecCache();
    this.formData.patchValue({
      thanhTien: this.sumKlCongViec('thanhTien'),
    })
    this.formData.patchValue({
      thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
    })
  }

  convertTien(tien
                :
                number
  ):
    string {
    return convertTienTobangChu(tien);
  }

  updateEditKLCongViecCache()
    :
    void {
    if (this.dataKlcv
    ) {
      this.dataKlcv.forEach((item, index) => {
        this.dataKlcvEdit[index] = {
          edit: false,
          data: {...item},
        };
        item.thanhTien = item.khoiLuong * item.donGia;
      });
    }
  }

  sumKlCongViec(key) {
    if (this.dataKlcv.length > 0) {
      return this.dataKlcv.reduce((a, b) => a + (b[key] || 0), 0);
    }
  }

  editDataKlCongViec(index) {
    this.dataKlcvEdit[index].edit = true;
  }

  deleteKlCongViec(index) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataKlcv.splice(index, 1);
          this.formData.patchValue({
            thanhTien: this.sumKlCongViec('thanhTien'),
          })
          this.formData.patchValue({
            thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
          })
          this.updateEditKLCongViecCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEditKLCongViec(idx) {
    if (!this.dataKlcvEdit[idx].data.tenCongViec || !this.dataKlcvEdit[idx].data.donGia || !this.dataKlcvEdit[idx].data.khoiLuong) {
      this.notification.error(MESSAGE.ERROR, "Yêu cầu nhập đủ thông tin.");
      return;
    }
    this.dataKlcvEdit[idx].data.thanhTien = this.dataKlcvEdit[idx].data.khoiLuong * this.dataKlcvEdit[idx].data.donGia;
    Object.assign(this.dataKlcv[idx], this.dataKlcvEdit[idx].data);
    this.formData.patchValue({
      thanhTien: this.sumKlCongViec('thanhTien'),
    })
    this.formData.patchValue({
      thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
    })
    this.dataKlcvEdit[idx].edit = false;
  }

  cancelEditKLCongViec(idx) {
    this.dataKlcvEdit[idx] = {
      data: {...this.dataKlcv[idx]},
      edit: false
    };
  }

  async delete(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopdongService.delete(body).then(async () => {
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  refreshKLCongViec() {
    this.rowItemKlcv = new KhoiLuongCongViec();
  }
}

export class KhoiLuongCongViec {
  id: number;
  tenCongViec: string;
  donViTinh: string;
  khoiLuong: number;
  donGia: number;
  thanhTien: number;
  ghiChu: string;
}
