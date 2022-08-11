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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/quanLyPhieuNhapKho.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
export class ThemSoKhoTheKhoComponent implements OnInit {
  @Input('dsTong') dsTong: any;
  @Output('close') onClose = new EventEmitter<any>();

  @Input() idInput: number; // id
  @Input() isCheck: boolean;// check
  @Input() isStatus: any;
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

  maDonVi = '';
  maLoaiVTHH = '';
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
    public userService: UserService,
    private donviService: DonviService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    public globals: Globals,
    private modal: NzModalService,

  ) { }


  async ngOnInit() {
    this.spinner.show();
    try {
      console.log(this.idInput, this.isCheck, this.isStatus);
      if (this.idInput) {
        let res = await this.quanLySoKhoTheKhoService.chiTiet(this.idInput)
        console.log(res);

        if (this.isCheck) {
          console.log('trường hợp đã lấy được id và đang luồng edit ' + this.isCheck);
        } else {
          console.log('trường hợp đã lấy được id và đang luồng view ' + this.isCheck);
        }
      } else {
        console.log('trường hợp đã lấy được id = null và đang luồng thêm mới ' + this.idInput);
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

  isDetail(): boolean {
    // if (this.isStatus === this.globals.prop.BAN_HANH) {
    //   return (
    //     !this.isCheck
    //   );
    // }


    return (
      this.isCheck
    );

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
      idDonVi: [null, [Validators.required]],
      nam: [null, [Validators.required]],
      tuNgay: [null, [Validators.required]],
      denNgay: [null, [Validators.required]],
      idLoaiHangHoa: [null, [Validators.required]],
      idChungLoaiHangHoa: [null, [Validators.required]],
      idDiemKho: [null, [Validators.required]],
      idNhaKho: [null, [Validators.required]],
      idNganKho: [null, [Validators.required]],
      idNganLo: [null, [Validators.required]],
      tonDauKy: [1, [Validators.required]],
      donViTinh: ['bộ'],
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

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    const res = await this.donviService.getTreeAll(body);
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
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        console.log(hangHoa)
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          // const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
          // this.listLoaiHangHoa = dataVatTu[0].child;

          // const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
          this.listLoaiHangHoa = hangHoa.data;
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changeLoaiHangHoa(event) {
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => x.ten == this.detail.maLoaiHangHoa);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }

  }

  changeChungLoaiHangHoa(event) {
    const loaihanghoaDVT = this.listChungLoaiHangHoa.filter(chungloaihanghoa => chungloaihanghoa.ma === event);
    this.donViTinh = loaihanghoaDVT[0]?.maDviTinh;
  }

  huy() {
    this.onClose.emit();
  }
  // nút xuất file chi tiết thẻ kho
  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = this.formData.value;
        this.quanLySoKhoTheKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'chi-tiet-the-kho.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    }


  }

  async luu(isDuyet: boolean) {
    const body = {
      "chungLoaiHH": this.formData.value.idChungLoaiHangHoa,
      "denNgay": this.formData.value.denNgay,
      "ds": [
        {
          "dienGiai": "t",
          "ghiChu": "t",
          "loaiPhieu": "t",
          "ngay": "01-02-2020",
          "soLuong": 10,
          "soPhieu": "t",
          "ton": 10
        }
      ],
      "maDvi": this.formData.value.idNganLo,
      "nam": this.formData.value.nam,
      "tenDvi": this.formData.value.idDonVi,
      "tonDauKy": 10,
      "tuNgay": this.formData.value.tuNgay
    }




    try {
      const res = await this.quanLySoKhoTheKhoService.them(body);

      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);

        if (isDuyet) {
          return res.data.id;
        }

        this.huy();
      }

    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }

  luuVaDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const id = await this.luu(true);
          let body = {
            id: id,
            lyDo: null,
            trangThai: '01',
          };

          let res = await this.quanLySoKhoTheKhoService.pheDuyet(body);

          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.GUI_DUYET_SUCCESS);
            this.huy();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: null,
            trangThai: '02',
          };
          let res = await this.quanLySoKhoTheKhoService.pheDuyet(body);

          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
            this.huy();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();

        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          let res = await this.quanLySoKhoTheKhoService.pheDuyet(body);

          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.huy();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }



  taoTheKho() {
    this.isTaoTheKho = true;
    this.loadSoPhieuNhapXuat();
    this.isCheck = true;

    this.formData.value.tuNgay = dayjs(this.formData.value.tuNgay).format("DD-MM-YYYY");
    this.formData.value.denNgay = dayjs(this.formData.value.denNgay).format("DD-MM-YYYY");
  }

  async loadSoPhieuNhapXuat() {
    this.listLoaiHangHoa.forEach(hangHoa => {
      if (this.detail.maLoaiHangHoa === hangHoa.ten) {
        this.maLoaiVTHH = hangHoa.ma;
      }
    })

    this.dsDonVi.forEach(donVi => {
      if (this.detail.maDonVi === donVi.tenDvi) {
        this.maDonVi = donVi.maDvi;
      }
    })

    const bodyNhapNho = {
      'maDvis': this.maDonVi,
      'loaiVthh': this.maLoaiVTHH,
      'paggingReq.limit': 20,
      'paggingReq.page': 0
    }

    console.log(bodyNhapNho);

    let body = {
      "paggingReq.limit": 20,
      "paggingReq.page": 0
    }

    try {
      const resNhapKho = await this.quanLyPhieuNhapKhoService.timKiem(bodyNhapNho);
      // const resSoHang = await this.quanLyHangTrongKhoService.timkiem(body);

      console.log(resNhapKho);

      let listNhapXuat = [];

      resNhapKho.data.content.forEach(nhapKho => {
        listNhapXuat = [
          ...listNhapXuat,
          {
            soPhieu: nhapKho.soPhieu,
            type: 'nhap',
            ngayTao: nhapKho.thoiGianGiaoNhan,
            dienGiai: '',
            soLuong: 0,
            soLuongTon: 0,
            ghiChu: '',
          }
        ]
      })
      this.dataTable = listNhapXuat;

    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

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
