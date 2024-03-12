import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanChuanBiKho, ChiTietBienBanChuanBiKho } from 'src/app/models/BienBanChuanBiKho';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import {
  QuanLyBienBanChuanBiKhoService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanChuanBiKho.service';
import {
  QuyetDinhGiaoNhapHangService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  QuanLyPhieuKiemTraChatLuongHangService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import * as uuidv4 from "uuid";
import {
  DialogThemMoiDmNhomHangComponent
} from "../../../../../../components/dialog/dialog-them-moi-dm-nhom-hang/dialog-them-moi-dm-nhom-hang.component";
import {
  BbNghiemThuBaoQuanService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";

@Component({
  selector: 'app-thong-tin-bien-ban-chuan-bi-kho',
  templateUrl: './thong-tin-bien-ban-chuan-bi-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-chuan-bi-kho.component.scss']
})
export class ThongTinBienBanChuanBiKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Input() maNganLoKho: string;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  bienBanChuanBiKho: BienBanChuanBiKho = new BienBanChuanBiKho();
  dsChiTietChuanBiKhoClone: Array<ChiTietBienBanChuanBiKho> = [];
  chiTietChuanBiKhoCreate: ChiTietBienBanChuanBiKho = new ChiTietBienBanChuanBiKho();
  formData: FormGroup;
  dataTable: any[] = [];
  danhSach: any[] = []
  dsHangTH = []
  dsHangPD = []
  typeData: string;
  typeAction: string;
  previewName: string = 'bien_ban_chuan_bi_kho';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private bienBanChuanBiKhoService: QuanLyBienBanChuanBiKhoService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanChuanBiKhoService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: ['', [Validators.required]],
        maQhns: ['',],
        tenDvi: ['', [Validators.required]],
        idQdGiaoNvNh: ['', [Validators.required]],
        soQdGiaoNvNh: [, [Validators.required]],
        ngayQdGiaoNvNh: [, [Validators.required]],
        soBienBan: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],

        idDdiemGiaoNvNh: [, [Validators.required]],
        soLuongDdiemGiaoNvNh: [''],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: [''],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: [''],
        maNganKho: ['', [Validators.required]],
        tenNganKho: [''],
        maLoKho: [''],
        tenLoKho: [''],

        loaiVthh: ['', [Validators.required]],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],

        hthucBquan: [],
        pthucBquan: [],

        soLuongQdGiaoNvNh: [''],
        soLuongDaNhap: [''],

        tenKyThuatVien: [''],
        tenThuKho: [''],
        tenKeToan: [''],
        tenNguoiPduyet: [''],

        loaiHinhKho: [''],
        tichLuong: [''],
        ngayNghiemThu: [''],
        ketLuan: [],
        kqDanhGia: [],
        lyDoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
        tongKinhPhiDaTh: [],
        tongKinhPhiDaThBc: [],
        tenNganLoKho: [],
        soBbNhapDayKho: [],
        tgianGiaoDuHang: [],
      }
    );
  }

  async ngOnInit() {
    super.ngOnInit();
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async openDialogSoQd() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": this.STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      tgianGiaoDuHang: data.tgianGiaoDuHang,
    });
    this.loadDataComboBox();
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children.filter(i => i.bienBanChuanBiKho == null);
    }
    if (this.maNganLoKho != null) {
      let dataDdiem = null;
      if (this.maNganLoKho.length == 16) {
        dataDdiem = this.listDiaDiemNhap.find(x => x.maLoKho == this.maNganLoKho);
      } else if (this.maNganLoKho.length == 14) {
        dataDdiem = this.listDiaDiemNhap.find(x => x.maNganKho == this.maNganLoKho);
      }
      if (dataDdiem != null) {
        this.bindingDataDdNhap(dataDdiem);
      }
    }
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      // let soLuongNhap = await this.quanLyPhieuKiemTraChatLuongHangService.getSoLuongNhap({ "idDdiemGiaoNvNh": data.id });
      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho,
        maLoKho: data.maLoKho,
        soLuongDdiemGiaoNvNh: data.soLuong,
      })
      await this.loadLoaiHinhKho(data.maLoKho || data.maNganKho)
    }
  }

  getNameFile(event?: any) {
    // this.isSave = true;
    // const element = event.currentTarget as HTMLInputElement;
    // const fileList: FileList | null = element.files;
    // if (fileList) {
    //   this.nameFile = fileList[0].name;
    // }
    // this.formData.patchValue({
    //   file: event.target.files[0] as File,
    // });
    // if (this.dataCanCuXacDinh) {
    //   this.formTaiLieuClone.file = this.nameFile;
    //   this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    // }
  }

  isDisableField() {
    if (this.bienBanChuanBiKho && (this.bienBanChuanBiKho.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanChuanBiKho.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanChuanBiKho.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loadHinhThucBaoQuan() {
    let body = {
      "maHthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenHthuc": null,
      "trangThai": null
    }
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async initForm() {
    let maBb = 'BBCBK-' + this.userInfo.DON_VI.tenVietTat;
    let res = await this.userService.getId("BIEN_BAN_CHUAN_BI_KHO_SEQ");
    this.formData.patchValue({
      soBienBan: `${res}/${this.formData.get('nam').value}/${maBb}`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: this.STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenKyThuatVien: this.userInfo.TEN_DAY_DU,
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
    return ''
  }

  async loadDataComboBox() {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    } else {
      let res = await this.danhMucService.getDetail(this.formData.value.loaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.bienBanChuanBiKhoService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          await this.bindingDataQd(data.idQdGiaoNvNh);
          this.formData.get('tenNganLoKho').setValue(this.formData.get('tenLoKho').value ? this.formData.get('tenNganKho').value + " - " + this.formData.get('tenLoKho').value : this.formData.get('tenNganKho').value)
          this.danhSach = data.children;
          this.dsHangTH = data.children.filter(item => item.type === "TH")
          this.viewTableTH()
          this.dsHangPD = data.children.filter(item => item.type === "PD")
          this.fileDinhKem = data.fileDinhKems;
        }
      }
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
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

  async loadLoaiKho() {
    // let body = {
    //   "maLhKho": null,
    //   "paggingReq": {
    //     "limit": 1000,
    //     "page": 1
    //   },
    //   "str": null,
    //   "tenLhKho": null,
    //   "trangThai": null
    // };
    // let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    // if (res.msg == MESSAGE.SUCCESS) {
    //   if (res.data && res.data.content) {
    //     this.listLoaiKho = res.data.content;
    //   }
    // } else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
  }

  async loadLoaiHinhKho(kho) {
      if (kho) {
        let res = await this.bbNghiemThuBaoQuanService.getDataKho(kho);
        this.formData.patchValue({
          loaiHinhKho: res.data.lhKho
        });
      }
    }

  async save(isGuiDuyet: boolean) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    try {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      body.children = this.danhSach;
      body.listFileDinhKem = this.fileDinhKem;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.bienBanChuanBiKhoService.update(body);
      } else {
        res = await this.bienBanChuanBiKhoService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
          this.id = res.data.id;
          this.pheDuyet();
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.back();
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            // this.back();
          }
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case this.STATUS.DU_THAO: {
        trangThai = this.STATUS.CHO_DUYET_TK;
        break;
      }
      case this.STATUS.CHO_DUYET_TK: {
        trangThai = this.STATUS.CHO_DUYET_KT;
        break;
      }
      case this.STATUS.CHO_DUYET_KT: {
        trangThai = this.STATUS.CHO_DUYET_LDCC;
        break;
      }
      case this.STATUS.CHO_DUYET_LDCC: {
        trangThai = this.STATUS.DA_DUYET_LDCC;
        break;
      }
    }
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
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.bienBanChuanBiKhoService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case this.STATUS.CHO_DUYET_TK: {
        trangThai = this.STATUS.TU_CHOI_TK;
        break;
      }
      case this.STATUS.CHO_DUYET_KT: {
        trangThai = this.STATUS.TU_CHOI_KT;
        break;
      }
      case this.STATUS.CHO_DUYET_LDCC: {
        trangThai = this.STATUS.TU_CHOI_LDCC;
        break;
      }
    }
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          let res =
            await this.bienBanChuanBiKhoService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  back() {
    this.showListEvent.emit();
  }

  print() {

  }

  newObjectChiTietChuanBiKho() {
    this.chiTietChuanBiKhoCreate = new ChiTietBienBanChuanBiKho();
  }

  addChiTiet() {
    if (!this.chiTietChuanBiKhoCreate.noiDung) {
      return;
    }
    const chiTietChuanBiKhoTemp = new ChiTietBienBanChuanBiKho();
    chiTietChuanBiKhoTemp.noiDung = this.chiTietChuanBiKhoCreate.noiDung;
    chiTietChuanBiKhoTemp.donViTinh = this.chiTietChuanBiKhoCreate.donViTinh;
    chiTietChuanBiKhoTemp.soLuongTrongNam = this.chiTietChuanBiKhoCreate.soLuongTrongNam;
    chiTietChuanBiKhoTemp.donGiaTrongNam = this.chiTietChuanBiKhoCreate.donGiaTrongNam;
    chiTietChuanBiKhoTemp.thanhTienTrongNam = this.chiTietChuanBiKhoCreate.thanhTienTrongNam;
    chiTietChuanBiKhoTemp.soLuongQt = this.chiTietChuanBiKhoCreate.soLuongQt;
    chiTietChuanBiKhoTemp.thanhTienQt = this.chiTietChuanBiKhoCreate.thanhTienQt;
    chiTietChuanBiKhoTemp.tongGiaTri = this.chiTietChuanBiKhoCreate.tongGiaTri;
    chiTietChuanBiKhoTemp.idVirtual = new Date().getTime();
    this.bienBanChuanBiKho.chiTiets = [
      ...this.bienBanChuanBiKho.chiTiets,
      chiTietChuanBiKhoTemp,
    ];
    this.newObjectChiTietChuanBiKho();
    this.dsChiTietChuanBiKhoClone = cloneDeep(this.bienBanChuanBiKho.chiTiets);
  }

  deleteData(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.bienBanChuanBiKho.chiTiets =
          this.bienBanChuanBiKho?.chiTiets.filter(
            (cbKho) => cbKho.idVirtual !== id,
          );
        this.dsChiTietChuanBiKhoClone = cloneDeep(
          this.bienBanChuanBiKho.chiTiets,
        );
      },
    });
  }

  startEdit(index: number) {
    this.dsChiTietChuanBiKhoClone[index].isEdit = true;
  }

  saveEdit(i: number) {
    this.dsChiTietChuanBiKhoClone[i].isEdit = false;
    Object.assign(
      this.bienBanChuanBiKho.chiTiets[i],
      this.dsChiTietChuanBiKhoClone[i],
    );
  }

  cancelEdit(index: number) {
    this.dsChiTietChuanBiKhoClone = cloneDeep(this.bienBanChuanBiKho.chiTiets);
    this.dsChiTietChuanBiKhoClone[index].isEdit = false;
  }

  calcChiPhiTrongNam(): string {
    this.chiTietChuanBiKhoCreate.thanhTienTrongNam = +this.chiTietChuanBiKhoCreate.soLuongTrongNam
      * +this.chiTietChuanBiKhoCreate.donGiaTrongNam;
    return this.chiTietChuanBiKhoCreate.thanhTienTrongNam
      ? Intl.NumberFormat('en-US').format(this.chiTietChuanBiKhoCreate.thanhTienTrongNam)
      : '0';
  }

  calcTongGiaTri(): string {
    if (!this.chiTietChuanBiKhoCreate.thanhTienQt) {
      this.chiTietChuanBiKhoCreate.thanhTienQt = 0;
    }

    this.chiTietChuanBiKhoCreate.tongGiaTri = +this.chiTietChuanBiKhoCreate.thanhTienTrongNam
      + this.chiTietChuanBiKhoCreate.thanhTienQt;
    return this.chiTietChuanBiKhoCreate.tongGiaTri
      ? Intl.NumberFormat('en-US').format(this.chiTietChuanBiKhoCreate.tongGiaTri)
      : '0';
  }

  calcTongCong(): string {
    const tong = this.dsChiTietChuanBiKhoClone.length > 0 ?
      this.dsChiTietChuanBiKhoClone.reduce((total, currentValue) =>
        total + currentValue.thanhTienTrongNam
        , 0) : 0
    this.formData.patchValue({
      tongSo: tong
    })
    return Intl.NumberFormat('en-US').format(tong);
  }

  async addTH(row?: any) {
    this.typeData = "TH"
    this.typeAction = "ADD"
    await this.add(row)
  }

  async updateTH(row) {
    this.typeData = "TH"
    this.typeAction = "UPDATE"
    await this.add(row)
  }

  async addRowTH(row?: any) {
    this.typeData = "TH"
    this.typeAction = "ADD"
    await this.add(row, true)
  }

  async addPD(row?: any) {
    this.typeData = "PD"
    this.typeAction = "ADD"
    await this.add(row)
  }

  async updatePD(row) {
    this.typeData = "PD"
    this.typeAction = "UPDATE"
    await this.add(row)
  }

  async addRowPD(row?: any) {
    this.typeData = "PD"
    this.typeAction = "ADD"
    await this.add(row, true)
  }

  async add(row?: any, isChildren?) {
    if (!row) this.typeAction = "ADD"

    const modalQD = this.modal.create({
      nzTitle: 'MẶT HÀNG SỐ LƯỢNG VÀ GIÁ TRỊ HÀNG DỰ TRỮ QUỐC GIA',
      nzContent: DialogThemMoiDmNhomHangComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: row,
        typeData: this.typeData,
        typeAction: this.typeAction,
        isChildren: isChildren
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        if (this.typeData === "TH") {
          if (this.typeAction === "ADD") {
            if (isChildren) {
              this.addDataTH({
                ...row,
                ...data
              })
            } else this.addDataTH(data)
          } else
            this.updateDataTH({
              ...row,
              ...data
            })
        }
        if (this.typeData === "PD") {
          if (this.typeAction === "ADD") {
            if (isChildren) {
              this.addDataPD({
                ...row,
                ...data
              })
            } else this.addDataPD(data)
          } else
            this.updateDataPD({
              ...row,
              ...data
            })
        }
        this.updateDataTable()
      }
    });
  }

  addDataTH(data) {
    if (data.isChildren) {
      this.dsHangTH.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idVirtual: uuidv4.v4(),
        edit: false,
        isParent: false,
        type: this.typeData
      })
      const hangTH = this.dsHangTH.find(item => item.idParent === data.idParent)
      const index = this.dsHangTH.findIndex(item => item.idParent === data.idParent)
      const tongGiaTri = Number(hangTH.tongGiaTri) + Number(data.tongGiaTri)
      this.dsHangTH[index].tongGiaTri = tongGiaTri;

      this.viewTableTH()

      return
    }
    if (data.isMatHang) {
      const parent = {
        ...data,
        idVirtual: uuidv4.v4(),
        type: this.typeData
      }
      this.dsHangTH.push({
        danhMuc: parent.danhMuc,
        nhomHang: parent.nhomHang,
        donViTinh: parent.donViTinh,
        tongGiaTri: parent.tongGiaTri,
        idVirtual: parent.idVirtual,
        idParent: parent.idVirtual,
        isParent: true,
        edit: false,
        type: this.typeData
      })
      this.dsHangTH.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idParent: parent.idVirtual,
        idVirtual: uuidv4.v4(),
        edit: false,
        type: this.typeData
      })
    } else {
      const uuid = uuidv4.v4()
      this.dsHangTH.push({
        ...data,
        tongGiaTri: data.thanhTienTrongNam,
        isParent: true,
        idVirtual: uuid,
        idParent: uuid,
        edit: false,
        type: this.typeData
      })
    }


    this.viewTableTH()
  }

  updateDataTH(data) {
    const index = this.dsHangTH.findIndex(item => data.id ? item.id == data.id : item.idVirtual === data.idVirtual)
    this.dsHangTH[index] = data

    const iParent = this.dsHangTH.findIndex(item => (item.idParent === data.idParent) && item.isParent)
    const tongGiaTri = this.dsHangTH.filter(item => (item.idParent === data.idParent) && !item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    this.dsHangTH[iParent].tongGiaTri = tongGiaTri;

    this.viewTableTH()

  }

  viewTableTH() {
    let tableTHs = []
    this.dsHangTH.forEach(element => {
      if (element.isParent) {
        const dsChildren = this.dsHangTH.filter(item => item.idParent === element.idParent)
        tableTHs = tableTHs.concat(dsChildren)
      }
    });
    let tongKinhPhiDaTh = this.dsHangTH.filter(item => item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
    this.formData.patchValue({
      tongKinhPhiDaTh,
      tongKinhPhiDaThBc
    })
    this.dsHangTH = cloneDeep(tableTHs)
  }

  addDataPD(data) {
    if (data.isChildren) {
      this.dsHangPD.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idVirtual: uuidv4.v4(),
        edit: false,
        isParent: false,
        type: this.typeData
      })
      const hangPD = this.dsHangPD.find(item => item.idParent === data.idParent)
      const index = this.dsHangPD.findIndex(item => item.idParent === data.idParent)
      const tongGiaTri = Number(hangPD.tongGiaTri) + Number(data.tongGiaTri)
      this.dsHangPD[index].tongGiaTri = tongGiaTri;

      this.viewTablePD()

      return
    }
    if (data.isMatHang) {
      const parent = {
        ...data,
        idVirtual: uuidv4.v4(),
        type: this.typeData
      }
      this.dsHangPD.push({
        danhMuc: parent.danhMuc,
        nhomHang: parent.nhomHang,
        donViTinh: parent.donViTinh,
        tongGiaTri: parent.tongGiaTri,
        idVirtual: parent.idVirtual,
        idParent: parent.idVirtual,
        isParent: true,
        edit: false,
        type: this.typeData
      })
      this.dsHangPD.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idParent: parent.idVirtual,
        idVirtual: uuidv4.v4(),
        edit: false,
        type: this.typeData
      })
    } else {
      const uuid = uuidv4.v4()
      this.dsHangPD.push({
        ...data,
        tongGiaTri: data.thanhTienTrongNam,
        isParent: true,
        idVirtual: uuid,
        idParent: uuid,
        edit: false,
        type: this.typeData
      })
    }
    this.viewTablePD()
  }

  updateDataPD(data) {
    const index = this.dsHangPD.findIndex(item => data.id ? item.id == data.id : item.idVirtual === data.idVirtual)
    this.dsHangPD[index] = data

    const iParent = this.dsHangPD.findIndex(item => (item.idParent === data.idParent) && item.isParent)
    const tongGiaTri = this.dsHangPD.filter(item => (item.idParent === data.idParent) && !item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    this.dsHangPD[iParent].tongGiaTri = tongGiaTri;

    this.viewTablePD()
  }

  viewTablePD() {
    let tablePDs = []
    this.dsHangPD.forEach(element => {
      if (element.isParent) {
        const dsChildren = this.dsHangPD.filter(item => item.idParent === element.idParent)
        tablePDs = tablePDs.concat(dsChildren)
      }
    });
    this.dsHangPD = cloneDeep(tablePDs)
  }

  updateDataTable() {
    this.danhSach = []
    this.danhSach = this.danhSach.concat(this.dsHangTH)
    this.danhSach = this.danhSach.concat(this.dsHangPD)
  }

  xoa(row, type) {
    if (type === "TH") {
      if (row.id)
        this.dsHangTH = this.dsHangTH.filter(item => item.id !== row.id)
      else
        this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual)
      if (row.isParent)
        this.dsHangTH = this.dsHangTH.filter(item => item.idParent !== row.idParent)

      let tongKinhPhiDaTh = this.dsHangTH.reduce((prev, cur) => prev + cur.tongGiaTri, 0);
      if (tongKinhPhiDaTh > 0) {
        let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
        this.formData.patchValue({
          tongKinhPhiDaTh,
          tongKinhPhiDaThBc
        })
      } else {
        this.formData.patchValue({
          tongKinhPhiDaTh: "",
          tongKinhPhiDaThBc: ""
        })
      }

      this.dsHangTH = cloneDeep(this.dsHangTH)
    }
    if (type === "PD") {
      if (row.id)
        this.dsHangPD = this.dsHangPD.filter(item => item.id !== row.id)
      else
        this.dsHangPD = this.dsHangPD.filter(item => item.idVirtual !== row.idVirtual)


      if (row.isParent)
        this.dsHangPD = this.dsHangPD.filter(item => item.idParent !== row.idParent)

      this.dsHangPD = cloneDeep(this.dsHangPD)
    }
    this.updateDataTable()
  }
}
