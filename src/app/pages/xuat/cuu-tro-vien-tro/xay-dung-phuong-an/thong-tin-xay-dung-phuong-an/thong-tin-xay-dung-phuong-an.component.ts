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
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {STATUS} from "../../../../../constants/status";
import {DatePipe} from "@angular/common";
import {chain} from 'lodash';
import {DanhMucTieuChuanService} from "../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {DiaDiemNhapKho} from 'src/app/models/CuuTro';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import * as uuid from "uuid";
import {FileDinhKem} from "../../../../../models/DeXuatKeHoachuaChonNhaThau";

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
  listNoiDung = []
  listThanhTien: any;
  listSoLuong: any;


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
      maDviCha: this.userInfo.MA_DVI,
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

  showModal(): void {
    this.isVisible = true;
    this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];
    this.phuongAnRow.loaiVthh = this.formData.value.loaiVthh;
    console.log(this.formData.value.deXuatPhuongAn, 'pa')
  }

  handleOk(): void {

    this.phuongAnRow.idVirtual = this.phuongAnRow.idVirtual ? this.phuongAnRow.idVirtual : uuid.v4();
    this.phuongAnRow.thanhTien = this.phuongAnRow.soLuongXuatChiCuc * this.phuongAnRow.donGiaKhongVat;
    let index = this.formData.value.deXuatPhuongAn.findIndex(s => s.idVirtual === this.phuongAnRow.idVirtual);
    let table = this.formData.value.deXuatPhuongAn;
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
    this.phuongAnRow = {}
    this.listChiCuc = []
  }

  handleCancel(): void {
    this.isVisible = false;
    this.phuongAnRow = {}
  }

  buildTableView() {
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => ({
              idVirtual: uuid.v4(),
              tenCuc: k,
              // soLuongGiao: v[0].soLuongGiao,
              // tenCloaiVthh: v[0].tenCloaiVthh,
              childData: v
            })
          ).value();
        return {idVirtual: uuid.v4(), noiDung: key, childData: rs};
      }).value();
    console.log(dataView)
    this.phuongAnView = dataView
    this.expandAll()

    //
    console.log(this.formData.value.deXuatPhuongAn, 11111111, !this.formData.value.deXuatPhuongAn);
    if (this.formData.value.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.formData.value.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.formData.value.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
  }

  async changeCuc(event: any) {
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

  async changeChiCuc(event: any) {
    let data = this.listChiCuc.find(s => s.maDvi == event);
    this.phuongAnRow.tenChiCuc = data.tenDvi;
  }

  async save() {
    this.formData.patchValue({
      noiDungCuuTro: this.flattenTree(this.phuongAnView)
    })
    let result = await this.createUpdate(this.formData.value);
    if (result) {
      this.quayLai();
    }
  }

  async saveAndSend() {
    this.formData.patchValue({
      noiDungCuuTro: this.flattenTree(this.phuongAnView)
    })
    if (this.userService.isTongCuc()) {
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_LDV, 'Bạn có muốn gửi duyệt ?');
    } else {
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_LDC, 'Bạn có muốn gửi duyệt ?');
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
    console.log(currentRow, 123)
    this.phuongAnRow = currentRow;
    this.changeCuc(this.phuongAnRow.maDviCuc);
    this.showModal();
  }
}
