import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { DonviService } from 'src/app/services/donvi.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { DanhMucService } from 'src/app/services/danhmuc.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuanLyHopDongNhapXuatService } from 'src/app/services/quanLyHopDongNhapXuat.service'
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
export class ThemSoKhoTheKhoComponent implements OnInit {
  @Input('dsTong') dsTong: any;
  @Input('dsLoaiHangHoa') dsLoaiHangHoa: any[];
  @Input('dsChungLoaiHangHoa') dsChungLoaiHangHoa: any[];
  @Output('close') onClose = new EventEmitter<any>();

  @Input() idInput: number;
  @Input() isCheck: boolean;
  dataTable: INhapXuat[];
  formData: FormGroup;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;

  userInfo: UserLogin;
  detail: any = {};
  dsNam: string[] = [];
  dsDonVi = [];

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  donViTinh = '';

  maNganKho = '';
  maNganLo = '';

  isTaoTheKho = false;

  dsNganLo = [];
  dsDonViTinh = [];
  idDonViSelected = null;

  dsHangHoa: any[];

  constructor(
    private readonly fb: FormBuilder,
    private notification: NzNotificationService,
    private userService: UserService,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    private quanLyHopDongNhapXuatService: QuanLyHopDongNhapXuatService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    public globals: Globals,
  ) { }


  async ngOnInit() {
    this.spinner.show();
    try {
      console.log(this.idInput, this.isCheck);
      if (this.idInput) {
        if (this.isCheck) {
          console.log('trường hợp đã lấy được id và đang luồng edit' + this.isCheck);
        } else {
          console.log('trường hợp đã lấy được id và đang luồng view' + this.isCheck);
        }
      } else {
        console.log('trường hợp đã lấy được id = null và đang luồng thêm mới' + this.idInput);
      }
      // this.getDataDetail(this.idInput)
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.tenTrangThai = 'Dự thảo';
      await Promise.all([
        this.initForm(),
        this.loadDiemKho(),
        this.initData(),
        this.loaiVTHHGetAll(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quanLySoKhoTheKhoService.chiTiet(id);
      const data = res.data
      console.log(data);
    }
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  initForm() {
    this.formData = this.fb.group({
      idDonVi: [null],
      nam: [null],
      tuNgay: [new Date()],
      denNgay: [new Date()],
      idLoaiHangHoa: [null],
      idChungLoaiHangHoa: [null],
      idDiemKho: [null],
      idNhaKho: [null],
      idNganKho: [null],
      idNganLo: [null],
      tonDauKy: [null],
      donViTinh: [null],
    });
  }



  initData() {
    this.loadDsTong();
    this.loadDsNam();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  loadDsTong() {
    if (!isEmpty(this.dsTong)) {
      this.dsDonVi = this.dsTong[DANH_MUC_LEVEL.CHI_CUC];
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(fromChiTiet: boolean) {

    let diemKho = this.listDiemKho.filter(x => x.title == this.detail.maDiemKho);
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
      else {
        this.detail.maNhaKho = null;
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.title == this.detail.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
      else {
        this.detail.maNganKho = null;
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.title == this.detail.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
      this.maNganKho = this.detail.maNganKho;
    }
  }

  async changeNganLo() {

  }

  async loaiVTHHGetAll() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
        this.listLoaiHangHoa = dataVatTu[0].child;
      }
    })
  }

  async changeLoaiHangHoa(event) {
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => x.ten == this.detail.maLoaiHangHoa);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }

    const loaihanghoaDVT = this.listLoaiHangHoa.filter(loaihanghoa => loaihanghoa.ten === event);
    this.donViTinh = loaihanghoaDVT[0]?.maDviTinh;

  }


  // onChangeDonVi(id: string) {
  //   const donVi = this.dsDonVi.find((item) => item.id === Number(id));
  //   if (donVi) {
  //     const result = {
  //       ...this.donviService.layDsPhanTuCon(this.dsTong, donVi),
  //     };
  //     this.dsNganLo = result[DANH_MUC_LEVEL.NGAN_LO];
  //   } else {
  //     this.dsNganLo = [];
  //   }
  // }

  huy() {
    this.onClose.emit();
  }

  exportData() { }

  luuVaDuyet() { }

  async luu() {
    console.log(this.formData.value);

  }

  taoTheKho() {
    this.isTaoTheKho = true;
  }

  changePageIndex(event) { }

  changePageSize(event) { }
}

interface ITheKho {
  id: number;
  idDonVi: number;
  tenDonVi: string;
  nam: number;
  tuNgay: Date;
  denNgay: Date;
  idLoaiHangHoa: number;
  tenLoaiHangHoa: string;
  idChungLoaiHangHoa: number;
  tenChungLoaiHangHoa: string;
  idNganLo: number;
  tenNganLo: string;
  soLuongTonDauKy: number;
  donViTinh: string;
}

interface INhapXuat {
  soPhieu: string;
  type: 'nhap' | 'xuat';
  ngayTao: Date;
  dienGiai: string;
  soLuong: number;
  soLuongTon: number;
  ghiChu: string;
}
