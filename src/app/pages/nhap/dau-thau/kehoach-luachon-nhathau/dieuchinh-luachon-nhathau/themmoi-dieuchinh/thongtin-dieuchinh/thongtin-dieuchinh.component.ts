import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Globals } from 'src/app/shared/globals';
import { cloneDeep, chain } from 'lodash';
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import {
  DieuChinhQuyetDinhPdKhlcntService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service";
import * as dayjs from "dayjs";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-thongtin-dieuchinh',
  templateUrl: './thongtin-dieuchinh.component.html',
  styleUrls: ['./thongtin-dieuchinh.component.scss']
})
export class ThongtinDieuchinhComponent implements OnInit, OnChanges {

  @Input() title;
  @Input() dataInput;
  @Input() dataGoc;
  @Output() soLuongChange = new EventEmitter<number>();
  @Input() isView: boolean = false;
  @Input() isCache: boolean = false;
  @Input() isTongHop;
  @Input()
  listNguonVon: any[] = [];
  @Input()
  listPhuongThucDauThau: any[] = [];
  @Input()
  listHinhThucDauThau: any[] = [];
  @Input()
  listLoaiHopDong: any[] = [];
  @Input()
  dataChiTieu: any;
  @Output() objectChange = new EventEmitter<number>();
  tgianBdauTchucChange: Date | null = null;
  tgianNhangChange: Date | null = null;
  tgianDthauChange: Date | null = null;
  tgianMthauChange: Date | null = null;
  tenDuAn: any;
  giaVat: any;
  isEditing: boolean = false;
  editingSoLuong: any;
  sumThanhTienTamTinh: any[] = [];
  sumDataSoLuong: any[] = [];

  formData: FormGroup
  listDataGroup: any[] = [];
  listOfData: any[] = [];
  listOfDataCache: any[] = [];
  dataTable: any[] = [];
  listNam: any[] = [];
  listThuHoachVu: any[] = [];
  listQuocGia: any[] = [];
  listQuy: any[] = [];

  STATUS: STATUS
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dxKhLcntService: DanhSachDauThauService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChiDvi: [],
      namKhoach: [,],
      soDxuat: [null,],
      trichYeu: [null],
      ngayPduyet: [],
      soQd: [,],
      loaiVthh: [,],
      tenLoaiVthh: [,],
      cloaiVthh: [,],
      tenCloaiVthh: [,],
      moTaHangHoa: [,],
      tchuanCluong: [null],
      tenDuAn: [null,],
      loaiHdong: [null,],
      hthucLcnt: [null,],
      pthucLcnt: [null,],
      tgianBdauTchuc: [null,],

      tgianDthau: [null,],
      tgianMthau: [null,],

