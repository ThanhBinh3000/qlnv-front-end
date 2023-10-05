import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { StorageService } from 'src/app/services/storage.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import { LOAI_HANG_DTQG } from 'src/app/constants/config';

@Component({
  selector: 'app-quan-ly-hop-dong-btt',
  templateUrl: './quan-ly-hop-dong-btt.component.html',
  styleUrls: ['./quan-ly-hop-dong-btt.component.scss']
})
export class QuanLyHopDongBttComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView: boolean
  isEditHopDong: boolean
  selected: boolean = false;
  loadDanhSachHdongDaKy: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [],
      soQdKq: [],
      soQdPd: [],
      tenHd: [],
      tenDvi: [],
      tongGiaTriHdong: [],
      tongSlXuatBanQdKh: [],
      tongSlDaKyHdong: [],
      tongSlChuaKyHdong: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      vat: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
    });
  }

  async ngOnInit() {
    if (this.idInput) {
      await this.spinner.show();
      try {
        if (this.idInput) {
          await this.getDetail();
        }
      } catch (e) {
        console.error('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        await this.spinner.hide();
      }
    }
  }

  async getDetail() {
    this.userService.isChiCuc() ? await this.getDetailChiCuc() : await this.getDetailCuc()
  }

  async getDetailCuc() {
    try {
      const res = await this.qdPdKetQuaBttService.getDetail(this.idInput);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        throw new Error('Response error');
      }
      const data = res.data;
      await this.loadDanhDachHopDong();
      this.formData.patchValue({
        namKh: data.namKh,
        soQdPd: data.soQdPd,
        soQdKq: data.soQdKq,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        tenKieuNx: data.tenKieuNx,
        vat: '5 %',
        tongSlXuatBanQdKh: data.tongSoLuong,
        tongGiaTriHdong: data.tongGiaTriHdong,
        tongSlChuaKyHdong: data.tongSlChuaKyHdong,
        trangThaiHd: data.trangThaiHd,
        tenTrangThaiHd: data.tenTrangThaiHd,
      });
      const filteredItems = this.loadDanhSachHdongDaKy.filter(item => item.idQdKq === data.id);
      const tongSlDaKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuongBanTrucTiep, 0);
      const tongSlChuaKyHdong = data.tongSoLuong - tongSlDaKyHdong;
      this.formData.patchValue({
        tongSlDaKyHdong: tongSlDaKyHdong,
        tongSlChuaKyHdong: tongSlChuaKyHdong,
      });
      this.dataTable = data.listHopDongBtt;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0].id);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getDetailChiCuc() {
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(this.idInput);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        throw new Error('Response error');
      }
      const data = res.data;
      await this.loadDanhDachHopDong();
      const formDataValues = {
        namKh: data.namKh,
        soQdPd: data.soQdPd,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        tenKieuNx: data.tenKieuNx,
        tongSlXuatBanQdKh: data.tongSoLuong,
        tongGiaTriHdong: data.tongGiaTriHdong,
        vat: '5 %',
        trangThaiHd: data.trangThaiHd,
        tenTrangThaiHd: data.tenTrangThaiHd,
      };
      const filteredItems = this.loadDanhSachHdongDaKy.filter(item => item.idChaoGia === data.id);
      const tongSlDaKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuongBanTrucTiep, 0);
      const tongSlChuaKyHdong = data.tongSoLuong - tongSlDaKyHdong;
      this.formData.patchValue({
        tongSlDaKyHdong: tongSlDaKyHdong,
        tongSlChuaKyHdong: tongSlChuaKyHdong,
      });
      this.formData.patchValue(formDataValues);
      this.dataTable = data.listHopDongBtt;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0].id);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDanhDachHopDong() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.DA_KY,
    };
    const res = await this.hopDongBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachHdongDaKy = data;
  }

  async showFirstRow($event, id: any) {
    await this.showDetail($event, id);
  }

  idHopDong: number;

  async showDetail($event, id: number) {
    try {
      await this.spinner.show();
      if ($event.type == 'click') {
        this.selected = false;
        const selectedRow = $event.target.parentElement.parentElement.querySelector('.selectedRow');
        if (selectedRow) {
          selectedRow.classList.remove('selectedRow');
        }
        $event.target.parentElement.classList.add('selectedRow');
      } else {
        this.selected = true;
      }
      this.idHopDong = id;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async redirectHopDong(id: number, isView: boolean, isShowHd: boolean) {
    this.idHopDong = id;
    this.isView = isView;
    this.isEditHopDong = isShowHd;
    if (!isShowHd) {
      try {
        await this.ngOnInit();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  async pheDuyet() {
    this.userService.isChiCuc() ? await this.guiDuyetChiCuc() : await this.guiDuyetCuc()
  }

  async guiDuyetCuc() {
    await this.spinner.show();
    if (!this.validateData()) {
      await this.spinner.hide();
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn hoàn thành thực hiện hợp đồng ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        try {
          const body = {
            id: this.idInput,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          const res = await this.qdPdKetQuaBttService.approve(body);
          if (res.msg === MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  async guiDuyetChiCuc() {
    await this.spinner.show();
    if (!this.validateData()) {
      await this.spinner.hide();
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn hoàn thành thực hiện hợp đồng ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        try {
          const body = {
            id: this.idInput,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          const res = await this.chaoGiaMuaLeUyQuyenService.approve(body);
          if (res.msg === MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  async validateData(): Promise<boolean> {
    if (!this.dataTable || this.dataTable.length === 0) {
      await this.notification.error(MESSAGE.ERROR, "Vui lòng thêm hợp đồng");
      return false;
    }
    const isAnyContractNotSigned = this.dataTable.some(item => item && item.trangThai !== STATUS.DA_KY);
    if (isAnyContractNotSigned) {
      await this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả các hợp đồng");
      return false;
    }
    return true;
  }

  async deleteHd(data) {
    await this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: data.id
          };
          await this.hopDongBttService.delete(body);
          await this.getDetail();
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  calcTong(column) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[column] || 0), 0);
  }
}
