import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
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

@Component({
  selector: 'app-thong-tin-dieu-chinh',
  templateUrl: './thong-tin-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-dieu-chinh.component.scss']
})
export class ThongTinDieuChinhComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() isCache;
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
      tongSoLuong: [],
      donViTinh: [''],
      tongTienGiaKdTheoDgiaDd: [],
      tongKhoanTienDtTheoDgiaDd: [],
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
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.tongSlXuatBanDx, 0),
      tongTienGiaKdTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongGiaKdiemDd, 0),
      tongKhoanTienDtTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDtruocDd, 0),
    });
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
  }
}
