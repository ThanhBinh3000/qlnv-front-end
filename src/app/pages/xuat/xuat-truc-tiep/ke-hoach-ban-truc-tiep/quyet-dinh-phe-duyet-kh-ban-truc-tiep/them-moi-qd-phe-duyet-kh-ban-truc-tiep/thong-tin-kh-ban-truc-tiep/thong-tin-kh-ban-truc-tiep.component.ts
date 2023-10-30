import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {NgxSpinnerService} from 'ngx-spinner';
import {HelperService} from 'src/app/services/helper.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {
  DialogThemMoiXuatBanTrucTiepComponent
} from 'src/app/components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';
import {STATUS} from "../../../../../../../constants/status";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  QuyetDinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-thong-tin-kh-ban-truc-tiep',
  templateUrl: './thong-tin-kh-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-kh-ban-truc-tiep.component.scss']
})
export class ThongTinKhBanTrucTiepComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() trangThaiQd;
  @Input() isTongHop;
  @Input() loaiVthhCache;
  @Output() countChanged: EventEmitter<any> = new EventEmitter();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  formData: FormGroup
  dataTable: any[] = [];
  dataDonGiaDuocDuyet: any;

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    this.formData = this.fb.group({
      id: [],
      thoiGianDuKien: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tenPthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBao: [''],
      tongSoLuong: [],
      thanhTien: [],
      donViTinh: [''],
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
      nzTitle: '',
      nzContent: DialogThemMoiXuatBanTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.dataInput.loaiVthh,
        cloaiVthh: this.dataInput.cloaiVthh,
        typeLoaiVthh: this.loaiVthhCache,
        donViTinh: this.dataInput.donViTinh,
      },
    });
    modalGT.afterClose.subscribe(async (updatedData) => {
      if (updatedData && index >= 0) {
        this.dataTable[index] = updatedData;
        await this.calculatorTable();
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
        item.tienChiCuc = 0;
        let donGiaDuocDuyet = 0;
        if (this.loaiVthhCache === LOAI_HANG_DTQG.VAT_TU) {
          const firstItem = this.dataDonGiaDuocDuyet?.[0];
          donGiaDuocDuyet = firstItem?.giaQdTcdt || 0;
        } else {
          donGiaDuocDuyet = donGiaMap.get(item.maDvi);
        }
        item.children.forEach((child) => {
          child.donGiaDuocDuyet = donGiaDuocDuyet || null;
          child.thanhTienDuocDuyet = (donGiaDuocDuyet || 0) * child.soLuongDeXuat;
          child.thanhTienDeXuat = child.soLuongDeXuat * child.donGiaDeXuat;
        });
        item.tienChiCuc = item.children.map(child => child.thanhTienDuocDuyet).reduce((prev, cur) => prev + cur, 0);
      });
      this.formData.patchValue({
        tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.tienChiCuc, 0),
      });
    }
    await this.sendDataToParent();
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
