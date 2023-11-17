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
import {
  QuyetDinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";

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
  @Output()
  dataTableChange = new EventEmitter<any>();

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
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
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
        debugger
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.tgianMkhoChange = this.dataInput.tgianMkho
        this.tgianKthucChange = this.dataInput.tgianKthuc

        console.log(this.dataInput.children, "123")
        this.dataTable = this.dataInput.children
        await this.getGiaCuThe(this.formData.value.maDvi);
        this.calculatorTable();
        this.sumTongMucDt();
      } else {
        this.formData.reset();
      }
    }
    await this.loadDataComboBox();
    await this.spinner.hide()
  }

  sumTongMucDt(){
    let sum = 0;
    this.dataInput.children.forEach(item =>{
      sum += item.donGiaVat * item.tongSoLuong * 1000
    })
    this.formData.patchValue({
      tongMucDt: sum
    })
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
    console.log(this.formData.value, "formData")
    const modalGT = this.modal.create({
      nzTitle: 'THÊM ĐỊA ĐIỂM NHẬP KHO',
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
        cloaiVthh: this.formData.get('cloaiVthh').value,
        donGiaVat: this.formData.value.donGiaVat,
        maDviCuc: this.formData.value.maDvi
      },
    });
    // modalGT.afterClose.subscribe((data) => {
    //   if (!data) {
    //     return;
    //   }
    //   const existingIndex = this.dataTable.findIndex(item => item.maDvi === data.maDvi);
    //   if (existingIndex !== -1) {
    //     this.dataTable[existingIndex] = { ...data, children: this.dataTable[existingIndex].children };
    //   } else {
    //     this.dataTable.push(data);
    //   }
    //   this.emitDataTable();
    //   this.calculatorTable();
    // });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        // if (!this.validateAddDiaDiem(data)) {
        //   return
        // }
        console.log(data, "popup")
        this.dataTable.push(data);
      }
      this.calculatorTable();
      this.sumTongMucDt();
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
          this.emitDataTable()
          this.calculatorTable();
          console.log(this.dataTable)
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  calcTongThanhTien(index: any) {
    if (this.dataTable) {
      let sum = 0
      for (let i = 0; i < this.dataTable[index].children.length; i++) {
        sum += this.dataTable[index].children[i].soLuong;
      }
      return sum;
    }
  }

  calculatorTable() {
    let sum = 0;
    this.dataTable.forEach(item =>{
      sum += Number.parseInt(item.tongSoLuong)
    })
  this.formData.patchValue({
    tongSoLuong: sum
  })
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  isDisable() {
    return false;
  }

  convertTienTobangChu(tien: any): string {
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

  async getGiaCuThe(maDvi?: any) {
    let body = {
      loaiGia: "LG03",
      namKeHoach: this.formData.get('namKh').value,
      maDvi: maDvi,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(body)
    if (pag.msg == MESSAGE.SUCCESS && pag.data.length > 0) {
      const data = pag.data;
      this.dataTable.forEach(item => {
        let dataVat = data.find(x => x.maChiCuc == item.maDvi)
        let donGiaVatQd = 0;
        if (dataVat != null && dataVat.giaQdDcTcdtVat != null && dataVat.giaQdDcTcdtVat > 0) {
          donGiaVatQd = dataVat.giaQdDcTcdtVat
        } else {
          donGiaVatQd = dataVat.giaQdTcdtVat
        }
        item.donGiaVat = donGiaVatQd
        console.log(item.donGiaVat, "1")
      })
    }

  }


}
