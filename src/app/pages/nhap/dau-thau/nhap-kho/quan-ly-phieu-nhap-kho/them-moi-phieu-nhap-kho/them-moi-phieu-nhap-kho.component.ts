import { saveAs } from 'file-saver';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
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
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/quanLyPhieuNhapKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'them-moi-phieu-nhap-kho',
  templateUrl: './them-moi-phieu-nhap-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-kho.component.scss'],
})
export class ThemMoiPhieuNhapKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
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
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.create.dvt = "Tấn";
      this.detail.trangThai = "00";
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      await Promise.all([
        this.loadDiemKho(),
        this.loadPhieuKiemTraChatLuong(),
        this.loadDanhMucHang(),
        this.loadSoQuyetDinh(),
      ]);
      await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": "",
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changePhieuKiemTra() {
    let phieuKt = this.listPhieuKiemTraChatLuong.filter(x => x.id == this.detail.phieuKtClId);
    if (phieuKt && phieuKt.length > 0) {
      this.detail.maDiemKho = phieuKt[0].maDiemKho;
      this.detail.maNhaKho = phieuKt[0].maNhaKho;
      this.detail.maNganKho = phieuKt[0].maNganKho;
      this.detail.maNganLo = phieuKt[0].maNganLo;
      this.changeDiemKho(true);
    }
  }

  async loadPhieuKiemTraChatLuong() {
    let body = {
      "maDonVi": this.userInfo.MA_DVI,
      "maHangHoa": this.typeVthh,
      "maNganKho": null,
      "ngayKiemTraDenNgay": null,
      "ngayKiemTraTuNgay": null,
      "ngayLapPhieu": null,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": 1000,
        "orderBy": null,
        "orderType": null,
        "page": 0
      },
      "soPhieu": null,
      "str": null,
      "tenNguoiGiao": null,
      "trangThai": null
    };
    let res = await this.quanLyPhieuKiemTraChatLuongHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listPhieuKiemTraChatLuong = data.content;
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
      let res = await this.quanLyPhieuNhapKhoService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.changeDiemKho(true);
          if (this.detail.hangHoaRes) {
            this.detail.hangHoaList = this.detail.hangHoaRes;
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
    if (this.detail && this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let sum = this.detail?.hangHoaList.map(item => item.soLuongThuc).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorDonGia() {
    if (this.detail && this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let sum = this.detail?.hangHoaList.map(item => item.donGia).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorThanhTien() {
    if (this.detail && this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let sum = this.detail?.hangHoaList.map(item => item.thanhTien).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
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
    let diemKho = this.listDiemKho.filter(x => x.key == this.detail.maDiemKho);
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
    let nhaKho = this.listNhaKho.filter(x => x.key == this.detail.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.detail.maNganKho);
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
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          let res =
            await this.quanLyPhieuNhapKhoService.updateStatus(
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
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          let res =
            await this.quanLyPhieuNhapKhoService.updateStatus(
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

  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành biên bản?',
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
            trangThai: '04',
          };
          let res =
            await this.quanLyPhieuNhapKhoService.updateStatus(
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
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          let res =
            await this.quanLyPhieuNhapKhoService.updateStatus(
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
      let body = {
        "bbNghiemThuKlId": this.detail.soQdNvuNhang,
        "diaChiGiaoNhan": null,
        "ghiChu": null,
        "hangHoaList": this.detail?.hangHoaList,
        "id": this.id,
        "loaiHinhNhap": null,
        "maDiemKho": this.detail?.maDiemKho,
        "maDvi": this.detail.maDvi,
        "maNganLo": this.detail.maNganLo,
        "maNganKho": this.detail.maNganKho,
        "maNhaKho": this.detail.maNhaKho,
        "maQhns": this.detail.maDvi,
        "ngayLap": null,
        "ngayNhapKho": this.detail.ngayNhapKho,
        "ngayQdNvuNhang": this.detail.ngayQdNvuNhang,
        "ngayTao": this.detail.ngayTao,
        "nguoiGiaoHang": this.detail.nguoiGiaoHang,
        "phieuKtClId": this.detail.phieuKtClId,
        "soPhieu": this.detail.soPhieu,
        "soQdNvuNhang": this.detail.soQdNvuNhang,
        "taiKhoanCo": this.detail.taiKhoanCo,
        "taiKhoanNo": this.detail.taiKhoanNo,
        "tenNganLo": null,
        "tenNguoiGiaoNhan": this.detail.nguoiGiaoHang,
        "thoiGianGiaoNhan": this.detail.thoiGianGiaoNhan,
        "qdgnvnxId": this.detail.qdgnvnxId,
      };
      if (this.id > 0) {
        let res = await this.quanLyPhieuNhapKhoService.sua(
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
        let res = await this.quanLyPhieuNhapKhoService.them(
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
