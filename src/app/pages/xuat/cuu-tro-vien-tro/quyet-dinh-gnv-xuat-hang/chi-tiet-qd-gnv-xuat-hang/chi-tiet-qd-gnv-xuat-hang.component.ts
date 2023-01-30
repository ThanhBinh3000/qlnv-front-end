import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhGiaoNvCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {DanhMucTieuChuanService} from "../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../constants/message";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import {STATUS} from "../../../../../constants/status";
import * as uuid from "uuid";
import {DonviService} from "../../../../../services/donvi.service";

@Component({
  selector: 'app-chi-tiet-qd-gnv-xuat-hang',
  templateUrl: './chi-tiet-qd-gnv-xuat-hang.component.html',
  styleUrls: ['./chi-tiet-qd-gnv-xuat-hang.component.scss']
})
export class ChiTietQdGnvXuatHangComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output() showListEvent = new EventEmitter<any>();
  private flagInit = false;
  public dsQdPd: any;
  public dsNoiDung: any;
  public dsDonVi: any;
  public dsDiemKho: any;
  public dsLoKho: any;
  public dsLoKhoFilter: any;
  expandSetString = new Set<string>();
  noiDungCuuTroView = [];
  noiDungRow: any = {};

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
      /*noiDungCuuTroView: new FormArray([this.fb.group({
        idVirtual: [],
        label: [],
        childData: new FormArray([this.fb.group({
          idVirtual: [],
          label: [],
          childData: new FormArray([this.fb.group({
            idVirtual: [],
            maDvi: [],
            maDiaDiem: [],
            tenCloaiVthh: [],
            tongTichLuong: [],
            tonKho: [],
            soLuong: [],
            donViTinh: [],
            trangThai: [],
            tenChiCuc: [],
            tenDiemKho: [],
            tenNhaKho: [],
            tenNganKho: [],
            tenLoKho: [],
          })])
        })])
      })])*/
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDsQdPd(),
        this.loadDsDonVi(),
        this.loadDsDiemKho(),
        this.loadDsLoKho(),

        /*this.dsLoaiHinhNhapXuat(),
        this.dsKieuNhapXuat(),
        */
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
            //      res.data.soDxuat = res.data.soDxuat.split('/')[0];
            this.formData.patchValue(res.data);
            if (this.userService.isChiCuc()) {
              this.dsDonVi = [{tenDvi: this.userInfo.TEN_DVI, maDvi: this.userInfo.MA_DVI}]
              this.noiDungRow.maDvi = this.userInfo.MA_DVI;
              this.formData.value.noiDungCuuTro = res.data.noiDungCuuTro.filter(s => s.maDvi === this.userInfo.MA_DVI)
              this.dsQdPd = [{id: this.formData.value.idQdPd, soQd: this.formData.value.soQdPd}]
              this.dsNoiDung = this.formData.value.noiDungCuuTro.reduce((prev, cur) => {
                if (!prev.some(s => s.noiDung === cur.noiDung)) {
                  prev.push({noiDung: cur.noiDung, soLuongGiao: cur.soLuongGiao})
                }
                return prev;
              }, [])
              console.log(this.dsNoiDung);
            }
            let dataView = chain(this.formData.value.noiDungCuuTro)
              .groupBy("noiDung")
              .map((value, key) => {
                let rs = chain(value)
                  .groupBy("tenChiCuc")
                  .map((v, k) => {
                      if (v.find((s) => s.tenDiemKho != null)) {
                        return {
                          idVirtual: uuid.v4(),
                          tenChiCuc: k,
                          soLuongGiao: v[0].soLuongGiao,
                          tenCloaiVthh: v[0].tenCloaiVthh,
                          childData: v
                        }
                      } else {
                        return {
                          idVirtual: uuid.v4(),
                          tenChiCuc: k,
                          soLuongGiao: v[0].soLuongGiao,
                          tenCloaiVthh: v[0].tenCloaiVthh,
                        }
                      }
                    }
                  ).value();
                if (value.find((s) => s.tenChiCuc != null)) {
                  console.log(111111)
                  return {idVirtual: uuid.v4(), noiDung: key, childData: rs};
                } else {
                  console.log(22222)
                  return {idVirtual: uuid.v4(), noiDung: key};
                }
              }).value();
            this.noiDungCuuTroView = dataView
            console.log(dataView, 98766)
            this.expandAll()
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
              this.formData.patchValue(res.data)
              this.formData.patchValue({
                soQdPd: soQdPd,
                soLuong: res.data.tongSoLuong,
                noiDungCuuTro: res.data.thongTinQuyetDinh
              })
              let dataView = chain(this.formData.value.noiDungCuuTro)
                .groupBy("noiDung")
                .map((value, key) => {
                  return {idVirtual: uuid.v4(), noiDung: key, soLuong: value[0].soLuong, tenCloaiVthh: 'haha1'};
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
      // namKh: this.formData.get('nam').value,
      nam: 2022,
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

  addRow() {
    if (this.userService.isCuc()) {
      this.noiDungRow.idVirtual = uuid.v4();
      this.noiDungRow.tenChiCuc = this.dsDonVi.find(s => s.maDvi === this.noiDungRow.maDvi).tenDvi;
      this.noiDungRow.tenCloaiVthh = this.formData.value.tenCloaiVthh;
      let existsRow = this.formData.value.noiDungCuuTro.findIndex(s => s.noiDung === this.noiDungRow.noiDung && s.maDvi === this.noiDungRow.maDvi);
      if (existsRow >= 0) {
        this.formData.value.noiDungCuuTro.splice(existsRow, 1, this.noiDungRow)
      } else {
        this.formData.value.noiDungCuuTro.push(this.noiDungRow)
      }
      this.formData.value.noiDungCuuTro = this.formData.value.noiDungCuuTro.filter(s => {
        if (s.noiDung != this.noiDungRow.noiDung || s.tenChiCuc)
          return s;
      }).sort((a, b) => a.noiDung?.toLowerCase().localeCompare(b.noiDung?.toLowerCase()));
      let dataView = chain(this.formData.value.noiDungCuuTro)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenChiCuc")
            .map((v, k) => {
              return ({
                idVirtual: uuid.v4(),
                tenChiCuc: k,
                noiDung: key,
                maDvi: v[0].maDvi,
                soLuongGiao: +v[0].soLuongGiao,
                soLuongXuat: +v[0].soLuongXuat,
                tenCloaiVthh: v[0].tenCloaiVthh,
              })
            }).value();
          if (rs.find(s => s.tenChiCuc != 'undefined')) {
            return {idVirtual: uuid.v4(), noiDung: key, childData: rs};
          } else {
            return {idVirtual: uuid.v4(), noiDung: key};
          }
        }).value();
      /*let dataView = chain(this.formData.value.noiDungCuuTro)
        .groupBy("noiDung")
        .map((value, key) => {
          return {idVirtual: uuid.v4(), noiDung: key, soLuong: value[0].soLuong};
        }).value();*/
      this.noiDungCuuTroView = dataView;
      this.expandAll();
      this.noiDungRow = {}
    } else if (this.userService.isChiCuc()) {
      this.noiDungRow.idVirtual = uuid.v4();
      this.noiDungRow.tenDiemKho = this.dsDiemKho.find(s => s.maDvi === this.noiDungRow.maDiemKho).tenDvi;
      this.noiDungRow.tenLoKho = this.dsLoKho.find(s => s.maDvi === this.noiDungRow.maDiaDiem).tenDvi;
      this.noiDungRow.tenChiCuc = this.userInfo.TEN_DVI;
      this.noiDungRow.tenCloaiVthh = this.formData.value.tenCloaiVthh;
      this.noiDungRow.soLuongGiao = this.dsNoiDung.find(s => s.noiDung === this.noiDungRow.noiDung)?.soLuongGiao;

      let existsRow = this.formData.value.noiDungCuuTro.findIndex(s =>
        s.noiDung === this.noiDungRow.noiDung && s.maDiaDiem === this.noiDungRow.maDiaDiem
      );
      if (existsRow >= 0) {
        this.formData.value.noiDungCuuTro.splice(existsRow, 1, this.noiDungRow)
      } else {
        this.formData.value.noiDungCuuTro.push(this.noiDungRow)
      }
      this.formData.value.noiDungCuuTro = this.formData.value.noiDungCuuTro
        .filter(s => s.maDiaDiem)
        .sort((a, b) => a.noiDung?.toLowerCase().localeCompare(b.noiDung?.toLowerCase()));
      let dataView = chain(this.formData.value.noiDungCuuTro)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenChiCuc")
            .map((v, k) => {
              return ({
                idVirtual: uuid.v4(),
                tenChiCuc: k,
                noiDung: key,
                soLuongGiao: +v[0].soLuongGiao,
                soLuongXuat: +v[0].soLuongXuat,
                tenCloaiVthh: v[0].tenCloaiVthh,
                childData: v
              })
            }).value();
          if (rs.find(s => s.tenChiCuc != 'undefined')) {
            return {idVirtual: uuid.v4(), noiDung: key, childData: rs};
          } else {
            return {idVirtual: uuid.v4(), noiDung: key};
          }
        }).value();
      this.noiDungCuuTroView = dataView;
      this.expandAll();
      this.noiDungRow = {}
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

  async loadDsDiemKho() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "MLK"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDiemKho = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsLoKho() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI + "______",
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoKho = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeDiemKho() {
    this.noiDungRow.maDiaDiem = null;
    this.dsLoKhoFilter = this.dsLoKho.filter(s => s.maDvi.substring(0, 10) === this.noiDungRow.maDiemKho);
  }
}
