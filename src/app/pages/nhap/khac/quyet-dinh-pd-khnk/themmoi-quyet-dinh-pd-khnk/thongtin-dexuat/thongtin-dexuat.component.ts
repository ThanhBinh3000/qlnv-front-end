import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { cloneDeep, chain } from 'lodash';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from 'dayjs';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { DatePipe } from '@angular/common';
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {Globals} from "../../../../../../shared/globals";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogThemMoiVatTuComponent
} from "../../../../../../components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component";
import {DANH_MUC_LEVEL} from "../../../../../luu-kho/luu-kho.constant";
import {UserService} from "../../../../../../services/user.service";
import {UserLogin} from "../../../../../../models/userlogin";
import {DonviService} from "../../../../../../services/donvi.service";
import {OldResponseData} from "../../../../../../interfaces/response";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {MangLuoiKhoService} from "../../../../../../services/qlnv-kho/mangLuoiKho.service";
import {LOAI_HINH_NHAP_XUAT} from "../../../../../../constants/config";


@Component({
  selector: 'app-thongtin-dexuat',
  templateUrl: './thongtin-dexuat.component.html',
  styleUrls: ['./thongtin-dexuat.component.scss']
})
export class ThongtinDexuatComponent implements OnInit, OnChanges {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Output() donGiaTamTinhOut = new EventEmitter<number>();
  @Output() objectChange = new EventEmitter<number>();
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listOfData: any[] = [];
  isEditing: boolean = false;
  editingSoLuong: any;
  listDataDetail: any[] = [];
  listDataCuc: any[] = [];
  listDataChiCuc: any[] = [];
  listData: any[] = [];
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
  tongTienTamTinh: any;
  tongSLuongNhap: any;
  sumDataSoLuong: any[] = [];
  sumThanhTienTamTinh: any[] = [];
  userInfo: UserLogin;
  isTongCuc: any;
  listDonVi: any = {};
  listCuc: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  isEditRowThemMoi: boolean = false;
  rowThemMoi: any = {};
  isVisible: boolean = false;
  listLoaiVthh: any[] = [];
  listCloaiVthh: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  loaiHinhNhapXuat = LOAI_HINH_NHAP_XUAT;
  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dxKhLcntService: DanhSachDauThauService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private userService: UserService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private mangLuoiKhoService: MangLuoiKhoService
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
      tongMucDtDx: [null,],
      nguonVon: [null,],
      tgianNhang: [null,],
      ghiChu: [null],
      ldoTuchoi: [],
      tongSlNhap: [null],
      tongThanhTien: [null],
      tenLoaiHinhNx: [null]
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    this.userInfo = this.userService.getUserLogin();
    let data = null;
    let res = null;
    if (changes) {
      if (this.dataInput) {
        this.formData.patchValue({
          loaiHinhNx: this.dataInput.loaiHinhNx,
          tenLoaiHinhNx: this.dataInput.tenLoaiHinhNx,
          tongSlNhap: this.dataInput.tongSlNhap,
          tongThanhTien: this.dataInput.tongThanhTien
        })
        console.log(this.dataInput, 333)
        this.listOfData = this.dataInput.details;
        // this.convertListData();
        await this.loadDsDonVi();
        await this.loadData();
        this.convertListDataLuongThuc()
      } else {
        this.formData.reset();
        this.formData.patchValue({
          vat: 5
        });
      }
    }
    await this.spinner.hide()
  }

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
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

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }
  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.layDonViTheoCapDo(body);
    this.listDonVi = res;
    if (this.userService.isTongCuc()) {
      this.listCuc = res[DANH_MUC_LEVEL.CUC];
      this.listCuc = this.listCuc.filter(item => item.type != "PB");
    } else {
      this.listChiCuc = res[DANH_MUC_LEVEL.CHI_CUC];
      this.listChiCuc = this.listChiCuc.filter(item => item.type != "PB");
    }
  }

  convertListDataLuongThuc() {
    this.helperService.setIndexArray(this.listOfData);
    if (this.userService.isTongCuc()) {
      this.listDataGroup = chain(this.listOfData).groupBy("maCuc").map((value, key) => (
        {
          tenCuc: this.listDonVi[DANH_MUC_LEVEL.CUC].find(i => i.maDvi == key)?.tenDvi,
          maCuc: key,
          children: value
        }))
        .value();
      this.listDataGroup.forEach(cuc => {
        cuc.children = chain(cuc.children).groupBy("maChiCuc").map((value, key) => (
          {
            tenChiCuc: this.listDonVi[DANH_MUC_LEVEL.CHI_CUC].find(i => i.maDvi == key)?.tenDvi,
            maChiCuc: key,
            children: value
          }))
          .value();
        cuc.children.forEach(chiCuc => {
          chiCuc.children = chain(chiCuc.children).groupBy("maDiemKho").map((value, key) => (
            {
              tenDiemKho: this.listDonVi[DANH_MUC_LEVEL.DIEM_KHO].find(i => i.maDvi == key)?.tenDvi,
              maDiemKho: key,
              children: value
            }))
            .value();
          chiCuc.children.forEach(diemKho => {
            diemKho.children.forEach(nganLo => {
              if (nganLo.maLoKho != null) {
                nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.LO_KHO].find(i => i.maDvi == nganLo.maLoKho).tenDvi + " - "
                  + this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
              } else {
                nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
              }
            });
          });
        });
      });
    }
    // this.sumThanhTien()
  }

  tinhTongSlVaThanhTien (){
    let tongSl = 0;
    let tongThanhTien = 0;
    this.listOfData.forEach(i => {
      if (this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.DOI_THUA) {
        tongSl += i.slDoiThua;
        tongThanhTien += i.slDoiThua * i.donGia;
      } else if (this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.NHAP_TANG_SO_LUONG_SAU_KK) {
        tongSl += (i.slTonKhoThucTe - i.slTonKho);
        tongThanhTien += (i.slTonKhoThucTe - i.slTonKho) * i.donGia;
      } else {
        tongSl += i.slNhap;
        tongThanhTien += i.slNhap * i.donGia;
      }
    })
    this.formData.get("tongSlNhap").setValue(tongSl);
    this.formData.get("tongThanhTien").setValue(tongThanhTien);
  }
  async loadData() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
      this.listCloaiVthh = res.data?.filter((x) => x.ma.length == 6);
    }
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_KHAC");
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
  }

  async themMoi(data?) {
    if (data) {
      this.rowThemMoi = cloneDeep(data);
      this.rowThemMoi.tenCloaiVthh = data.tenCloaiVthh
      this.isEditRowThemMoi = true;
      if (this.userService.isTongCuc()) {
        this.listChiCuc = this.listCuc.find(item => item.maDvi == this.rowThemMoi.maCuc).children;
        if (this.listChiCuc.length > 0) {
          this.listChiCuc = this.listChiCuc.filter(chiCuc => chiCuc.type != "PB");
        }
        await this.loadListDviThemMoi()
      } else {
        await this.loadListDviThemMoi()
      }
    } else {
      this.isEditRowThemMoi = false;
    }
    if (this.formData.get("tenLoaiHinhNx").value) {
      this.rowThemMoi.title = this.formData.get("tenLoaiHinhNx").value;
    } else {
      this.rowThemMoi.title = "Thêm mới chi tiết đề xuất kế hoạch nhập khác";
    }
    this.isVisible = true;
  }

  async loadListDviThemMoi() {
    this.listDiemKho = this.listChiCuc.find(item => item.maDvi == this.rowThemMoi.maChiCuc).children;
    if (this.listDiemKho.length > 0) {
      this.listDiemKho = this.listDiemKho.filter(i => i.type != "PB");
    }
    this.listNhaKho = this.listDiemKho.find(item => item.maDvi == this.rowThemMoi.maDiemKho).children;
    if (this.listNhaKho.length > 0) {
      this.listNhaKho = this.listNhaKho.filter(i => i.type != "PB");
    }
    this.listNganKho = this.listNhaKho.find(item => item.maDvi == this.rowThemMoi.maNhaKho).children;
    if (this.listNganKho.length > 0) {
      this.listNganKho = this.listNganKho.filter(i => i.type != "PB");
    }
    this.listLoKho = this.listNganKho.find(item => item.maDvi == this.rowThemMoi.maNganKho).children;
    if (this.listLoKho.length > 0) {
      this.listLoKho = this.listLoKho.filter(i => i.type != "PB");
    }
    if(this.rowThemMoi.maLoKho){
      await this.loadThongTinNganLoKho(this.rowThemMoi.maLoKho, DANH_MUC_LEVEL.LO_KHO);
    } else {
      await this.loadThongTinNganLoKho(this.rowThemMoi.maNganKho, DANH_MUC_LEVEL.NGAN_KHO);
    }
  }

  async loadThongTinNganLoKho(event, level) {
    let body = {
      maDvi: event,
      capDvi: level
    };
    await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let loKhoDetail = res.data.object;
        this.rowThemMoi.loaiVthh = loKhoDetail.loaiVthh;
        this.rowThemMoi.tenLoaiVthh = this.listLoaiVthh.find(item => item.ma == loKhoDetail.loaiVthh)?.ten;
        this.rowThemMoi.cloaiVthh = loKhoDetail.cloaiVthh;
        this.rowThemMoi.tenCloaiVthh = this.listCloaiVthh.find(item => item.ma == loKhoDetail.cloaiVthh)?.ten;
        this.rowThemMoi.dvt = loKhoDetail.dviTinh;
        this.rowThemMoi.slTonKho = loKhoDetail.slTon;
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }

  deleteRow(ma: string, data: any) {
    if (ma == 'cuc' && data.maCuc) {
      this.listOfData = this.listOfData.filter(i=> i.maCuc != data.maCuc)
    }
    if (ma == 'chiCuc' && data.maChiCuc) {
      this.listOfData = this.listOfData.filter(i=> i.maChiCuc != data.maChiCuc)
    }
    if (ma == 'diemKho' && data.maDiemKho) {
      this.listOfData = this.listOfData.filter(i=> i.maDiemKho != data.maDiemKho)
    }
    if (ma == 'nhaKho' && data.maNhaKho) {
      this.listOfData = this.listOfData.filter(i=> i.maNhaKho != data.maNhaKho)
    }
    this.convertListDataLuongThuc();
  }

  changeCuc(event) {
    if (event) {
      this.rowThemMoi.maChiCuc = null;
      this.rowThemMoi.maDiemKho = null;
      this.rowThemMoi.maNhaKho = null;
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listChiCuc = this.listCuc.find(item => item.maDvi == event).children;
      if (this.listChiCuc.length > 0) {
        this.listChiCuc = this.listChiCuc.filter(chiCuc => chiCuc.type != "PB");
      }
      this.listDiemKho = [];
      this.listNhaKho = [];
      this.listNganKho = [];
      this.listLoKho = [];
    }
  }

  changeChiCuc(event) {
    if (event) {
      this.rowThemMoi.maDiemKho = null;
      this.rowThemMoi.maNhaKho = null;
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listDiemKho = this.listChiCuc.find(item => item.maDvi == event).children;
      if (this.listDiemKho.length > 0) {
        this.listDiemKho = this.listDiemKho.filter(i => i.type != "PB");
      }
      this.listNhaKho = [];
      this.listNganKho = [];
      this.listLoKho = [];
    }
  }

  changeDiemKho(event) {
    if (event) {
      this.rowThemMoi.maNhaKho = null;
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listNhaKho = this.listDiemKho.find(item => item.maDvi == event).children;
      if (this.listNhaKho.length > 0) {
        this.listNhaKho = this.listNhaKho.filter(i => i.type != "PB");
      }
      this.listNganKho = [];
      this.listLoKho = [];
    }
  }

  changeNhaKho(event) {
    if (event) {
      this.rowThemMoi.maNganKho = null;
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listNganKho = this.listNhaKho.find(item => item.maDvi == event).children;
      if (this.listNganKho.length > 0) {
        this.listNganKho = this.listNganKho.filter(i => i.type != "PB");
      }
      this.listLoKho = [];
    }
  }

  async changeNganKho(event) {
    if (event) {
      await this.spinner.show();
      this.rowThemMoi.maLoKho = null;
      this.clearRowThemMoi();
      this.listLoKho = this.listNganKho.find(item => item.maDvi == event).children;
      if (this.listLoKho.length > 0) {
        this.listLoKho = this.listLoKho.filter(i => i.type != "PB");
      }
      await this.loadThongTinNganLoKho(event, DANH_MUC_LEVEL.NGAN_KHO);
      await this.spinner.hide();
    }
  }

  async changeLoKho(event) {
    if (event) {
      await this.spinner.show();
      await this.loadThongTinNganLoKho(event, DANH_MUC_LEVEL.LO_KHO);
      await this.spinner.hide();
    }
  }

  clearRowThemMoi() {
    this.rowThemMoi.loaiVthh = null;
    this.rowThemMoi.tenLoaiVthh = null;
    this.rowThemMoi.cloaiVthh = null;
    this.rowThemMoi.tenCloaiVthh = null;
    this.rowThemMoi.dvt = null;
    this.rowThemMoi.tonKho = null;
  }

  handleCancel() {
    this.isVisible = false;
    this.rowThemMoi = {};
  }

  handleOk() {
    if (this.listOfData.length > 0) {
      if (this.rowThemMoi.maLoKho) {
        let index = this.listOfData.findIndex(i => i.maLoKho == this.rowThemMoi.maLoKho);
        if (index >= 0) {
          this.listOfData[index] = this.rowThemMoi;
          this.convertListDataLuongThuc();
        } else {
          this.listOfData.push(this.rowThemMoi);
          this.convertListDataLuongThuc();
        }
      } else {
        let index = this.listOfData.findIndex(i => i.maNganKho == this.rowThemMoi.maNganKho && i.maLoKho == null);
        if (index >= 0) {
          this.listOfData[index] = this.rowThemMoi;
          this.convertListDataLuongThuc();
        } else {
          this.listOfData.push(this.rowThemMoi);
          this.convertListDataLuongThuc();
        }
      }
    } else {
      this.listOfData.push(this.rowThemMoi);
      this.convertListDataLuongThuc();
    }
    this.tinhTongSlVaThanhTien();
    this.isVisible = false;
    this.rowThemMoi = {};
  }

  async ngOnInit() {
    await this.spinner.show()
    this.isTongCuc = this.userService.isTongCuc();
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
    this.formData.get('tongMucDtDx').setValue(sum);
    this.formData.get('soLuong').setValue(sumSl);
    this.tongSLuongNhap = sumSl;
    this.tongTienTamTinh = sum;
    this.soLuongChange.emit(sumSl);
    this.donGiaTamTinhOut.emit(this.formData.get('tongMucDtDx').value)
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
          prev += cur.soLuong * item.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongThanhTienBaoLanh() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * item.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * (100 + this.formData.get('gtriDthau').value) / 100;
    }
  }


}
