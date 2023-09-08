import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {StorageService} from 'src/app/services/storage.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";

@Component({
  selector: 'app-quan-ly-hop-dong-btt',
  templateUrl: './quan-ly-hop-dong-btt.component.html',
  styleUrls: ['./quan-ly-hop-dong-btt.component.scss']
})
export class QuanLyHopDongBttComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Output() showListEvent = new EventEmitter<any>();
  isView: boolean
  isEditHopDong: boolean
  selected: boolean = false;

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
      namKh: [''],
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
        await this.getDetail();
      } catch (e) {
        console.log('error: ', e);
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
        tongSlDaKyHdong: data.tongSlDaKyHdong,
        tongSlChuaKyHdong: data.tongSlChuaKyHdong,
        trangThaiHd: data.trangThaiHd,
        tenTrangThaiHd: data.tenTrangThaiHd,
      });
      this.dataTable = data.listHopDongBtt;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0].id);
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetailChiCuc() {
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(this.idInput);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        throw new Error('Response error');
      }
      const data = res.data;
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
        tongSlDaKyHdong: data.tongSlDaKyHdong,
        tongSlChuaKyHdong: data.tongSlChuaKyHdong,
        vat: '5 %',
        trangThaiHd: data.trangThaiHd,
        tenTrangThaiHd: data.tenTrangThaiHd,
      };
      this.formData.patchValue(formDataValues);
      this.dataTable = data.listHopDongBtt;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0].id);
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async showFirstRow($event, id: any) {
    await this.showDetail($event, id);
  }

  idHopDong: number;

  async showDetail($event, id: number) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    this.idHopDong = id;
    await this.spinner.hide();
  }

  async redirectHopDong(id: number, isView: boolean, isShowHd: boolean) {
    this.idHopDong = id;
    this.isView = isView;
    this.isEditHopDong = isShowHd;
    if (!isShowHd) {
      await this.ngOnInit()
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

  validateData(): boolean {
    if (!this.dataTable || this.dataTable.length === 0) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng thêm hợp đồng");
      return false;
    }
    const isAnyContractNotSigned = this.dataTable.some(item => item && item.trangThai !== STATUS.DA_KY);
    if (isAnyContractNotSigned) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả các hợp đồng");
      return false;
    }
    return true;
  }

  async deleteHd(data) {
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
            id: data.id
          };
          this.hopDongBttService.delete(body).then(async () => {
            await this.getDetail();
            await this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  calcTong(column) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }
}
