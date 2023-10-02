import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { chain } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { Globals } from "../../../../../../../shared/globals";
import { DieuChinhQuyetDinhPdKhmttService } from './../../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/dieuchinh-khmtt/DieuChinhQuyetDinhPdKhmtt.service';
import { STATUS } from 'src/app/constants/status';
import { DanhSachMuaTrucTiepService } from './../../../../../../../services/danh-sach-mua-truc-tiep.service';
import { ChiTietList } from './../../../../../../../models/QdPheDuyetKHBanDauGia';
import {
  DialogThemMoiKeHoachMuaTrucTiepComponent
} from "../../../../../../../components/dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component";
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import {
  QuyetDinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";

@Component({
  selector: 'app-thongtin-dieuchinh',
  templateUrl: './thongtin-dieuchinh.component.html',
  styleUrls: ['./thongtin-dieuchinh.component.scss']
})
export class ThongtinDieuchinhComponent implements OnInit, OnChanges {


  @Input() title;
  @Input() dataInput;
  @Input('isView') isView: boolean;
  @Output() dataChild = new EventEmitter<any>();
  @Output() data = new EventEmitter<any>();
  @Output() objectChange = new EventEmitter<number>();
  @Input() isCache: boolean = false;
  @Input() dataChiTieu;
  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listDataGroupCache: any[] = [];
  hhQdPheduyetKhMttDxList: any[] = [];
  listOfData: any[] = [];
  listOfDataCache: any[] = [];
  STATUS: STATUS;
  tgianMkhoChange: Date | null = null;
  tgianKthucChange: Date | null = null;
  dataTable: any[] = [];
  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private dieuChinhQuyetDinhPdKhmttService: DieuChinhQuyetDinhPdKhmttService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      idDxuat: [''],
      idQdHdr: [''],
      maDvi: [''],
      tenDvi: [''],
      diaChiDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      namKh: [],
      soDxuat: [null],
      trichYeu: [null],
      ngayTao: [],
      ngayPduyet: [],
      ngayKy: [],
      tenDuAn: [null,],
      soQd: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [,],
      moTaHangHoa: [],
      ptMua: [null],
      tchuanCluong: [null],
      giaMua: [],
      donGia: [],
      donGiaVat: [],
      thueGtgt: [],
      tgianMkho: [],
      tgianKthuc: [],
      ghiChu: [null],
      tongMucDt: [],
      tongSoLuong: [],
      nguonVon: [],
      tenChuDt: [],
      moTa: [],
      maDiemKho: [],
      diaDiemKho: [],
      soLuongCtieu: [],
      soLuongKhDd: [],
      soLuong: [],
      thanhTien: [],
      hhDcQdPduyetKhmttSlddList: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.tgianMkhoChange = this.dataInput.tgianMkho
        this.tgianKthucChange = this.dataInput.tgianKthuc
        await this.getPag(this.dataInput);
        console.log(this.dataInput)
        this.dataTable = this.dataInput.children
        this.calculatorTable();
      } else {
        this.formData.reset();
      }
    }
    await this.loadDataComboBox();
    await this.spinner.hide()
  }

  updateDonGiaVat() {
    let dt = this.formData.value;
    dt.donGiaVat = (dt.donGia + (dt.donGia * dt.thueGtgt / 100));
    this.formData.patchValue({
      donGiaVat: dt.donGiaVat,
      tongMucDt: dt.donGiaVat * dt.tongSoLuong * 1000,
    })
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()

  }

  async ngOnInit() {
    await this.spinner.show()
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


  calcTong() {
    let dt = this.formData.value.hhDcQdPduyetKhmttSlddList
    let tong = 0;
    dt.forEach(e => {
      const sum = e.children.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      tong += sum;
      this.dataChild.emit(this.formData.value.hhDcQdPduyetKhmttSlddList)
      this.formData.patchValue({
        tongSoLuong: tong,
        tongMucDt: tong * this.formData.value.donGiaVat * 1000
      })
      this.data.emit(this.formData.value)

    });
    return tong;
  }

  OnChangesAll() {
    this.data.emit(this.formData.value)
    this.dataChild.emit(this.formData.value.hhDcQdPduyetKhmttSlddList)
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async getPag(data:any){
    let bodyPag = {
      namKeHoach: data.namKh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      trangThai: STATUS.BAN_HANH,
      maDvi: data.maDvi,
      loaiGia: 'LG03'
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
    console.log("pag", pag)
    if (pag.msg === MESSAGE.SUCCESS) {
      if (pag.data) {
        let giaCuThe = 0;
        pag.data.forEach(i => {
          let giaQdTcdtVat = 0;
          if (i.giaQdDcTcdtVat != null && i.giaQdDcTcdtVat > 0) {
            giaQdTcdtVat = i.giaQdDcTcdtVat
          } else {
            giaQdTcdtVat = i.giaQdTcdtVat
          }
          if (giaQdTcdtVat > giaCuThe) {
            giaCuThe = giaQdTcdtVat;
          }
        })
        this.formData.patchValue({
          donGiaVat: giaCuThe
        })
      }
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
        donGiaVat: this.formData.get('donGiaVat').value,
        namKh: this.formData.get('namKh').value,
        loaiVthh: this.formData.get('loaiVthh').value,
        cloaiVthh: this.formData.get('cloaiVthh').value,
        maDviCuc: this.formData.value.maDvi
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      if (index && index >= 0) {
        this.dataTable[index] = data;
      }else{
        for (let i = 0; i < this.dataTable.length; i++) {
          if(this.dataTable[i].maDvi == data.maDvi){
            this.dataTable[i] = data
          }
        }
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
