import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { chain } from 'lodash';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhGiaoNvCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { DanhMucTieuChuanService } from "../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import dayjs from "dayjs";
import { MESSAGE } from "../../../../../constants/message";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import { STATUS } from "../../../../../constants/status";
import * as uuid from "uuid";
import { DonviService } from "../../../../../services/donvi.service";

@Component({
  selector: 'app-thong-tin-qd-gnv-xuat-hang',
  templateUrl: './thong-tin-qd-gnv-xuat-hang.component.html',
  styleUrls: ['./thong-tin-qd-gnv-xuat-hang.component.scss']
})
export class ThongTinQdGnvXuatHangComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output() showListEvent = new EventEmitter<any>();
  private flagInit = false;
  public dsQdPd: any;
  public dsNoiDung: any;
  public dsDonVi: any;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  expandSetString = new Set<string>();
  noiDungCuuTroView = [];
  noiDungRow: any = {};
  isVisible = false;
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private danhMucTieuChuanService: DanhMucTieuChuanService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      soQd: [],
      maDvi: [],
      ngayKy: [],
      idQdPd: [],
      soQdPd: [],
      soBbHaoDoi: [],
      soBbTinhKho: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenVthh: [],
      tongSoLuong: [],
      thoiGianGiaoNhan: [],
      trichYeu: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      trangThaiXh: [],
      tenTrangThaiXh: [],
      lyDoTuChoi: [],
      noiDungCuuTro: [],
      donViTinh: ['kg'],
      tenDvi: [],
      soLuong: [0],
      canCu: [],
      fileDinhKem: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tonKhoChiCuc: [],
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDsQdPd(),
        this.loadDsDonVi(),
        this.loadDiemKho()
      ])
      await this.loadDetail(this.id)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.flagInit = true;
      this.spinner.hide();
    }
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.value.noiDungCuuTro.forEach(s => s.idVirtual = uuid.v4());
            this.buildTableView();

          }

        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {

    }

  }
  buildTableView() {
    let dataView = chain(this.formData.value.noiDungCuuTro)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenChiCuc")
          .map((v, k) => ({
            idVirtual: uuid.v4(),
            tenChiCuc: k,
            soLuongXuatChiCuc: v[0].soLuongXuatChiCuc,
            tenCloaiVthh: v[0].tenCloaiVthh,
            tonKhoChiCuc: v[0].tonKhoChiCuc,
            childData: v
          })
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
        let donViTinh = value[0].donViTinh;
        return { idVirtual: uuid.v4(), noiDung: key, soLuongXuat: soLuongXuat, childData: rs, donViTinh: donViTinh };
      }).value();
    this.noiDungCuuTroView = dataView
    this.expandAll()

  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeQdPd(id) {
    if (id && this.flagInit) {
      try {
        this.spinner.show();
        this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              let soQdPd = res.data.soQd
              delete res.data.trangThai
              delete res.data.tenTrangThai
              delete res.data.id
              delete res.data.soQd
              delete res.data.nam
              delete res.data.canCu
              delete res.data.fileDinhKem
              this.formData.patchValue(res.data)
              this.formData.patchValue({
                soQdPd: soQdPd,
                soLuong: res.data.tongSoLuong,
                noiDungCuuTro: res.data.thongTinQuyetDinh
              })
              let dataView = chain(this.formData.value.noiDungCuuTro)
                .groupBy("noiDung")
                .map((value, key) => {
                  return { idVirtual: uuid.v4(), noiDung: key, soLuong: value[0].soLuong, tenCloaiVthh: '' };
                }).value();
              this.noiDungCuuTroView = dataView;
              this.dsNoiDung = dataView
            }
          }
        })
      } catch (e) {
        console.log('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  async loadDsQdPd() {
    this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
      trangThai: STATUS.BAN_HANH,
      nam: this.formData.get('nam').value,
      // nam: 2022,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dsQdPd = data.content;
        }
      } else {
        this.dsQdPd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async saveAndSend() {
    this.formData.patchValue({
      noiDungCuuTro: this.flattenTree(this.noiDungCuuTroView)
    })
    await this.createUpdate(this.formData.value);
    await this.approve(this.id, STATUS.CHO_DUYET_TP, 'Bạn có muốn gửi duyệt ?');

  }

  async save() {
    this.formData.patchValue({
      noiDungCuuTro: this.flattenTree(this.noiDungCuuTroView)
    })
    console.log(this.formData.value)
    await this.createUpdate(this.formData.value);
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  expandAll() {
    this.noiDungCuuTroView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  async loadDsDonVi() {
    const res = await this.donViService.layDonViCon();
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data.filter(s => !s.type);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
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
          if (element && element.capDvi == '2' && element.children) {
            this.listChiCuc = [
              ...this.listChiCuc,
              ...element.children
            ]
          }
        });
      };
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho() {
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
    this.noiDungRow.maNhaKho = null;
    this.noiDungRow.maNganKho = null;
    this.noiDungRow.maLoKho = null;
    let diemKho = this.listDiemKho.filter(x => x.key == this.noiDungRow.maDiemKho);
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      this.noiDungRow.tenDiemKho = diemKho[0].tenDvi;
      this.noiDungRow.soLuongDiemKho = diemKho[0].soLuongDiemKho;
    }
  }

  changeNhaKho() {
    this.listNganKho = [];
    this.listNganLo = [];
    this.noiDungRow.maNganKho = null;
    this.noiDungRow.maLoKho = null;
    let nhaKho = this.listNhaKho.filter(x => x.key == this.noiDungRow.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      this.noiDungRow.tenNhaKho = nhaKho[0].tenDvi
    }
  }

  changeNganKho() {
    this.listNganLo = [];
    this.noiDungRow.maLoKho = null;
    let nganKho = this.listNganKho.filter(x => x.key == this.noiDungRow.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
      this.noiDungRow.tenNganKho = nganKho[0].tenDvi
    }
  }

  changeLoKho() {
    let loKho = this.listNganLo.filter(x => x.key == this.noiDungRow.maLoKho);
    if (loKho && loKho.length > 0) {
      this.noiDungRow.tenLoKho = loKho[0].tenDvi
    }
  }


  themDiaDiemNhap(lv0: any, lv1: any, lv2: any) {

    let currentRowLv0 = this.noiDungCuuTroView.find(s => s.idVirtual == lv0.idVirtual)
    this.noiDungRow.noiDung = currentRowLv0.noiDung;
    let currentRowLv1 = currentRowLv0.childData.find(s => s.idVirtual == lv1.idVirtual)
    this.noiDungRow.tenChiCuc = currentRowLv1.tenChiCuc;
    this.noiDungRow.tenCloaiVthh = currentRowLv1.tenCloaiVthh;
    this.noiDungRow.tonKhoChiCuc = currentRowLv1.tonKhoChiCuc;
    this.noiDungRow.soLuongXuatChiCuc = currentRowLv1.soLuongXuatChiCuc;
    let currentRowLv2 = currentRowLv1.childData.find(s => s.idVirtual == lv2[0].idVirtual);
    this.noiDungRow.idHdr = currentRowLv2.idHdr;
    this.noiDungRow.maDviChiCuc = currentRowLv2.maDviChiCuc;
    this.noiDungRow.cloaiVthh = currentRowLv2.cloaiVthh;
    this.noiDungRow.soLuongXuatChiCuc = currentRowLv2.soLuongXuatChiCuc;
    this.noiDungRow.loaiVthh = currentRowLv2.loaiVthh;
    this.noiDungRow.donViTinh = currentRowLv2.donViTinh;
    this.noiDungRow.edit = false;
    console.log(this.noiDungRow.edit, 123);
    let index = this.formData.value.noiDungCuuTro.findIndex(s => s.idVirtual === this.noiDungRow.idVirtual);
    let table = this.formData.value.noiDungCuuTro;
    console.log(1234);
    if (index != -1) {
      table.splice(index, 1, this.noiDungRow);
    } else {
      table = [...table, this.noiDungRow]
    }
    this.formData.patchValue({
      noiDungCuuTro: table
    })
    this.buildTableView();
    this.isVisible = false;
    this.noiDungRow = {};
  }

  validatorDdiemNhap(indexTable): boolean {
    let soLuong = 0;

    soLuong += this.noiDungRow.soLuong
    if (soLuong > +this.formData.value.soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng thêm mới không được vượt quá số lượng của chi cục")
      return false;
    }

    return true
  }

  validateButtonThem(typeButton): boolean {
    if (typeButton == 'ddiemNhap') {
      if (this.noiDungRow.maDiemKho && this.noiDungRow.maNhaKho && this.noiDungRow.maNganKho && this.noiDungRow.soLuong > 0) {
        return true
      } else {
        return false;
      }
    } else {
      if (this.noiDungRow.maChiCuc && this.noiDungRow.soLuong > 0) {
        return true
      } else {
        return false;
      }
    }

  }


  clearDiaDiemNhap() {
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
    this.noiDungRow = {};
  }

  async saveDdiemNhap(statusSave) {
    this.spinner.show();
    this.formData.value.noiDungCuuTro.forEach(item => {
      item.trangThai = statusSave
    })

    let body = this.formData.value

    let res = await this.quyetDinhGiaoNvCuuTroService.updateDdiemNhap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.redirectQdNhapXuat();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }
  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }
  xoaItem(data: any) {
    let noiDungCuuTro;
    if (data.id) {
      noiDungCuuTro = this.formData.value.noiDungCuuTro.filter(s => s.id != data.id);
    } else if (data.idVirtual) {
      noiDungCuuTro = this.formData.value.noiDungCuuTro.filter(s => s.idVirtual != data.idVirtual)
    }
    this.formData.patchValue({
      noiDungCuuTro: noiDungCuuTro
    })
    this.buildTableView();
  }

}

