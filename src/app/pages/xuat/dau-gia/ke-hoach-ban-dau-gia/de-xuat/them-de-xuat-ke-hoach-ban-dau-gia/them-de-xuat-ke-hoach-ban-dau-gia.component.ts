import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { groupBy, chain } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';
import { API_STATUS_CODE, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { HelperService } from 'src/app/services/helper.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../constants/status";
import { BaseComponent } from "../../../../../../components/base/base.component";
import { DatePipe } from "@angular/common";
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { DeXuatKhBanDauGiaService } from 'src/app/services/de-xuat-kh-ban-dau-gia.service';
import { DialogThemDiaDiemPhanLoComponent } from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';

@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})
export class ThemDeXuatKeHoachBanDauGiaComponent extends BaseComponent implements OnInit {
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
  giaChuaVat: number = 0;

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
    super();
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      diaChi: [],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: ['', [Validators.required]],
      namKh: [, [Validators.required]],
      soDxuat: ['', [Validators.required]],
      trichYeu: ['', [Validators.required]],
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
      khoanTienDatTruoc: [null],
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
      pthucTtoan: [null, [Validators.required]],
      pthucGnhan: [null, [Validators.required]],
      thoiGianDuKien: [null, [Validators.required]],
      TgianGnhanGhiChu: [null],
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
      await this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await this.spinner.hide();
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

  onChangeLhNx($event) {
    console.log($event);
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
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat?.split('/')[0]
            })
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              this.convertListData();
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
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return true;
      }
    }
    else {
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_THEM")) {
        return true;
      }
    }
    return false;
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
      namKh: dayjs().get('year'),
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
      nzComponentParams: this.userService.isCuc() ? bodyParamLT : bodyParamVatTu
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
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
          this.giaChuaVat = data.giaQd
        }
        if (res.statusCode == API_STATUS_CODE.SUCCESS) {
          this.formData.patchValue({
            tchuanCluong: res.data ? res.data.tenQchuan : null,
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
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        giaKhongVat: this.giaChuaVat,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
        namKh: this.formData.get('namKh').value,
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
        tongTienKdiem = tongTienKdiem + item.tongTienKdiem;
        tongTienDatTruoc = tongTienDatTruoc + item.tienDatTruoc
      });
      this.formData.patchValue({
        tongSoLuong: tongSoLuong,
        tongTienKdiem: tongTienKdiem,
        tongTienDatTruoc: tongTienDatTruoc,
      });
      this.convertListData();
    });

  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.helperService.setIndexArray(this.listOfData);
    this.convertListData();
  }

  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
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
    // body.tgianDthau = pipe.transform(body.tgianDthau, 'yyyy-MM-dd HH:mm')
    // body.tgianMthau = pipe.transform(body.tgianMthau, 'yyyy-MM-dd HH:mm')
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

  // setValidator(isGuiDuyet) {
  //   if (isGuiDuyet) {
  //       this.formData.controls["soDxuat"].setValidators([Validators.required]);
  //     } else {
  //       this.formData.controls["soDxuat"].clearValidators();
  //     }
  //   if (this.userService.isTongCuc()) {
  //     this.formData.controls["cloaiVthh"].clearValidators();
  //     this.formData.controls["tenCloaiVthh"].clearValidators();
  //     this.formData.controls["moTaHangHoa"].clearValidators();
  //   } else {
  //     this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
  //     this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
  //     this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
  //   }
  // }



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

  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }



  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.userService.isTongCuc() ? await this.guiDuyetTongCuc() : await this.guiDuyetCuc()
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

  downloadFileKeHoach(event) {
    let body = {
      dataType: '',
      dataId: 0,
    };
    switch (event) {
      case 'tai-lieu-dinh-kem':
        // body.dataType = this.deXuatDieuChinh.fileDinhKems[0].dataType;
        // body.dataId = this.deXuatDieuChinh.fileDinhKems[0].dataId;
        // if (this.taiLieuDinhKemList.length > 0) {
        //   this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
        //     saveAs(blob, this.deXuatDieuChinh.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.deXuatDieuChinh.fileDinhKems[0].fileName);
        //   });
        // }
        break;
      default:
        break;
    }
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

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
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
    await this.spinner.show();
    if (changes) {
      await this.getDetail(this.idInput);
    };
    await this.spinner.hide();
  }

  isDisbleForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

}
