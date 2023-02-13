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
  @Input() isCache: boolean = false;
  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listDataGroupCache: any[] = [];
  hhQdPheduyetKhMttDxList: any[] = [];
  listOfData: any[] = [];
  listOfDataCache: any[] = [];
  STATUS: STATUS;


  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
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
        let res;
        if (this.isCache) {
          res = await this.danhSachMuaTrucTiepService.getDetail(this.dataInput.idDxHdr);
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data)
            this.formData.patchValue({
              hhDcQdPduyetKhmttSlddList: res.data.dsSlddDtlList,
            })
          }
        } else {
          this.updateDonGiaVat()
          this.formData.patchValue(this.dataInput);
          this.formData.patchValue({
            hhDcQdPduyetKhmttSlddList: this.dataInput.children,
            donGiaVat: this.formData.value.donGia + (this.formData.value.donGia * this.formData.value.thueGtgt / 100)
          })
        }
        // for (let i = 0; i < this.formData.value.hhDcQdPduyetKhmttSlddList.length; i++) {
        //   this.expandSet.add(i);
        // }
      } else {
        this.formData.reset();
      }
    }
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

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
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
}
