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
      console.log('1111111')
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
      /*this.formData.patchValue({
        "id": 88,
        "nam": 99,
        "maDvi": "test_508482a7392a",
        "loaiNhapXuat": "test_590d6a05b7dc",
        "kieuNhapXuat": "test_6b0797d0657d",
        "soDx": "test_a102046d5ccb",
        "trichYeu": "test_de94e03bc2b1",
        "loaiVthh": "test_fc2a191bc647",
        "cloaiVthh": "test_0471f0e50f5a",
        "tonKho": 52.2,
        "ngayDx": "2020-01-21",
        "ngayKetThuc": "2018-04-14",
        "noiDungDx": "test_203e33900d7a",
        "trangThai": "test_2215aaad2042",
        "maTongHop": "test_c5a527b896a1",
        "tongSoLuong": 23.36,
        "ngayGduyet": "2018-10-12 01:55:11",
        "nguoiGduyetId": 17,
        "ngayPduyet": "2028-03-05 09:24:59",
        "nguoiPduyetId": 87,
        "lyDoTuChoi": "test_7b10241b3c41",
        "tenDvi": "test_d71f899fae22",
        "tenLoaiVthh": "test_71d8f4734309",
        "tenCloaiVthh": "test_70c1a2acf26a",
        "tenTrangThai": "test_1e82a38ac95a",
        "canCu": [
          {
            "id": 56,
            "fileName": "test_9d048cb8a352",
            "fileSize": "test_af886d2b7c51",
            "fileUrl": "test_81e8944343dd",
            "fileType": "test_451eb8e2f6a6",
            "dataType": "test_8c4a9ec645dc",
            "createDate": "2028-12-11 06:06:05",
            "dataId": 12,
            "noiDung": "test_9dfdbb5125cd"
          }
        ],
        "deXuatPhuongAn": [
          {
            "id": 28,
            "idHdr": 17,
            "noiDung": "xuat tra vinh",
            "soLuongXuat": "test_0e47ab8ff322",
            "maDviCuc": "test_32c724864afa",
            "tonKhoCuc": 21.46,
            "soLuongXuatCuc": 11.9,
            "maDviChiCuc": "test_ca04493ad382",
            "tonKhoChiCuc": 15.27,
            "tonkhoCloaiVthh": 72.46,
            "loaiVthh": "test_728f6b73032c",
            "cloaiVthh": "test_3ed274d9bc9a",
            "soLuongXuatChiCuc": 23.98,
            "donViTinh": "test_6d61566fdde7",
            "thanhTien": 20.58,
            "soLuongXuatCap": 0.61,
            "tenLoaiVthh": "test_9e4d5dcd751d",
            "tenCloaiVthh": "test_4791e39ca6cf",
            "tenCuc": "test_62a6edac76e0",
            "tenChiCuc": "test_a7e91a64c3aa"
          },
          {
            "id": 28,
            "idHdr": 17,
            "noiDung": "xuat tra vinh",
            "soLuongXuat": "test_0e47ab8ff322",
            "maDviCuc": "test_32c724864afa",
            "tonKhoCuc": 21.46,
            "soLuongXuatCuc": 11.9,
            "maDviChiCuc": "test_ca04493ad382",
            "tonKhoChiCuc": 15.27,
            "tonkhoCloaiVthh": 72.46,
            "loaiVthh": "test_728f6b73032c",
            "cloaiVthh": "test_3ed274d9bc9a",
            "soLuongXuatChiCuc": 23.98,
            "donViTinh": "test_6d61566fdde7",
            "thanhTien": 20.58,
            "soLuongXuatCap": 0.61,
            "tenLoaiVthh": "test_9e4d5dcd751d",
            "tenCloaiVthh": "test_4791e39ca6cf",
            "tenCuc": "test_62a6edac76e0",
            "tenChiCuc": "test_a7e91a64c3aa1"
          },
          {
            "id": 28,
            "idHdr": 17,
            "noiDung": "xuat vinh phu",
            "soLuongXuat": "test_0e47ab8ff322",
            "maDviCuc": "test_32c724864afa",
            "tonKhoCuc": 21.46,
            "soLuongXuatCuc": 11.9,
            "maDviChiCuc": "test_ca04493ad382",
            "tonKhoChiCuc": 15.27,
            "tonkhoCloaiVthh": 72.46,
            "loaiVthh": "test_728f6b73032c",
            "cloaiVthh": "test_3ed274d9bc9a",
            "soLuongXuatChiCuc": 23.98,
            "donViTinh": "test_6d61566fdde7",
            "thanhTien": 20.58,
            "soLuongXuatCap": 0.61,
            "tenLoaiVthh": "test_9e4d5dcd751d",
            "tenCloaiVthh": "test_4791e39ca6cf",
            "tenCuc": "test_62a6edac76e0",
            "tenChiCuc": "test_a7e91a64c3aa1"
          },

        ],
        "ngayTao": "2018-07-17 19:16:17",
        "nguoiTaoId": 51,
        "ngaySua": "2030-04-29 00:19:36",
        "nguoiSuaId": 28
      })
      this.buildTableView()*/
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

  selectHangHoa(event: any) {
    console.log(event)
  }

  select(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
  }

  showModal(): void {
    this.isVisible = true;
    this.listNoiDung = [...new Set(this.formData.get('deXuatPhuongAn').value.map(s => s.noiDung))];
    this.phuongAnRow.loaiVthh = this.formData.get('loaiVthh').value;
  }

  handleOk(): void {
    let table = this.formData.get('deXuatPhuongAn').value;
    table = [...table, this.phuongAnRow]
    this.formData.patchValue({
      deXuatPhuongAn: table
    })
    this.buildTableView();
    this.isVisible = false;
    console.log(this.phuongAnRow, 1823);

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
    }
    else{
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_LDC, 'Bạn có muốn gửi duyệt ?');
    }
  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }
}
