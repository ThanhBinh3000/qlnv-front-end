import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import {StorageService} from 'src/app/services/storage.service';
import {formatNumber} from "@angular/common";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-quanly-hopdong',
  templateUrl: './quanly-hopdong.component.html',
  styleUrls: ['./quanly-hopdong.component.scss']
})
export class QuanlyHopdongComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  isView: boolean
  isEditHopDong: boolean
  selected: boolean = false;
  listHangHoaAll: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      nam: [''],
      soQdKq: [''],
      soQdPd: [''],
      tenDvi: [''],
      tongDviTsan: [],
      slDviTsanThanhCong: [],
      slDviTsanKhongThanh: [],
      tongSlXuat: [],
      donViTinh: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      vat: [''],
      thanhTien: [],
      tenLoaiHinhNx: [''],
      tenKieuNhapXuat: [''],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
    });
  }

  async ngOnInit() {
    if (this.idInput) {
      await this.spinner.show();
      try {
        if (this.idInput) {
          await this.getDetail(this.idInput);
        }
      } catch (e) {
        console.error('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        await this.spinner.hide();
      }
    }
  }

  async getDetail(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.qdPdKetQuaBanDauGiaService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        throw new Error('Không tìm thấy dữ liệu');
      }
      const data = res.data;
      const formDataValues = {
        nam: data.nam,
        soQdKq: data.soQdKq,
        soQdPd: data.soQdPd,
        tenDvi: data.tenDvi,
        tongDviTsan: data.tongDviTsan,
        slDviTsanThanhCong: data.slDviTsanThanhCong,
        slDviTsanKhongThanh: data.slDviTsanKhongThanh,
        tongSlXuat: data.tongSlXuat,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        vat: '3%',
        thanhTien: data.thanhTien,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        tenKieuNhapXuat: data.tenKieuNhapXuat,
        trangThaiHd: data.trangThaiHd,
        tenTrangThaiHd: data.tenTrangThaiHd,
      };
      this.formData.patchValue(formDataValues);
      await this.loadDsVthh();
      this.dataTable = data.listHopDong;
      if (this.dataTable && this.dataTable.length > 0) {
        await this.showFirstRow(event, this.dataTable[0].id);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
    }
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
    const dataFilter = this.dataTable.find(item => item.trangThai === this.STATUS.DU_THAO);
    if (dataFilter) {
      this.notification.error(MESSAGE.ERROR, `Không thể hoàn thành thực hiện, hợp đồng số ${dataFilter.soHopDong} đang chưa ký`);
    } else {
      await this.approve(this.idInput, STATUS.DA_HOAN_THANH, "Bạn có muốn hoàn thành thực hiện hợp đồng ?");
    }
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
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          const body = {id: data.id};
          await this.hopDongXuatHangService.delete(body);
          await this.getDetail(this.idInput);
        } catch (error) {
          console.log('error: ', error);
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

  formatterTien = (value: number) => {
    const donViTien = '(đ)';
    const formattedValue = value ? formatNumber(value, 'vi_VN', '1.0-1') : 0;
    return `${formattedValue} ${donViTien}`;
  }

  formatterSoLuong = (value: number) => {
    const donViTinh = this.listHangHoaAll.find(s => s.ma == this.loaiVthh)?.maDviTinh;
    const formattedValue = value ? formatNumber(value, 'vi_VN', '1.0-1') : 0;
    return `${formattedValue} ${donViTinh == undefined ? '' : donViTinh}`;
  }

  openModal(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModal() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }
}
