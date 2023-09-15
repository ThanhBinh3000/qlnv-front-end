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
import {PREVIEW} from "src/app/constants/fileType";
import {formatNumber} from "@angular/common";

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia',
  templateUrl: './chi-tiet-thong-tin-dau-gia.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia.component.scss']
})
export class ChiTietThongTinDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  dataThongTin: any;
  selected: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [],
        maDvi: [],
        idQdPd: [],
        soQdPd: [''],
        idQdPdDtl: [],
        soQdPdKqBdg: [''],
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
      if (!res || !res.data) {
        console.log('Không tìm thấy dữ liệu');
        return;
      }
      const data = res.data;
      this.dataTable = cloneDeep(data.listTtinDg);
      if (this.dataTable && this.dataTable.length > 0) {
        await this.showFirstRow(event, this.dataTable[0]);
      }
      const resHdr = await this.quyetDinhPdKhBdgService.getDetail(data.idQdHdr);
      if (!resHdr || !resHdr.data) {
        console.log('Không tìm thấy dữ liệu');
        return;
      }
      const dataHdr = resHdr.data;
      this.formData.patchValue({
        nam: data.nam,
        idQdPd: data.idQdHdr,
        soQdPd: data.soQdPd,
        idQdPdDtl: data.id,
        soQdPdKqBdg: data.soQdPdKqBdg,
        maDvi: data.maDvi,
        tenDvi: data.tenDvi,
        khoanTienDatTruoc: data.khoanTienDatTruoc,
        khoanTienDatTruocHienThi: data.khoanTienDatTruoc + '%',
        tgianDauGia: ['Từ ' + dayjs(data.tgianDkienTu).format('DD/MM/YYYY') + ' Đến ' + dayjs(data.tgianDkienDen).format('DD/MM/YYYY')],
        tgianTtoan: data.tgianTtoan,
        tenPthucTtoan: data.tenPthucTtoan,
        tgianGnhan: data.tgianGnhan,
        pthucGnhan: data.pthucGnhan,
        tenCloaiVthh: dataHdr.tenCloaiVthh,
        tenLoaiVthh: dataHdr.tenLoaiVthh,
        tongSoLuong: data.tongSoLuong,
        tenLoaiHinhNx: dataHdr.tenLoaiHinhNx,
        tenKieuNx: dataHdr.tenKieuNx,
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
            trangThai: this.STATUS.HOAN_THANH_CAP_NHAT
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

  async showFirstRow($event, data: any) {
    await this.showDetail($event, data);
  }

  async showDetail($event, data: any) {
    await this.spinner.show();
    if ($event.type === 'click') {
      this.selected = false;
      const selectedRow = $event.target.parentElement.parentElement.querySelector('.selectedRow');
      if (selectedRow) {
        selectedRow.classList.remove('selectedRow');
      }
      $event.target.parentElement.classList.add('selectedRow');
    } else {
      this.selected = true;
    }
    this.dataThongTin = data;
    await this.spinner.hide();
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


  formatterTien = (value: number) => {
    const donViTien = '(đ)';
    const formattedValue = value ? formatNumber(value, 'vi_VN', '1.0-1') : 0;
    return `${formattedValue} ${donViTien}`;
  }

  formatterSoLuong = (value: number) => {
    const donViTinh = this.formData.value.donViTinh;
    const formattedValue = value ? formatNumber(value, 'vi_VN', '1.0-1') : 0;
    return `${formattedValue} ${donViTinh}`;
  }

  async preview() {
    const data = [];
    for (const s of this.formData.value.listTtinDg) {
      const res = await this.thongTinDauGiaService.getDetail(s.id);
      data.push(res.data);
    }
    const body = {
      tenCloaiVthh: this.formData.value.tenCloaiVthh.toUpperCase(),
      nam: this.formData.value.nam,
      maDvi: this.formData.value.maDvi,
      children: data
    };
    try {
      const s = await this.service.preview(body);
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
