import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';
import { API_STATUS_CODE } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { HelperService } from 'src/app/services/helper.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {
  DialogThemMoiGoiThauComponent
} from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../constants/status";
import { BaseComponent } from "../../../../../../components/base/base.component";
import { DatePipe } from "@angular/common";
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { DeXuatKhBanDauGiaService } from 'src/app/services/de-xuat-kh-ban-dau-gia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';

@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})
export class ThemDeXuatKeHoachBanDauGiaComponent implements OnInit, OnChanges {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  editCache: { [key: string]: { edit: boolean; data: DanhSachPhanLo } } = {};

  formData: FormGroup;
  listOfData: any[] = [];
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  danhMucDonVi: any;
  STATUS = STATUS;
  i = 0;
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  dataChiTieu: any;
  userInfo: UserLogin;
  maTrinh: string = '';
  taiLieuDinhKemList: any[] = [];
  listDataGroup: any[] = [];
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
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
  donGiaVat: number = 0;

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
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: ['', [Validators.required]],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: [''],
      diaChi: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      soDxuat: ['', [Validators.required]],
      trichYeu: [, [Validators.required]],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayPduyet: [],
      soQdCtieu: [, [Validators.required]],
      loaiVthh: [,],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [,],
      tenCloaiVthh: [, [Validators.required]],
      moTaHangHoa: [, [Validators.required]],
      tchuanCluong: [null],
      thoiGianDuKien: [, [Validators.required]],
      tgianDkienTu: [,],
      tgianDkienDen: [,],
      tgianTtoan: [, [Validators.required]],
      tgianTtoanGhiChu: [null],
      pthucTtoan: [, [Validators.required]],
      tgianGnhan: [, [Validators.required]],
      tgianGnhanGhiChu: [null],
      pthucGnhan: [, [Validators.required]],
      thongBaoKh: [, [Validators.required]],
      khoanTienDatTruoc: [, [Validators.required]],
      tongSoLuong: [null],
      tongTienKdiem: [null],
      tongTienKdienDonGia: [null],
      tongTienDatTruocDonGia: [null],
      tongTienDatTruoc: [null],
      ghiChu: [null],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      trangThaiTh: [STATUS.CHUA_TONG_HOP],
      tenTrangThaiTh: ['Chưa tổng hợp'],
      maThop: [null],
      soQdPd: [null],
      ngayGduyet: [null],
      nguoiGduyetId: [null],
      nguoiPduyetId: [null],
      soDviTsan: [null],
      slHdDaKy: [null],
      ldoTuChoi: [null],
      ngayKy: [null],

    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    if (this.idInput > 0) {
      // await this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await Promise.all([
      this.loadDataComboBox(),
      this.getDataChiTieu()
    ]);
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.phanLoai == 'X');
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

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }

  async getDetail(id: number) {
    if (id) {
      await this.deXuatKhBanDauGiaService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            if (dataDetail) {
              this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
              this.formData.patchValue({
                soDxuat: dataDetail.soDxuat?.split('/')[0],
                thoiGianDuKien: dataDetail.tgianDkienTu && dataDetail.tgianDkienDen ? [dataDetail.tgianDkienTu, dataDetail.tgianDkienDen] : null
              })
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsPhanLoList;
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  isDetailPermission() {
    if (this.loaiVthhInput === "02") {
      if (this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_VT_DEXUAT_THEM")) {
        return true;
      }
    }
    else {
      if (this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_LT_DEXUAT_THEM")) {
        return true;
      }
    }
    this.notification.error(MESSAGE.ERROR, "Bạn không có quyền truy cập chức năng này !")
    return false;
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
    })
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
      nzComponentParams: this.userService.isTongCuc() ? bodyParamLT : bodyParamVatTu
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
          let bodyPag = {
            namKeHoach: this.formData.value.namKh,
            loaiVthh: this.formData.value.loaiVthh,
            cloaiVthh: this.formData.value.cloaiVthh,
            trangThai: STATUS.BAN_HANH,
            maDvi: this.formData.value.maDvi
          }
          let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
          if (pag.msg == MESSAGE.SUCCESS) {
            const data = pag.data;
            this.donGiaVat = data.giaQdVat
          }
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
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    if (!this.formData.get('khoanTienDatTruoc').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '3000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
        namKh: this.formData.get('namKh').value,
        donGiaVat: this.donGiaVat,
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
      let tongTienKdienDonGia: number = 0;
      let tongTienDatTruoc: number = 0;
      let tongTienDatTruocDonGia: number = 0;
      this.listOfData.forEach((item) => {
        tongSoLuong = (tongSoLuong + item.soLuong) / 1000;
        tongTienKdiem = tongTienKdiem + item.giaKhoiDiem;
        tongTienKdienDonGia = tongTienKdienDonGia + item.giaKhoiDiemDduyet;
        tongTienDatTruoc = tongTienDatTruoc + item.tienDatTruoc;
        tongTienDatTruocDonGia = tongTienDatTruocDonGia + item.tienDatTruocDduyet;
      });
      this.formData.patchValue({
        tongSoLuong: tongSoLuong,
        tongTienKdiem: tongTienKdiem,
        tongTienKdienDonGia: tongTienKdienDonGia,
        tongTienDatTruoc: tongTienDatTruoc,
        tongTienDatTruocDonGia: tongTienDatTruocDonGia,
      });
    });
  }

  deleteRow(i: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.listOfData = this.listOfData.filter((d, index) => index !== i);
          this.helperService.setIndexArray(this.listOfData);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save(isGuiDuyet?) {
    if (!this.isDetailPermission()) {
      return;
    }
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    if (this.listOfData.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách kế hoạch không được để trống',
      );
      return;
    }
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    if (this.formData.get('soDxuat').value) {
      body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    }
    body.tgianDkienTu = this.formData.get('thoiGianDuKien').value
      ? dayjs(this.formData.get('thoiGianDuKien').value[0]).format(
        'YYYY-MM-DD',
      )
      : null,
      body.tgianDkienDen = this.formData.get('thoiGianDuKien').value
        ? dayjs(this.formData.get('thoiGianDuKien').value[1]).format(
          'YYYY-MM-DD',
        )
        : null,
      body.fileDinhKemReq = this.fileDinhKem;
    body.dsPhanLoReq = this.listOfData;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.deXuatKhBanDauGiaService.update(body);
    } else {
      res = await this.deXuatKhBanDauGiaService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  async getDataChiTieu() {
    let res2 =
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKh').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQdCtieu: res2.data.soQuyetDinh
      });
    } else {
      this.formData.patchValue({
        soQdCtieu: '150/TCDT',
      });
    }
  }

  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.loaiVthhInput == '02' ? await this.guiDuyetTongCuc() : await this.guiDuyetCuc()
  }

  async guiDuyetTongCuc() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: '',
          };
          if (this.formData.get('loaiVthh').value.startsWith('02')) {
            switch (this.formData.get('trangThai').value) {
              case STATUS.TU_CHOI_LDV:
              case STATUS.DU_THAO: {
                body.trangThai = STATUS.CHO_DUYET_LDV;
                break;
              }
              case STATUS.CHO_DUYET_LDV: {
                body.trangThai = STATUS.DA_DUYET_LDV;
                break;
              }
            }
          } else {
            switch (this.formData.get('trangThai').value) {
              case STATUS.CHUA_TONG_HOP: {
                body.trangThai = STATUS.DA_TONG_HOP;
                break;
              }
            }
          }
          let res = await this.deXuatKhBanDauGiaService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
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

  async guiDuyetCuc() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
          }
          let res = await this.deXuatKhBanDauGiaService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.THAO_TAC_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
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
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
          }
          const res = await this.deXuatKhBanDauGiaService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
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

  openDialogGoiThau(data?: any) {
    this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
      },
    });
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.getDetail(this.idInput);
    };
  }

  isDisbleForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

  calcTongSoLuong() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.tongSoLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
}
