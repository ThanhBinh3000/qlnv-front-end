import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../../../models/userlogin";
import { groupBy, chain } from 'lodash';
import { DanhSachPhanLo, DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "../../../../../../models/KeHoachBanDauGia";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Globals } from "../../../../../../shared/globals";
import { UserService } from "../../../../../../services/user.service";
import { DonviService } from "../../../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import { HelperService } from "../../../../../../services/helper.service";
import { STATUS } from "../../../../../../constants/status";
import { MESSAGE } from "../../../../../../constants/message";
import { FileDinhKem } from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { DeXuatKhBanDauGiaService } from 'src/app/services/de-xuat-kh-ban-dau-gia.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import * as dayjs from 'dayjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { async } from '@angular/core/testing';
import { API_STATUS_CODE } from 'src/app/constants/config';
import { DialogThemDiaDiemNhapKhoComponent } from 'src/app/components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { DatePipe } from "@angular/common";
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan.service';
import { DialogThemDiaDiemPhanLoComponent } from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})
export class ThemDeXuatKeHoachBanDauGiaComponent extends BaseComponent implements OnInit {
  @Input() loaiVthhInput: string;

  @Input() idInput: number;

  @Input()
  showFromTH: boolean;

  @Input() isView: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();

  @Input() id: number;

  STATUS = STATUS;
  formData: FormGroup;

  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listPhuongThucThanhToan: any[] = [
    {
      ma: '1',
      giaTri: 'Tiền mặt',
    },
    {
      ma: '2',
      giaTri: 'Chuyển khoản',
    },
  ];

  listFileDinhKem: any[] = [];
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maDxuat: string;




  listNam: any[] = [];
  dataChiTieu: any;
  maTrinh: string = '';
  userInfo: UserLogin;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  fileDinhKem: any[] = [];
  listLoaiHopDong: any[] = [];
  listOfData: any[] = [];
  listDataGroup: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: DanhSachPhanLo } } = {};

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private donviService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
  ) {
    super();
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      diaChi: [],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: ['', [Validators.required]],
      namKh: [, [Validators.required]],
      soDxuat: [null],
      trichYeu: [null],
      soQdCtieu: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [, [Validators.required]],
      moTaHangHoa: [, [Validators.required]],
      tchuanCluong: [null],
      tgianDkienTu: [null, [Validators.required]],
      tgianDkienDen: [null, [Validators.required]],
      loaiHdong: [null, [Validators.required]],
      tgianKyHdong: [null, [Validators.required]],
      tgianTtoan: [null, [Validators.required]],
      tgianGnhan: [null, [Validators.required]],
      thongBaoKh: [null, [Validators.required]],
      khoanTienDatTruoc: ['10'],
      tongSoLuong: [null],
      tongTienKdiem: [null],
      tongTienDatTruoc: [null],
      ghiChu: [null],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      trangThaiTh: [STATUS.CHUA_TONG_HOP],
      tenTrangThaiTh: ['Chưa tổng hợp'],
      maThop: [null],
      soQdPd: [null, [Validators.required]],
      ngayGduyet: [null],
      nguoiGduyetId: [null],
      ngayPduyet: [],
      nguoiPduyetId: [null],
      soDviTsan: [null],
      slHdDaKy: [null],
      ldoTuChoi: [null],
      ngayKy: [null],
      tgianKyHdongGhiChu: [null],
      tgianTtoanGhiChu: [null],
      tgianGnhanGhiChu: [null],
      pthucTtoan: [null],
      pthucGnhan: [null],
      thoiGianDuKien: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    await Promise.all([
      this.loadDataComboBox(),
    ]);
    if (this.idInput > 0) {
      // await this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await this.spinner.hide();
  }





  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    if (this.formData.get('soDxuat').value) {
      body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    }
  }



  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soDxuat"].clearValidators();
    }
    if (this.userService.isTongCuc()) {
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["moTaHangHoa"].clearValidators();
    } else {
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    }
  }





  selectHangHoa() {
    let data = this.loaiVthhInput;
    let bodyParamVatTu = {
      data,
      isCaseSpecial: true,
      onlyVatTu: true
    }
    let bodyParamLT = {
      onlyLuongThuc: true
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: this.userService.isCuc() ? bodyParamLT : bodyParamVatTu
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (this.userService.isCuc()) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
          });
          let res = await this.dmTieuChuanService.getDetailByMaHh(
            this.formData.get('cloaiVthh').value,
          );
          // let bodyPag = {
          //   namKeHoach: this.formData.value.namKhoach,
          //   loaiVthh: this.formData.value.loaiVthh,
          //   cloaiVthh: this.formData.value.cloaiVthh,
          //   trangThai: STATUS.BAN_HANH,
          //   maDvi: this.formData.value.maDvi
          // }
          // let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
          // if (pag.msg == MESSAGE.SUCCESS) {
          //   const data = pag.data;
          //   this.formData.patchValue({
          //     donGiaVat: data.giaQdVat
          //   })
          //   if (!data.giaQdVat) {
          //     this.notification.error(MESSAGE.ERROR, "Chủng loại hàng hóa đang chưa có giá, xin vui lòng thêm phương án giá!")
          //   }
          // }
          if (res.statusCode == API_STATUS_CODE.SUCCESS) {
            this.formData.patchValue({
              tchuanCluong: res.data ? res.data.tenQchuan : null,
            });
          }
        } else {
          this.formData.patchValue({
            loaiVthh: data.ma,
            tenLoaiVthh: data.ten
          });
        }
      }
    });
  }

  themMoiBangPhanLoTaiSan(data?: DanhSachPhanLo, index?: number) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hành hóa');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
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
      let tongSoLuong: number = 0;
      let tongTienKdiem: number = 0;
      let tongTienDatTruoc: number = 0;
      this.listOfData.forEach((item) => {
        tongSoLuong = tongSoLuong + item.soLuong;
        tongTienKdiem = tongTienKdiem + item.giaKhoiDiem;
        tongTienDatTruoc = tongTienDatTruoc + item.tienDatTruoc;
      });
      this.formData.patchValue({
        tongSoLuong: tongSoLuong,
        tongTienKdiem: tongTienKdiem,
        tongTienDatTruoc: tongTienDatTruoc,
      });
      this.convertListData();
    });

  }

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.helperService.setIndexArray(this.listOfData);
    this.convertListData();
  }


  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.phanLoai == 'N');
      console.log(this.listLoaiHinhNx);
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }



  async getDataChiTieu() {
    let res2 =
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKh').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQdCtieu: this.dataChiTieu.soQuyetDinh,
      });
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
      namKh: dayjs().get('year'),
    })
  }


  onChangeLhNx($event) {
    console.log($event);
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }
}
