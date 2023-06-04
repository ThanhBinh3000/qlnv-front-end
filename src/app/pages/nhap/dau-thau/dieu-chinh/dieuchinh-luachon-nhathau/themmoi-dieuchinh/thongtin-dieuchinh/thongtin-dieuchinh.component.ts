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

@Component({
  selector: 'app-thongtin-dieuchinh',
  templateUrl: './thongtin-dieuchinh.component.html',
  styleUrls: ['./thongtin-dieuchinh.component.scss']
})
export class ThongtinDieuchinhComponent implements OnInit, OnChanges {

  @Input() title;
  @Input() dataInput;
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
  @Output() objectChange = new EventEmitter<number>();
  tgianBdauTchucChange: Date | null = null;
  tgianNhangChange: Date | null = null;
  tgianDthauChange: Date | null = null;
  tgianMthauChange: Date | null = null;
  tenDuAn: any;
  giaVat: any;
  tienBaoLanh: any;
  tienDamBaoThHd: any;
  tenHangHoa: any;
  tChuanCLuong: any;
  isEditing: boolean = false;
  editingSoLuong: any;
  sumThanhTienTamTinh: any[] = [];
  sumDataSoLuong: any[] = [];

  formData: FormGroup
  listDataGroup: any[] = [];
  listOfData: any[] = [];
  dataTable: any[] = [];


  STATUS: STATUS

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
      vat: [5],
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

    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    let data = null;
    let res = null;
    if (changes) {
      if (this.dataInput) {
        if (!this.isCache && this.dataInput.idDcDxHdr != undefined) {
          data = await this.dieuChinhQuyetDinhPdKhlcntService.getDetail(this.dataInput.idDcDxHdr);
          console.log("hihi ", data)
          if (this.dataInput.soLuong) {
            this.formData.patchValue({
              soLuong: this.dataInput.soLuong,
              tongMucDt: this.dataInput.soLuong * this.dataInput.donGiaVat
            })
          }
          this.listOfData = data.data.children
        }else{
          res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.dataInput.idQdHdr);
          console.log("haha ", res)
          this.listOfData = this.dataInput.children;
        }
        if (data != null && data.msg == MESSAGE.SUCCESS) {
          this.tgianBdauTchucChange = data.data.tgianBdauTchuc
          this.tgianDthauChange = data.data.tgianDthau
          this.tgianMthauChange = data.data.tgianMthau
          this.tgianNhangChange = data.data.tgianNhang
          this.tenDuAn = data.data.children[0].tenDuAn
          this.giaVat = data.data.children[0].donGiaVat
          // this.tienDamBaoThHd = data.data.children[0].dxuatKhLcntHdr.tongMucDtDx * data.data.children[0].dxuatKhLcntHdr.gtriHdong / 100;
          // this.tienBaoLanh = data.data.children[0].dxuatKhLcntHdr.tongMucDtDx + (data.data.children[0].dxuatKhLcntHdr.tongMucDtDx * data.data.children[0].dxuatKhLcntHdr.gtriHdong / 100) + (data.data.children[0].dxuatKhLcntHdr.tongMucDtDx * data.data.children[0].dxuatKhLcntHdr.gtriDthau / 100)
          this.helperService.bidingDataInFormGroup(this.formData, data.data);
          this.formData.patchValue({
            tgianDthau: data.data.tgianDthau,
            tgianMthau: data.data.tgianMthau,
            tgianNhang: data.data.tgianNhang,
            tgianBdauTchuc: data.data.tgianBdauTchuc,
            gtriDthau: data.data.gtriDthau,
            tenHthucLcnt: data.data.tenHthucLcnt,
            tenPthucLcnt: data.data.tenPthucLcnt,
            tenLoaiHdong: data.data.tenLoaiHdong,
            tenDuAn: data.data.children[0].tenDuAn,
            tchuanCluong: data.data.children[0].tchuanCluong,
            tenDvi: data.data.children[0].tenDvi,
          });
        } else if (res != null && res.msg == MESSAGE.SUCCESS) {
          this.tgianBdauTchucChange = res.data.tgianBdauTchuc
          this.tgianDthauChange = res.data.tgianDthau
          this.tgianMthauChange = res.data.tgianMthau
          this.tgianNhangChange = res.data.tgianNhang
          this.tenHangHoa = res.data.moTaHangHoa
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          let soLuong = res.data.tongMucDt / res.data.donGiaVat;
          this.formData.patchValue({
            soLuong: soLuong,
            tongMucDt: soLuong * res.data.donGiaVat,
            tgianDthau: res.data.tgianDthau,
            tgianMthau: res.data.tgianMthau,
            tgianNhang: res.data.tgianNhang,
            tgianBdauTchuc: res.data.tgianBdauTchuc,
            gtriDthau: res.data.gtriDthau,
            tenHthucLcnt: res.data.tenHthucLcnt,
            tenPthucLcnt: res.data.tenPthucLcnt,
            tenLoaiHdong: res.data.tenLoaiHdong,
            tenDuAn: res.data.children[0].tenDuAn,
            tchuanCluong: res.data.children[0].dxuatKhLcntHdr?.tchuanCluong,
          });
          console.log(this.formData.value)
        }
        this.objectChange.emit(this.formData.value)
        this.helperService.setIndexArray(this.listOfData);
        this.convertListDataLuongThuc()
      }
    }
    await this.spinner.hide()
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
    // await this.loadDataComboBox();
    await this.spinner.hide()
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
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

  themMoiGoiThau(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.formData.get('loaiVthh').value,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      if (index >= 0) {
        this.listOfData[index] = res.value;
      } else {
        this.listOfData = [...this.listOfData, res.value];
      }
      let tongMucDt: number = 0;
      let soLuong: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuong * item.donGia;
        soLuong = soLuong + item.soLuong;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        soLuong: soLuong
      });
      this.soLuongChange.emit(soLuong);
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
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


}
