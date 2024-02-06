import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {ThongtinDaugiaComponent} from './thongtin-daugia/thongtin-daugia.component';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia',
  templateUrl: './chi-tiet-thong-tin-dau-gia.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia.component.scss']
})
export class ChiTietThongTinDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  templateNameVt = "Thông tin bán đấu giá vật tư";
  templateNameLt = "Thông tin bán đấu giá lương thực";
  dataThongTin: any;
  isThongTin: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private thongTinDauGiaService: ThongTinDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [],
        maDvi: [],
        idQdPd: [],
        soQdPd: [''],
        idQdDc: [],
        soQdDc: [''],
        idQdPdDtl: [],
        soQdKq: [''],
        tenDvi: [''],
        tongTienDatTruoc: [],
        khoanTienDatTruoc: [],
        khoanTienDatTruocHienThi: [''],
        tgianDauGia: [''],
        tgianDauGiaTu: [''],
        tgianDauGiaDen: [''],
        tgianTtoan: [],
        tenPthucTtoan: [''],
        tgianGnhan: [],
        pthucGnhan: [''],
        tongTienDatTruocDd: [],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tongSoLuong: [],
        tenLoaiHinhNx: [''],
        tenKieuNx: [''],
        trangThai: [],
        tenTrangThai: [],
        donViTinh: [''],
        listTtinDg: []
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await this.loadDetail(this.idInput);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail(id: number) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.quyetDinhPdKhBdgService.getDtlDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.dataTable = cloneDeep(data.listTtinDg);
      if (this.dataTable && this.dataTable.length > 0) {
        await this.selectRow(this.dataTable[0]);
      }
      this.formData.patchValue({
        nam: data.nam,
        idQdPd: data.xhQdPdKhBdg.type === 'QDDC' ? data.xhQdPdKhBdg.idQdPd : data.idHdr,
        soQdPd: data.soQdPd,
        idQdDc: data.xhQdPdKhBdg.type === 'QDDC' ? data.idHdr : null,
        soQdDc: data.soQdDc,
        idQdPdDtl: data.id,
        soQdKq: data.soQdKq,
        maDvi: data.maDvi,
        tenDvi: data.tenDvi,
        khoanTienDatTruoc: data.khoanTienDatTruoc,
        khoanTienDatTruocHienThi: data.khoanTienDatTruoc + '%',
        tgianDauGia: this.isValidDate(data.tgianDkienTu) && this.isValidDate(data.tgianDkienDen) ? [`Từ ${dayjs(data.tgianDkienTu).format('DD/MM/YYYY')} Đến ${dayjs(data.tgianDkienDen).format('DD/MM/YYYY')}`] : [],
        tgianTtoan: data.tgianTtoan,
        tenPthucTtoan: data.tenPthucTtoan,
        tgianGnhan: data.tgianGnhan,
        pthucGnhan: data.pthucGnhan,
        tenCloaiVthh: data.tenCloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tongSoLuong: data.tongSoLuong,
        tenLoaiHinhNx: data.xhQdPdKhBdg.tenLoaiHinhNx,
        tenKieuNx: data.xhQdPdKhBdg.tenKieuNx,
        donViTinh: data.donViTinh,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
        listTtinDg: data.listTtinDg
      });
      await this.calculatorTable(data.children);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  isValidDate(dateString: string): boolean {
    return dayjs(dateString).isValid();
  }

  async calculatorTable(data) {
    data.forEach(item => {
      item.children.forEach(child => {
        child.tienDatTruocDd = child.donGiaDuocDuyet * child.soLuongDeXuat * this.formData.value.khoanTienDatTruoc / 100;
      });
    });
    this.formData.patchValue({
      tongTienDatTruoc: data.reduce((prev, cur) => prev + cur.tongTienDatTruocDx, 0),
      tongTienDatTruocDd: data.reduce((prev, item) => prev + item.children.reduce((prevChild, curChild) => prevChild + curChild.tienDatTruocDd, 0), 0),
    });
  }

  async hoanThanhCapNhat() {
    if (this.dataTable.length === 0) {
      this.notification.error(MESSAGE.ERROR, "Không thể kết thúc đấu giá, phải có ít nhất 1 lần đấu giá");
      await this.spinner.hide();
      return;
    }
    const dataFilter = this.dataTable.find(item => item.trangThai === this.STATUS.DANG_THUC_HIEN);
    if (dataFilter) {
      this.notification.error(MESSAGE.ERROR, `Không thể kết thúc đấu giá, thông báo ${dataFilter.maThongBao} đang chưa hoàn thành`);
      await this.spinner.hide();
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn kết thúc đấu giá ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        try {
          await this.spinner.show();
          const body = {
            id: this.idInput,
            trangThai: this.STATUS.DA_HOAN_THANH
          };
          const res = await this.quyetDinhPdKhBdgService.approveDtl(body);
          if (res.msg === MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (error) {
          console.log('error: ', error);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      }
    });
  }


  async selectRow(data: any) {
    if (!data.selected) {
      this.dataTable.forEach(item => item.selected = false);
      data.selected = true;
      const findndex = this.dataTable.findIndex(child => child.id == data.id);
      this.dataThongTin = this.dataTable[findndex]
      this.isThongTin = true
    }
  }

  async themMoiPhienDauGia($event, isView: boolean, data?: any) {
    $event.stopPropagation();
    if (!data) {
      const hasUnfinishedAuction = this.dataTable.some(item => item.trangThai === this.STATUS.DANG_THUC_HIEN);
      if (hasUnfinishedAuction) {
        this.notification.error(MESSAGE.ERROR, "Không thể thêm mới, vì đang có thông tin đấu giá chưa hoàn thành cập nhập, xin viu lòng hoàn thành cập nhập");
        return;
      }
    }
    const modalQD = this.modal.create({
      nzTitle: '',
      nzContent: ThongtinDaugiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzBodyStyle: {'overflow-y': 'auto'},
      nzComponentParams: {
        isView: isView,
        dataDetail: this.formData.value,
        dataThongTin: data,
        soLanDauGia: this.dataTable.length,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      await this.loadDetail(this.idInput);
    });
  }


  async deleteThongTin(data) {
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
          await this.thongTinDauGiaService.delete(body);
          if (this.idInput > 0) {
            const res = await this.quyetDinhPdKhBdgService.getDtlDetail(this.idInput);
            if (res.data && res.data.listTtinDg && res.data.listTtinDg.length > 0) {
              this.isThongTin = true;
            } else {
              this.isThongTin = false;
            }
          }
          await this.loadDetail(this.idInput);
        } catch (error) {
          console.log('error: ', error);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }
}
