import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  DeXuatKhBanTrucTiepService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../../../../../services/helper.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {
  DialogThemMoiXuatBanTrucTiepComponent
} from "../../../../../../../components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component";
import dayjs from "dayjs";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";

@Component({
  selector: 'app-thong-tin-chi-tiet-dieu-chinh',
  templateUrl: './thong-tin-chi-tiet-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-chi-tiet-dieu-chinh.component.scss']
})
export class ThongTinChiTietDieuChinhComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() isCache;
  @Input() loaiVthhCache;
  @Output() countChanged: EventEmitter<any> = new EventEmitter();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  formData: FormGroup
  dataTable: any[] = [];

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private notification: NzNotificationService,
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
      thongBao: [],
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
        if (this.dataTable && this.dataTable.length > 0) {
          await this.calculatorTable();
        }
      } else {
        this.formData.reset();
      }
      await this.spinner.hide();
    }
  }

  themMoiBangPhanLoTaiSan(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemMoiXuatBanTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.dataInput.loaiVthh,
        cloaiVthh: this.dataInput.cloaiVthh,
        typeLoaiVthh: this.loaiVthhCache
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

  deleteRow(i: number) {
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
          this.dataTable = this.dataTable.filter((item, index) => index != i);
          await this.calculatorTable();
          await this.sendDataToParent();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  calculatorTable() {
    this.dataTable.forEach(item => {
      item.tienChiCuc = 0;
      item.children.forEach(child => {
        child.thanhTienDuocDuyet = child.donGiaDuocDuyet * child.soLuongDeXuat;
        child.thanhTienDeXuat = child.soLuongDeXuat * child.donGiaDeXuat;
      });
      item.tienChiCuc = item.children.map(child => child.thanhTienDuocDuyet).reduce((prev, cur) => prev + cur, 0);
    });
    this.formData.patchValue({
      tongSoLuong: this.dataTable.reduce((acc, item) => acc + item.soLuongChiCuc, 0),
      thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.tienChiCuc, 0),
    });
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
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
}