      gtriDthau: [null,],
      gtriHdong: [null,],
      soLuong: [],
      donGiaVat: [''],
      tongMucDt: [null,],
      nguonVon: [null,],
      tgianNhang: [null,],
      ghiChu: [null],
      ldoTuchoi: [],
      ngayQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      idTrHdr: [''],
      soTrHdr: [''],
      soQdCc: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [''],
      phanLoai: ['', [Validators.required]],
      dienGiai: [''],
      tgianThien: [null],
      yKien: [''],
      tenHthucLcnt: [''],
      tenPthucLcnt: [''],
      tenLoaiHdong: [''],
      tenHangHoa: [''],
      ctietTccl: [''],
      namSxuat: [''],
      thuHoachVu: [''],
      namThuHoach: [''],
      vu: [''],
      quocGiaSx: [''],
      quy: [''],
      thueVat: [''],
      tongMucDtLamTron: [],
      tongMucDtDx: [],
      tongMucDtDxLamTron: [],
      tenNguonVon: [],
      tgianMthauTime: [],
      tgianDthauTime: [],
      tgianMoHoSoTime: [],
      tgianMoHoSo: [],
      giaBanHoSo: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    let data = null;
    if (changes) {
      if (this.dataInput && this.dataGoc) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.formData.patchValue({
          tenDuAn: this.dataGoc.dxuatKhLcntHdr?.tenDuAn,
          tenDvi: this.dataGoc.dxuatKhLcntHdr?.tenDvi,
          tenHangHoa: this.dataGoc.dxuatKhLcntHdr?.moTaHangHoa,
          tchuanCluong: this.dataGoc.dxuatKhLcntHdr?.tchuanCluong,
          ctietTccl: this.dataGoc.dxuatKhLcntHdr?.ctietTccl,
          namSxuat: this.dataGoc.dxuatKhLcntHdr?.namSxuat,
          vu: this.dataGoc.dxuatKhLcntHdr?.vu,
          thuHoachVu: this.dataGoc.dxuatKhLcntHdr?.thuHoachVu,
          quocGiaSx: this.dataGoc.dxuatKhLcntHdr?.quocGiaSx,
          namThuHoach: this.dataGoc.dxuatKhLcntHdr?.namThuHoach,
          quy: this.dataGoc.dxuatKhLcntHdr?.quy,
          thueVat: this.dataGoc.dxuatKhLcntHdr?.thueVat,
          tgianDthau: this.dataInput.tgianDthau,
          tgianMthau: this.dataInput.tgianMthau,
          tgianNhang: this.dataInput.tgianNhang,
          tgianBdauTchuc: this.dataInput.tgianBdauTchuc,
          tenLoaiHdong: this.dataGoc.dxuatKhLcntHdr?.tenLoaiHdong,
          tenHthucLcnt: this.dataGoc.dxuatKhLcntHdr?.tenHthucLcnt,
          tenPthucLcnt: this.dataGoc.dxuatKhLcntHdr?.tenPthucLcnt,
          namKhoach: this.dataGoc.dxuatKhLcntHdr?.namKhoach,
          gtriDthau: this.dataGoc.dxuatKhLcntHdr?.gtriDthau,
          gtriHdong: this.dataGoc.dxuatKhLcntHdr?.gtriHdong,
          loaiVthh: this.dataGoc.dxuatKhLcntHdr?.loaiVthh,
          cloaiVthh: this.dataGoc.dxuatKhLcntHdr?.cloaiVthh,
          tenCloaiVthh: this.dataGoc.dxuatKhLcntHdr?.tenCloaiVthh,
          tgianDthauTime: this.dataInput.tgianDthauTime,
          tgianMthauTime: this.dataInput.tgianMthauTime,
          tgianMoHoSoTime: this.dataInput.tgianMoHoSoTime,
          tgianMoHoSo: this.dataInput.tgianMoHoSo,
          giaBanHoSo: this.dataInput.giaBanHoSo,
        });
        this.listOfData = [...this.dataInput.children];
        this.initListQuy();
        this.tinhTongMucDtDx();
      }
    }
    await this.spinner.hide()
  }

  initListQuy() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const quarters = [];

    for (let quarter = 1; quarter <= 4; quarter++) {
      if (this.formData.get('namKhoach').value < currentYear || (this.formData.get('namKhoach').value === currentYear && quarter <= Math.ceil((currentMonth + 1) / 3))) {
        quarters.push(quarter);
      }
    }
    this.listQuy = [];
    for (const element of quarters) {
      this.listQuy.push({ giaTri: "Quý " + element + "/" + this.formData.get("namKhoach").value, ma: element})
    }
  }
  onDateChanged(value: any, type: any) {
    if (type == 'tgianBdauTchuc') {
      this.formData.get('tgianBdauTchuc').setValue(value);
    } else if (type == 'tgianMthau') {
      this.formData.get('tgianMthau').setValue(value);
    } else if (type == 'tgianDthau') {
      this.formData.get('tgianDthau').setValue(value);
    } else if (type == 'tgianNhang') {
      this.formData.get('tgianNhang').setValue(value);
    }
    this.objectChange.emit(this.formData.value)
  }

  convertListDataLuongThuc() {
    let listChild = [];
    this.listOfData.forEach(item => {
      item.children.forEach(i => {
        if(item.idDxDcHdr != undefined){
          i.children.forEach(h =>{
            h.goiThau = i.goiThau
            listChild.push(h)
          })
        }else{
          i.goiThau = item.goiThau
          listChild.push(i)
        }
      })
    })
    this.helperService.setIndexArray(listChild);
    this.listDataGroup = chain(listChild).groupBy('tenDvi').map((value, key) => (
      {
        tenDvi: key,
        soLuongTheoChiTieu: value[0].soLuongTheoChiTieu,
        soLuong: null,
        sumThanhTienTamTinh: null,
        soLuongDaMua: value[0].soLuongDaMua,
        dataChild: value
      })).value()
    this.listDataGroup.forEach(item => {
      let sluong = 0;
      let sumThanhTienTamTinh = 0;
      item.dataChild.forEach(i => {
        sluong = sluong + i.soLuong
        sumThanhTienTamTinh = sumThanhTienTamTinh + i.soLuong * (i.donGiaTamTinh ? i.donGiaTamTinh : i.donGia)
      })
      item.soLuong = sluong;
      item.sumThanhTienTamTinh = sumThanhTienTamTinh;
    })
    console.log(this.listDataGroup)
    this.sumThanhTien()
  }

  sumThanhTien() {
    var sum = 0;
    var sumSl = 0;
    let sumDataSoLuong = 0;
    let sumThanhTienTamTinh = 0;
    this.sumDataSoLuong = []
    this.sumThanhTienTamTinh = []
    this.listDataGroup.forEach(item => {
      sumDataSoLuong = 0;
      sumThanhTienTamTinh = 0;
      item.dataChild.forEach(res => {
        res.soLuong = sumSl
        res.children.forEach(data => {
          sum += (res.donGiaTamTinh != null ?
            res.donGiaTamTinh * data.soLuong : (res.donGiaVat != null ? res.donGiaVat *
              data.soLuong : (res.donGia != null ? res.donGia * data.soLuong : 0)));
          sumSl += data.soLuong;
          sumDataSoLuong += data.soLuong;
          sumThanhTienTamTinh += (res.donGiaTamTinh != null ?
            res.donGiaTamTinh * data.soLuong : (res.donGiaVat != null ? res.donGiaVat *
              data.soLuong : (res.donGia != null ? res.donGia * data.soLuong : 0)));
        })
      })
      this.sumDataSoLuong.push(sumDataSoLuong)
      this.sumThanhTienTamTinh.push(sumThanhTienTamTinh)
    })
    // this.formData.get('tongMucDtDx').setValue(sum);
    // this.formData.get('soLuong').setValue(sumSl);
    // this.tongSLuongNhap = sumSl;
    // this.tongTienTamTinh = sum;
    this.soLuongChange.emit(sumSl);
    // this.donGiaTamTinhOut.emit(this.formData.get('tongMucDtDx').value)
  }

  convertListData() {

  }

  async ngOnInit() {
    await this.spinner.show()
    await this.loadDataComboBox();
    await this.spinner.hide()
  }

  async loadDataComboBox() {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.listThuHoachVu = [];
    let resVu = await this.danhMucService.danhMucChungGetAll('VU_THU_HOACH');
    if (resVu.msg == MESSAGE.SUCCESS) {
      this.listThuHoachVu = resVu.data;
    }
    this.listQuocGia = [];
    let resQg = await this.danhMucService.danhMucChungGetAll('QUOC_GIA');
    if (resQg.msg == MESSAGE.SUCCESS) {
      this.listQuocGia = resQg.data;
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

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }


  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }

  themMoiGoiThau($event: any, goiThau?: any) {
    $event.stopPropagation();
    let data = [];
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau)
      if (goiThau && goiThau != '' && item.goiThau == goiThau) {
        data.push(item)
      }
    })
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau]
    let disabledGoiThau = false;
    if (goiThau && goiThau != '') {
      disabledGoiThau = true;
    }
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzClassName: 'dialog-luong-thuc',
      nzComponentParams: {
        disabledGoiThau: disabledGoiThau,
        listGoiThau: listGoiThau,
        dataEdit: data,
        dataAll: this.listOfData,
        loaiVthh: this.formData.get('loaiVthh').value,
        dataChiTieu: this.dataChiTieu,
        cloaiVthh: this.formData.get('cloaiVthh').value,
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        namKhoach: this.formData.get('namKhoach').value,
        donGiaVat: this.formData.get('donGiaVat').value,
        showFromQd: true
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      let isReplace = false;
      if (res.value.goiThau && res.value.goiThau != '') {
        for (let i = 0; i < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.value.goiThau) {
            this.listOfData.splice(i, 1, res.value)
            isReplace = true;
          }
        }
      }
      if (isReplace == false) {
        this.listOfData = [...this.listOfData, res.value]
      }
      this.tinhTongMucDtDx()
    });
  };

  onInput(event: any) {
    var value: any;
    value = event;
    this.editingSoLuong = parseInt(value.replaceAll('.', ''));
  }

  editRow(res: any) {
    this.isEditing = true;
    this.editingSoLuong = res.soLuong;
  }


  onBlur(res: any) {
    res.soLuong = this.editingSoLuong;
    this.isEditing = false;
    this.sumThanhTien();
  }

  disabledDate = (current: Date): boolean => {
    const startDate = new Date(this.formData.get("namKhoach").value, (this.formData.get("quy").value - 1) * 3, 1);
    const endDate = new Date(this.formData.get("namKhoach").value, this.formData.get("quy").value * 3, 0);
    return current < startDate || current > endDate;
  };

  tinhTongMucDtDx () {
    let tongMucDt: number = 0;
    let tongMucDtDx: number = 0;
    let tongSl: number = 0;
    this.listOfData.forEach((item) => {
      item.children.forEach(i => {
        tongMucDt = tongMucDt + (i.soLuong * i.donGia *1000);
        tongMucDtDx = tongMucDtDx + (i.soLuong * i.donGiaTamTinh * 1000);
        tongSl += i.soLuong
      })
    });
    this.formData.patchValue({
      tongMucDtLamTron: parseFloat((tongMucDt/1000000000).toFixed(2)),
      tongMucDtDxLamTron: parseFloat((tongMucDtDx/1000000000).toFixed(2)),
      tongMucDt: tongMucDt,
      tongMucDtDx: tongMucDtDx,
      soLuong: tongSl,
    });
  }

  deleteGoiThau(i:number) {
    this.listOfData.splice(i, 1)
    this.tinhTongMucDtDx()
  }

  deleteDiemKho(i:number, y:number, z:number) {
    this.listOfData[i].children[y].children.splice(z, 1)
    if (this.listOfData[i].children[y].children.length > 0) {
      let soLuong = 0;
      this.listOfData[i].children[y].children.forEach(item => {
        soLuong += item.soLuong
      })
      this.listOfData[i].children[y].soLuong = soLuong;
    } else {
      this.listOfData[i].children.splice(y, 1)
    }
    if (this.listOfData[i].children.length > 0) {
      let soLuongGoiThau = 0;
      this.listOfData[i].children.forEach(chiCuc => {
        soLuongGoiThau += chiCuc.soLuong
      })
      this.listOfData[i].soLuong = soLuongGoiThau
    }
    this.tinhTongMucDtDx()
  }

  deleteChiCuc(i:number, y:number) {
    this.listOfData[i].children.splice(y, 1)
    this.tinhTongMucDtDx()
  }

  calcTongSl() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * item.donGia;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTienDx() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTienBaoLanh() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTamTinh * this.formData.value.gtriDthau / 100;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }
}
