import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../../../../../services/helper.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {
  DialogThemDiaDiemPhanLoComponent
} from "../../../../../../../components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component";
import {
  QuyetDinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import dayjs from "dayjs";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";

@Component({
  selector: 'app-thong-tin-dieu-chinh',
  templateUrl: './thong-tin-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-dieu-chinh.component.scss']
})
export class ThongTinDieuChinhComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() trangThaiDc;
  @Input() isCache;
  @Input() loaiVthhCache;
  @Output() countChanged: EventEmitter<any> = new EventEmitter();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  formData: FormGroup
  dataTable: any[] = [];

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
      thongBao: [],
      khoanTienDatTruoc: [],
      tongSoLuong: [null],
      tongTienKhoiDiem: [null],
      tongTienDatTruoc: [null],
      donViTinh: [null],
    })
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

  async themMoiBangPhanLoTaiSan(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: '',
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

  async calculatorTable() {
    for (const item of this.dataTable) {
      item.children.forEach((child) => {
        child.giaKhoiDiemDd = child.soLuongDeXuat * child.donGiaDuocDuyet;
        child.soTienDtruocDd = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
      });
      item.tongGiaKdiemDd = item.children.reduce((prev, cur) => prev + cur.giaKhoiDiemDd, 0);
      item.tongTienDtruocDd = item.children.reduce((prev, cur) => prev + cur.soTienDtruocDd, 0);
    }
    this.formData.patchValue({
      tongTienKhoiDiem: this.dataTable.reduce((acc, item) => acc + item.tongGiaKdiemDd, 0),
      tongTienDatTruoc: this.dataTable.reduce((acc, item) => acc + item.tongTienDtruocDd, 0),
      tongSoLuong: this.dataTable.reduce((acc, item) => acc + item.tongSlXuatBanDx, 0),
    });
    await this.sendDataToParent();
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
