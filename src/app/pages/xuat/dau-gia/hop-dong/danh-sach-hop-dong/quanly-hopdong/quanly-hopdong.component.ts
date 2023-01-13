import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { HopDongXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/hop-dong/hopDongXuatHang.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quanly-hopdong',
  templateUrl: './quanly-hopdong.component.html',
  styleUrls: ['./quanly-hopdong.component.scss']
})
export class QuanlyHopdongComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: String;
  @Output()
  showListEvent = new EventEmitter<any>();

  idHopDong: number;
  isEditHopDong: boolean

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongXuatHangService);
    this.formData = this.fb.group({
      id: [],
      namKhoach: [''],
      soQdPdKhlcnt: [],
      soQdPdKqLcnt: [],
      tenDuAn: [],
      tenDvi: [],
      tongMucDt: [],
      tongMucDtGoiTrung: [],
      nguonVon: [''],
      tenNguonVon: [''],
      hthucLcnt: [''],
      tenHthucLcnt: [],
      pthucLcnt: [''],
      tenPthucLcnt: [],
      loaiHdong: [''],
      tenLoaiHdong: [''],
      tgianBdauTchuc: [],
      tgianDthau: [],
      tgianMthau: [],
      tgianNhang: [''],
      gtriDthau: [],
      gtriHdong: [],
      donGiaVat: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      soGthau: [],
      soGthauTrung: [],
      soGthauTruot: [],
      soLuong: [''],
      donGia: [''],
      tongTien: [''],
      vat: ['5'],
      ghiChu: ['',],
      trangThai: [''],
      tenTrangThai: [''],
      soLuongTong: [''],
      soLuongGtTrung: [''],
      soLuongNhap: [''],
      tenTrangThaiHd: [''],
      trangThaiHd: [''],
    });
  }

  async ngOnInit() {
    await this.spinner.show()
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
    ]);
    if (this.id) {
      await this.getDetail(this.id)
    }
    await this.spinner.hide()
  }

  async getDetail(id) {
    if (id) {
      // let res = await this.kqLcnt.getDetail(id);
      // if (res.msg == MESSAGE.SUCCESS) {
      //   const data = res.data;
      //   if (this.loaiVthh.startsWith('02')) {
      //     this.detailVatTu(data);
      //   } else {
      //     this.detailLuongThuc(data);
      //   }
      // } else {
      //   this.notification.error(MESSAGE.ERROR, res.msg);
      // }
    }
  }

  detailVatTu(data) {
    console.log(data);
    this.formData.patchValue({
      id: data.id,
      namKhoach: data.namKhoach,
      soQdPdKhlcnt: data.hhQdKhlcntHdr.soQd,
      tenLoaiHdong: data.hhQdKhlcntHdr.tenLoaiHdong,
      tenNguonVon: data.hhQdKhlcntHdr.tenNguonVon,
      tenLoaiVthh: data.hhQdKhlcntHdr.tenLoaiVthh,
      tenCloaiVthh: data.hhQdKhlcntHdr.tenCloaiVthh,
      vat: 5,
      tenTrangThaiHd: data.tenTrangThaiHd,
      trangThaiHd: data.trangThaiHd,
    });
    this.dataTable = data.hhQdKhlcntHdr.children.filter(item => item.trangThai == STATUS.THANH_CONG);
    if (data.listHopDong) {
      let soLuong = 0
      let tongMucDtGoiTrung = 0;
      this.dataTable.forEach(item => {
        let hopDong = data.listHopDong.filter(x => x.idGoiThau == item.id)[0];
        item.hopDong = hopDong
        if (item.hopDong) {
          soLuong += item.hopDong.soLuong;
          tongMucDtGoiTrung += item.hopDong.soLuong * item.hopDong.donGia * 1000;
        }
      })
      this.formData.patchValue({
        soLuongNhap: soLuong,
        tongMucDtGoiTrung: tongMucDtGoiTrung
      })
    };
    this.idHopDong = null;
  }

  detailLuongThuc(data) {
    this.formData.patchValue({
      id: data.id,
      namKhoach: data.namKhoach,
      soQdPdKhlcnt: data.qdKhlcntDtl.hhQdKhlcntHdr.soQd,
      soQdPdKqLcnt: data.qdKhlcntDtl.soQdPdKqLcnt,
      tenDuAn: data.qdKhlcntDtl.tenDuAn,
      tenLoaiHdong: data.qdKhlcntDtl.hhQdKhlcntHdr.tenLoaiHdong,
      tenDvi: data.tenDvi,
      tenNguonVon: data.qdKhlcntDtl.hhQdKhlcntHdr.tenNguonVon,
      soGthau: data.qdKhlcntDtl.soGthau,
      tenLoaiVthh: data.qdKhlcntDtl.hhQdKhlcntHdr.tenLoaiVthh,
      tenCloaiVthh: data.qdKhlcntDtl.hhQdKhlcntHdr.tenCloaiVthh,
      vat: 5,
      soGthauTrung: data.qdKhlcntDtl.soGthauTrung,
      tenTrangThaiHd: data.tenTrangThaiHd,
      trangThaiHd: data.trangThaiHd,
      tongMucDt: data.qdKhlcntDtl.soLuong * data.qdKhlcntDtl.donGiaVat * 1000
    });
    this.dataTable = data.qdKhlcntDtl.children.filter(item => item.trangThai == STATUS.THANH_CONG);
    if (data.listHopDong) {
      let soLuong = 0
      let tongMucDtGoiTrung = 0;
      this.dataTable.forEach(item => {
        let hopDong = data.listHopDong.filter(x => x.idGoiThau == item.id)[0];
        item.hopDong = hopDong
        if (item.hopDong) {
          soLuong += item.hopDong.soLuong;
          tongMucDtGoiTrung += item.hopDong.soLuong * item.hopDong.donGia * 1000;
        }
      })
      this.formData.patchValue({
        soLuongNhap: soLuong,
        tongMucDtGoiTrung: tongMucDtGoiTrung
      })
    };
    this.idHopDong = null;
  }

  async getDetailHopDong($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idHopDong = id;
    this.spinner.hide();
  }

  async redirectHopDong(isShowHd: boolean, id: number) {
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    if (!isShowHd) {
      await this.ngOnInit()
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async approve() {
    await this.spinner.show()
    if (this.validateData()) {
      let body = {
        id: this.id,
        trangThai: STATUS.DA_HOAN_THANH
      }
      // let res = await this.kqLcnt.approve(body);
      // if (res.msg == MESSAGE.SUCCESS) {
      //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
      //   this.back();
      // } else {
      //   this.notification.error(MESSAGE.ERROR, res.msg);
      // }
    }
    await this.spinner.hide()
  }

  validateData(): boolean {
    let result = true;
    this.dataTable.forEach(item => {
      if (item.hopDong) {
        if (item.hopDong.trangThai != STATUS.DA_KY) {
          this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả hợp đồng cho các gói thầu");
          result = false;
          return
        }
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng thêm các hợp đồng cho các gói thầu");
        result = false;
        return
      }
    });
    return result;
  }

  deleteHopDong(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: MESSAGE.DELETE_CONFIRM,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      // nzOnOk: () => {
      //   this.spinner.show();
      //   try {
      //     let body = {
      //       id: id,
      //       maDvi: null,
      //     };
      //     this.thongTinHopDong
      //       .delete(body)
      //       .then(async (res) => {
      //         if (res.msg == MESSAGE.SUCCESS) {
      //           await this.getDetail(this.id)
      //           this.notification.success(
      //             MESSAGE.SUCCESS,
      //             MESSAGE.DELETE_SUCCESS,
      //           );
      //         } else {
      //           this.notification.error(MESSAGE.ERROR, res.msg);
      //         }
      //         this.spinner.hide();
      //       });
      //   } catch (e) {
      //     console.log('error: ', e);
      //     this.spinner.hide();
      //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      //   }
      // },
    });
  }

}
