import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {NgxSpinnerService} from 'ngx-spinner';
import {HelperService} from 'src/app/services/helper.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import {STATUS} from "../../../../../../../constants/status";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  QuyetDinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";

@Component({
  selector: 'app-thongtin-dexuat-khbdg',
  templateUrl: './thongtin-dexuat-khbdg.component.html',
  styleUrls: ['./thongtin-dexuat-khbdg.component.scss']
})

export class ThongtinDexuatKhbdgComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() loaiVthhCache;
  @Output() countChanged: EventEmitter<any> = new EventEmitter();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  formData: FormGroup
  dataTable: any[] = [];
  dataDonGiaDuocDuyet: any;

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      tgianBdauTchuc: [],
      tgianDkienTu: [null,],
      tgianDkienDen: [null,],
      tgianTtoan: [null,],
      tgianTtoanGhiChu: [null,],
      pthucTtoan: [null,],
      tenPthucTtoan: [null,],
      tgianGnhan: [null,],
      tgianGnhanGhiChu: [null,],
      pthucGnhan: [null,],
      thongBao: [null,],
      khoanTienDatTruoc: [null,],
      donViTinh: [null,],
      tongSoLuong: [null],
      tongTienKhoiDiem: [null],
      tongTienDatTruoc: [null],
      diaChi: [],
      namKh: [dayjs().get('year'),],
      soDxuat: [null,],
      thoiGianDuKien: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.dataInput) {
      await this.spinner.show();
      const dataInput = changes.dataInput.currentValue;
      if (dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, dataInput);
        const hasValidTime = dataInput.tgianDkienTu && dataInput.tgianDkienDen;
        this.formData.patchValue({
          thoiGianDuKien: hasValidTime ? [dataInput.tgianDkienTu, dataInput.tgianDkienDen] : null
        });
        this.dataTable = dataInput.children;
        await this.calculatorTable();
      } else {
        this.formData.reset();
      }
      await this.spinner.hide();
    }
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
  }

  async themMoiBangPhanLoTaiSan(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.dataInput.loaiVthh,
        cloaiVthh: this.dataInput.cloaiVthh,
        typeLoaiVthh: this.loaiVthhCache,
      },
    });
    modalGT.afterClose.subscribe(async (updatedData) => {
      if (updatedData && index >= 0) {
        this.dataTable[index] = updatedData;
        await this.calculatorTable();
        await this.sendDataToParent();
      }
    });
  }

  async calculatorTable() {
    let bodyPag = {
      namKeHoach: this.dataInput.namKh ? this.dataInput.namKh : this.dataInput.nam,
      loaiVthh: this.dataInput.loaiVthh,
      cloaiVthh: this.dataInput.cloaiVthh,
      trangThai: STATUS.BAN_HANH,
      maDvi: this.dataInput.maDvi.substring(0, 6),
      loaiGia: 'LG04',
    };
    const pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag);
    if (pag.msg !== MESSAGE.SUCCESS) {
      return;
    }
    this.dataDonGiaDuocDuyet = pag.data || null;
    if (this.dataDonGiaDuocDuyet && this.dataDonGiaDuocDuyet.length > 0) {
      const donGiaMap = new Map();
      this.dataDonGiaDuocDuyet.forEach((item) => {
        donGiaMap.set(item.maChiCuc, item.giaQdTcdt);
      });
      this.dataTable.forEach((item) => {
        item.tongGiaKdiemDd = 0;
        item.tongTienDtruocDd = 0;
        let donGiaDuocDuyet = 0;
        if (this.loaiVthhCache === LOAI_HANG_DTQG.VAT_TU) {
          const firstItem = this.dataDonGiaDuocDuyet?.[0];
          donGiaDuocDuyet = firstItem?.giaQdTcdt || 0;
        } else {
          donGiaDuocDuyet = donGiaMap.get(item.maDvi);
        }
        item.children.forEach((child) => {
          child.donGiaDuocDuyet = donGiaDuocDuyet || null;
          child.giaKhoiDiemDd = child.soLuongDeXuat * (donGiaDuocDuyet || 0);
          child.soTienDtruocDd = child.soLuongDeXuat * (donGiaDuocDuyet || 0) * this.formData.value.khoanTienDatTruoc / 100;
        });
        item.tongGiaKdiemDd = item.children.reduce((acc, child) => acc + child.giaKhoiDiemDd, 0);
        item.tongTienDtruocDd = item.children.reduce((acc, child) => acc + child.soTienDtruocDd, 0);
      });
    }
    this.formData.patchValue({
      tongTienKhoiDiem: this.dataTable.reduce((acc, item) => acc + item.tongGiaKdiemDd, 0),
      tongTienDatTruoc: this.dataTable.reduce((acc, item) => acc + item.tongTienDtruocDd, 0),
      tongSoLuong: this.dataTable.reduce((acc, item) => acc + item.tongSlXuatBanDx, 0),
    });
  }

  async onChangeThoiGian(event) {
    if (event) {
      this.formData.patchValue({
        tgianDkienTu: this.formatDate(event, 0),
        tgianDkienDen: this.formatDate(event, 1)
      })
    }
    await this.sendDataToParent();
  }

  formatDate(dateRange, index) {
    return dateRange ? dayjs(dateRange[index]).format('YYYY-MM-DD') : null;
  }

  async sendDataToParent() {
    this.countChanged.emit(this.formData.value);
  }

  isDisable() {
    return false;
  }
}
