import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {MESSAGE} from "../../../../../../../constants/message";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
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
import {DanhSachMuaTrucTiepService} from 'src/app/services/danh-sach-mua-truc-tiep.service';
import {
  DialogThemMoiKeHoachMuaTrucTiepComponent
} from 'src/app/components/dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component';
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";

@Component({
  selector: 'app-thongtin-dexuat-muatt',
  templateUrl: './thongtin-dexuat-muatt.component.html',
  styleUrls: ['./thongtin-dexuat-muatt.component.scss']
})
export class ThongtinDexuatMuattComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Output() objectChange = new EventEmitter<number>();
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;
  @Input() dataChiTieu;

  formData: FormGroup
  dataTable: any[] = [];
  listNguonVon: any[] = [];
  tgianMkhoChange: Date | null = null;
  tgianKthucChange: Date | null = null;

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private spinner: NgxSpinnerService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private helperService: HelperService,
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      namKh: [dayjs().get('year'),],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      ptMua: [''],
      tchuanCluong: [''],
      giaMua: [''],
      donGia: [''],
      thueGtgt: ['5'],
      donGiaVat: [],
      tgianMkho: [''],
      tgianKthuc: [''],
      ghiChu: [''],
      tongMucDt: [],
      tongSoLuong: [],
      nguonVon: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.tgianMkhoChange = this.dataInput.tgianMkho
        this.tgianKthucChange = this.dataInput.tgianKthuc
        console.log(this.dataInput.children)
        this.dataTable = this.dataInput.children
        this.calculatorTable();
      } else {
        this.formData.reset();
      }
    }
    await this.loadDataComboBox();
    await this.spinner.hide()
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themMoiBangPhanLoTaiSan(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemMoiKeHoachMuaTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataAll: this.dataTable,
        dataChiTieu: this.dataChiTieu,
        namKh: this.formData.get('namKh').value,
        loaiVthh: this.formData.get('loaiVthh').value,
        donGiaVat: this.formData.value.donGiaVat,
        maDviCuc: this.formData.value.maDvi
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      const existingIndex = this.dataTable.findIndex(item => item.maDvi === data.maDvi);
      if (existingIndex !== -1) {
        this.dataTable[existingIndex] = { ...data, children: this.dataTable[existingIndex].children };
      } else {
        this.dataTable.push(data);
      }
      this.calculatorTable();
    });
  }

  calculatorTable() {
    let tongMucDt: number = 0;
    let tongSoLuong: number = 0;
    this.dataTable.forEach((item) => {
      let soLuongChiCuc = 0;
      item.children.forEach(child => {
        soLuongChiCuc += child.soLuong;
        tongSoLuong += child.soLuong;
        tongMucDt += child.soLuong * child.donGia * 1000
      })
      item.soLuong = soLuongChiCuc;
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
      tongMucDt: tongMucDt,
    });
  }

  isDisable() {
    return false;
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  onDateChanged(value: any, type: any) {
    if (type == 'tgianMkho') {
      this.formData.get('tgianMkho').setValue(value);
    } else if (type == 'tgianKthuc') {
      this.formData.get('tgianKthuc').setValue(value);
    }
    this.objectChange.emit(this.formData.value)
  }


}
