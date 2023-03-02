import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';

import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {STATUS} from "src/app/constants/status";
import {DatePipe} from "@angular/common";
import {chain} from 'lodash';
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {DiaDiemNhapKho} from 'src/app/models/CuuTro';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import * as uuid from "uuid";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {QuanLyHangTrongKhoService} from "src/app/services/quanLyHangTrongKho.service";

@Component({
  selector: 'app-thong-tin-xay-dung-phuong-an',
  templateUrl: './thong-tin-xay-dung-phuong-an.component.html',
  styleUrls: ['./thong-tin-xay-dung-phuong-an.component.scss']
})

export class ThongTinXayDungPhuongAnComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maDeXuat: string;
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongSLThongTinChiTiet = 0;
  tongSLCuuTro = 0;
  tongTien = 0;
  tongSLCuuTroDtl = 0;
  tongTienDtl = 0;
  diaDiemNhapKho: any[] = [];
  thongTinChiTietCreate: any = {};
  thongTinChiTietClone: any = {};
  phuongAnXuatList: DiaDiemNhapKho[];
  idDxuatDtlSelect = 0;
  rowDxuatDtlSelect: any;
  tongSoLuongDtl: number;
  dsDonVi: any;
  expandSetString = new Set<string>();
  phuongAnView = [];
  phuongAnRow: any = {};
  isVisible = false;
  isVisibleSuaNoiDung = false;
  listNoiDung = []
  listThanhTien: any;
  listSoLuong: any;
  errorInputComponent: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [''],
        loaiNhapXuat: [''],
        kieuNhapXuat: [''],
        soDx: [''],
        trichYeu: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenVthh: [''],
        tonKho: [0],
        ngayDx: [''],
        ngayKetThuc: [''],
        noiDungDx: [''],
        trangThai: [STATUS.DU_THAO],
        maTongHop: [''],
        tongSoLuong: [0],
        thanhTien: [0],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        canCu: [new Array<FileDinhKem>()],
        deXuatPhuongAn: [new Array()]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maDeXuat = '/' + this.userInfo.MA_TCKT;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.loadDsLoaiHinhNhapXuat(),
        this.loadDsKieuNhapXuat(),
        this.loadDsVthh(),
        this.loadDsDonVi(),
      ])
      await this.loadDetail(this.idInput)
      // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.phanLoai == 'VIEN_TRO_CUU_TRO');
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');
      ;
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.deXuatPhuongAnCuuTroService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
            this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI
      });
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }

  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeLoaiHinhNhapXuat(event: any) {
    let loaiHinh = this.listLoaiHinhNhapXuat.find(s => s.ma == event);
    if (loaiHinh) {
      this.formData.patchValue({kieuNhapXuat: loaiHinh.ghiChu.split('-')[0]})
    }
  }

  async selectHangHoa(event: any) {
    console.log(event)
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  selectRow(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
  }

  showModal(data?: any): void {
    this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];
    this.isVisible = true;
    this.phuongAnRow.loaiVthh = this.formData.value.loaiVthh;
    if (this.userService.isCuc()) {
      this.phuongAnRow.maDviCuc = this.userInfo.MA_DVI;
      this.changeCuc(this.phuongAnRow.maDviCuc);
    }
    /* if (data) {
       this.phuongAnRow.maDviCuc = this.dsDonVi.find(s => s.tenDvi === data.tenCuc).maDvi;
       this.changeCuc(this.phuongAnRow.maDviCuc);
       this.phuongAnRow.noiDung = data.childData[0].noiDung;
       this.phuongAnRow.soLuongXuatCuc = data.soLuongXuatCuc;
     }*/
  }

  handleOk(): void {
    if (!this.phuongAnRow.maDviChiCuc) {
      this.errorInputComponent.push('inputChiCuc');
      return;
    }
    this.phuongAnRow.idVirtual = this.phuongAnRow.idVirtual ? this.phuongAnRow.idVirtual : uuid.v4();
    this.phuongAnRow.thanhTien = this.phuongAnRow.soLuongXuatChiCuc * this.phuongAnRow.donGiaKhongVat;
    this.phuongAnRow.tenCloaiVthh = this.listChungLoaiHangHoa.find(s => s.ma === this.phuongAnRow.cloaiVthh)?.ten
    let index = this.formData.value.deXuatPhuongAn.findIndex(s => s.idVirtual === this.phuongAnRow.idVirtual);
    let table = this.formData.value.deXuatPhuongAn;
    table.filter(s => s.noiDung === this.phuongAnRow.noiDung && s.maDviCuc === this.phuongAnRow.maDviCuc)
      .forEach(s => s.soLuongXuatCuc = this.phuongAnRow.soLuongXuatCuc)

    if (index != -1) {
      table.splice(index, 1, this.phuongAnRow);
    } else {
      table = [...table, this.phuongAnRow]
    }
    this.formData.patchValue({
      deXuatPhuongAn: table
    })
    this.buildTableView();
    this.isVisible = false;
    //clean
    this.errorInputComponent = [];
    this.phuongAnRow = {}
    this.listChiCuc = []
  }

  handleCancel(): void {
    this.isVisible = false;
    //clean
    this.errorInputComponent = [];
    this.phuongAnRow = {}
    this.listChiCuc = []
  }

  buildTableView() {
    console.log(JSON.stringify(this.formData.value.deXuatPhuongAn), 'raw')
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
              let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
              let rowCuc = v.find(s => s.tenCuc === k);
              console.log(rowCuc, 'rowCuc');
              return {
                idVirtual: uuid.v4(),
                tenCuc: k,
                soLuongXuatCuc: rowCuc.soLuongXuatCuc,
                soLuongXuatCucThucTe: soLuongXuatCucThucTe,
                tenCloaiVthh: v[0].tenCloaiVthh,
                childData: v
              }
            }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        return {
          idVirtual: uuid.v4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs
        };
      }).value();
    this.phuongAnView = dataView
    console.log(this.phuongAnView, "phuongAnView")
    this.expandAll()

    //
    if (this.formData.value.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.formData.value.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.formData.value.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let existRow = this.formData.value.deXuatPhuongAn
        .find(s => s.noiDung === this.phuongAnRow.noiDung && s.maDvi === this.phuongAnRow.maDvi);
      if (existRow) {
        this.phuongAnRow.soLuongXuatCuc = existRow.soLuongXuatCuc;
      } else {
        this.phuongAnRow.soLuongXuatCuc = 0
      }

      let data = this.dsDonVi.find(s => s.maDvi == event);
      this.phuongAnRow.tenCuc = data.tenDvi;
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }

  }

  async changeChiCuc(event: any) {
    if (event) {
      let data = this.listChiCuc.find(s => s.maDvi == event);
      this.phuongAnRow.tenChiCuc = data.tenDvi;
      let body = {
        'maDvi': event,
        'loaiVthh': this.formData.value.loaiVthh
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.tonKhoChiCuc = data[0].slHienThoi;
          }
        }
      });
    }
  }


  async changeCloaiVthh(event: any) {
    let body = {
      maDvi: this.phuongAnRow.maDviChiCuc,
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: event
    }
    this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data.length > 0) {
          this.phuongAnRow.tonKhoChiCuc = data[0].slHienThoi;
        }

      }
    });
  }

  async save() {
    this.formData.patchValue({
      deXuatPhuongAn: this.flattenTree(this.phuongAnView)
    })
    let result = await this.createUpdate(this.formData.value);
    if (result) {
      this.quayLai();
    }
  }

  async saveAndSend() {
    this.formData.patchValue({
      deXuatPhuongAn: this.flattenTree(this.phuongAnView)
    })
    if (this.userService.isTongCuc()) {
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_LDV, 'Bạn có muốn gửi duyệt ?');
    } else {
      console.log('hhaaa')
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_TP, 'Bạn có muốn gửi duyệt ?');
    }
  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  xoaPhuongAn(data: any) {
    let deXuatPhuongAn;
    if (data.id) {
      deXuatPhuongAn = this.formData.value.deXuatPhuongAn.filter(s => s.id != data.id);
    } else if (data.idVirtual) {
      deXuatPhuongAn = this.formData.value.deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual)
    }
    this.formData.patchValue({
      deXuatPhuongAn: deXuatPhuongAn
    })
    this.buildTableView();
  }

  suaPhuongAn(data: any) {
    let currentRow;
    if (data.id) {
      currentRow = this.formData.value.deXuatPhuongAn.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      currentRow = this.formData.value.deXuatPhuongAn.find(s => s.idVirtual == data.idVirtual)
    }
    this.phuongAnRow = currentRow;
    console.log(this.phuongAnRow, 'current')
    this.changeCuc(this.phuongAnRow.maDviCuc);
    this.showModal();
  }

  suaNoiDung(data: any) {
    this.phuongAnRow.noiDung = data.noiDung;
    this.phuongAnRow.noiDungEdit = data.noiDung;
    this.showModalSuaNoiDung();
  }

  showModalSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = true;
  }

  handleOkSuaNoiDung(): void {
    let currentNoiDung = this.formData.value.deXuatPhuongAn.filter(s => s.noiDung == this.phuongAnRow.noiDung);
    currentNoiDung.forEach(s => {
      s.noiDung = this.phuongAnRow.noiDungEdit;
    });
    this.buildTableView();
    this.isVisibleSuaNoiDung = false;

    //clean
    this.phuongAnRow = {}
  }

  handleCancelSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = false;
    this.phuongAnRow = {}
  }

  checkVld(inputName: string) {
    if (this.errorInputComponent.find(s => s === inputName)) {
      return 'error'
    } else {
      return '';
    }
  }
}
