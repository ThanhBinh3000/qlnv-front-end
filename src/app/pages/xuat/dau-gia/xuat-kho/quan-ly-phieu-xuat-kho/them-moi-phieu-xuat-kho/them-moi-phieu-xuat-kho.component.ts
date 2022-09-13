import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/quanLyPhieuKiemNghiemChatLuongHang.service';
import { QuanLyPhieuXuatKhoService } from 'src/app/services/quanLyPhieuXuatKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-them-moi-phieu-xuat-kho',
  templateUrl: './them-moi-phieu-xuat-kho.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho.component.scss']
})
export class ThemMoiPhieuXuatKhoComponent implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  formData: FormGroup;
  idNhapHang: number = 0;
  detailGiaoNhap: any = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listDanhMucHang: any[] = [];
  listSoQuyetDinh: any[] = [];

  taiLieuDinhKemList: any[] = [];
  chungTuKemTheo: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private userService: UserService,
    private quanLyPhieuXuatKhoService: QuanLyPhieuXuatKhoService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNhiemVuXuatHangService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    this.initForm();
    try {
      this.create.dvt = "Tấn";
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      console.log('diem kho');
      await Promise.all([
        this.loadDiemKho(),
        this.loadPhieuKiemTraChatLuong(),
        this.loadSoQuyetDinh(),
      ]);
      await this.loadChiTiet(this.id);
      if (!this.id || this.id === 0) {
        this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  initForm(): void {
    // file đính kèm chưa làm
    this.formData = this.fb.group({
      sqdxId: [this.detail.sqdxId ?? null, [Validators.required]],
      maDvi: [this.detail.maDvi],
      tenDvi: [this.detail.tenDvi],
      spXuatKho: [this.detail.spXuatKho ?? null],
      pknclId: [this.detail.pknclId ?? null, [Validators.required]],
      nguoiNhanHang: [this.detail.nguoiNhanHang ?? null, [Validators.required]],
      boPhan: [this.detail.boPhan ?? null],
      ngayTao: [this.detail.ngayTao ?? new Date()],
      xuatKho: [this.detail.xuatKho ?? new Date()],
      maDiemkho: [this.detail.maDiemkho ?? null, [Validators.required]],
      maNhakho: [this.detail.maNhakho ?? null, [Validators.required]],
      maNgankho: [this.detail.maNgankho ?? null, [Validators.required]],
      maNganlo: [this.detail.maNganlo ?? null, [Validators.required]],
      lyDoXuatKho: [this.detail.lyDoXuatKho ?? null],
      ghiChu: [this.detail.ghiChu ?? null, [Validators.required]],
      id: [this.id ?? 0]
    });

    this.formData.controls["sqdxId"].valueChanges.subscribe(async (value) => {
      this.detail.ds = [];
      let res = await this.quyetDinhGiaoNhiemVuXuatHangService.loadChiTiet(value);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.cts && res.data.cts.length > 0) {
          let temp = [];
          res.data.cts.forEach(element => {
            let item = {
              "donGia": element.donGiaKhongThue,
              "dvTinh": element.donViTinh,
              "id": null,
              "maSo": element.maVatTu,
              "pxuatKhoId": null,
              "slThucXuat": element.soLuong,
              "slYeuCau": element.soLuong,
              "ten": element.tenVatTu,
              "thanhTien": element.thanhTien,
            }
            temp.push(item);
          });
          this.detail.ds = temp;
          if (this.detail.ds && this.detail.ds.length > 0) {
            this.detail.tongTien = this.caculatorThanhTien();
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });

    this.formData.controls["maDiemkho"].valueChanges.subscribe(async (value) => {
      this.changeDiemKho(false);
    });

    this.formData.controls["maNhakho"].valueChanges.subscribe(async (value) => {
      this.changeNhaKho(false);
    });

    this.formData.controls["maNgankho"].valueChanges.subscribe(async (value) => {
      this.changeNganKho();
    });
  }

  async loadSoQuyetDinh() {
    let body = {}
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS && res.data.content.length > 0) {
      this.listSoQuyetDinh = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  // change Số phiểu kiểm nghiệm chất lượng /HSKT
  changePhieuKiemTra() {
    let phieuKt = this.listPhieuKiemTraChatLuong.filter(x => x.id == this.formData.value.pknclId);
    if (phieuKt && phieuKt.length > 0) {
      this.formData.patchValue({
        maDiemkho: phieuKt[0].maDiemKho,
        maNhakho: phieuKt[0].maNhaKho,
        maNgankho: phieuKt[0].maNganKho,
        maNganlo: phieuKt[0].maNganLo,
      });
      this.changeDiemKho(true);
    }
  }

  async loadPhieuKiemTraChatLuong() {
    let body = {
      "maDonVi": this.detail.maDvi,
      "pageSize": 1000,
      "pageNumber": 1,
      "trangThai": null,
    };
    let res = await this.phieuKiemNghiemChatLuongHangService.timKiem(body);

    if (res.msg == MESSAGE.SUCCESS && res.data.content.length > 0) {
      this.listPhieuKiemTraChatLuong = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDanhMucHang() {
    let body = {
      "str": this.typeVthh
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDanhMucHang = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDanhMucHang(item) {
    if (item) {
      let getHang = this.listDanhMucHang.filter(x => x.ten == this.create.tenVatTu);
      if (getHang && getHang.length > 0) {
        item.maVatTu = getHang[0].ma;
        item.donViTinh = getHang[0].maDviTinh;
      }
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quanLyPhieuXuatKhoService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.initForm();
          this.changeDiemKho(true);
          if (this.detail.fileDinhKems) {
            this.chungTuKemTheo = this.detail.fileDinhKems;
          }
        }
      }
    }
    else {
      this.detail.ngayTao = dayjs().format("YYYY-MM-DD");
    }
    this.updateEditCache();
  }

  caculatorSoLuongTN() {
    if (this.detail && this.detail?.ds && this.detail?.ds.length > 0) {
      let sum = this.detail?.ds.map(item => item.soLuongThuc).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorDonGia() {
    if (this.detail && this.detail?.ds && this.detail?.ds.length > 0) {
      let sum = this.detail?.ds.map(item => item.donGia).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorThanhTien() {
    if (this.detail && this.detail?.ds && this.detail?.ds.length > 0) {
      let sum = this.detail?.ds.map(item => item.thanhTien).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
    else {
      return "0";
    }
  }

  deleteRow(data: any) {
    this.detail.hangHoaList = this.detail?.hangHoaList.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  sortTableId() {
    this.detail?.hangHoaList.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  addRow() {
    if (!this.detail?.hangHoaList) {
      this.detail.hangHoaList = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.hangHoaList.length + 1;
    this.checkDataExist(item);
    this.clearItemRow();
  }

  checkDataExist(data) {
    if (this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let index = this.detail?.hangHoaList.findIndex(x => x.maVatTu == data.maVatTu);
      if (index != -1) {
        this.detail.hangHoaList.splice(index, 1);
      }
    }
    else {
      this.detail.hangHoaList = [];
    }
    this.detail.hangHoaList = [
      ...this.detail.hangHoaList,
      data,
    ];
    this.updateEditCache();
  }

  clearItemRow() {
    this.create = {};
    this.create.donViTinh = "Tấn";
  }

  cancelEdit(stt: number): void {
    const index = this.detail?.hangHoaList.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.detail[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.hangHoaList.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.hangHoaList[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  updateEditCache(): void {
    if (this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      this.detail?.hangHoaList.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTien = (item?.soLuongThuc ?? 0) * (item?.donGia ?? 0);
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
    let diemKho = this.listDiemKho.filter(x => x.maDvi == this.formData.value.maDiemkho);
    if (!fromChiTiet) {
      this.detail.maNhaKho = null;
    }
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.maDvi == this.formData.value.maNhakho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.maDvi == this.formData.value.maNgankho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        // this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.quanLyPhieuXuatKhoService.updateStatus(
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
        // this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.quanLyPhieuXuatKhoService.updateStatus(
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
        // this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.quanLyPhieuXuatKhoService.updateStatus(
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = this.formData.value;
      if (body && body.xuatKho) {
        body.xuatKho = dayjs(body.xuatKho).format("YYYY-MM-DD HH:mm:ss")
      }
      body = {
        ...body,
        "ds": this.detail.ds,
        "fileDinhKems": this.chungTuKemTheo,
      };
      console.log(body);
      if (this.id > 0) {
        let res = await this.quanLyPhieuXuatKhoService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.quanLyPhieuXuatKhoService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  print() {

  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
      this.detail.fileDinhKems = this.detail.fileDinhKems.filter((x) => x.idVirtual !== data.id);
    }
  }

  openFile(event) {
    if (!this.isView) {
      let item = {
        id: new Date().getTime(),
        text: event.name,
      };
      if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
        this.uploadFileService
          .uploadFile(event.file, event.name)
          .then((resUpload) => {
            if (!this.detail.fileDinhKems) {
              this.detail.fileDinhKems = [];
            }
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            fileDinhKem.idVirtual = item.id;
            this.detail.fileDinhKems.push(fileDinhKem);
            this.taiLieuDinhKemList.push(item);
          });
      }
    }
  }

  downloadFileKeHoach(event) {
    let body = {
      "dataType": "",
      "dataId": 0
    }
    switch (event) {
      case 'tai-lieu-dinh-kem':
        body.dataType = this.detail.fileDinhKems[0].dataType;
        body.dataId = this.detail.fileDinhKems[0].dataId;
        if (this.taiLieuDinhKemList.length > 0) {
          this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
            saveAs(blob, this.detail.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.detail.fileDinhKems[0].fileName);
          });
        }
        break;
      default:
        break;
    }
  }
  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === '00' ||
      trangThai === '01' ||
      trangThai === '04' ||
      trangThai === '03'
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }


  }


}
