import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {STATUS} from "../../../../../../../constants/status";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import dayjs from 'dayjs';
import {MESSAGE} from "../../../../../../../constants/message";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {
  DialogQdPdKqlcntComponent
} from "../../../../../../../components/dialog/ql-kho-tang/dialog-qd-pd-kqlcnt/dialog-qd-pd-kqlcnt.component";
import {CurrencyMaskInputMode} from "ngx-currency";
import {NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import {
  PhuLucHopDongComponent
} from "../../../../tien-do-dau-tu-xay-dung/hop-dong/thong-tin-hop-dong/phu-luc-hop-dong/phu-luc-hop-dong.component";
import {
  HopdongTdscService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/hopdongTdsc.service";
import {
  QdPheDuyetKhlcntTdsclService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-khlcnt-tdscl.service";
import {
  QuyetdinhpheduyetKqLcntSclService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qdPdKqLcntScl.service";

@Component({
  selector: 'app-them-moi-hop-dong-sctx',
  templateUrl: './them-moi-hop-dong-sctx.component.html',
  styleUrls: ['./them-moi-hop-dong-sctx.component.scss']
})
export class ThemMoiHopDongSctxComponent extends Base2Component implements OnInit {
  @ViewChild('collapseExpand', {static: false}) collapseExpand!: NzCollapsePanelComponent;
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  @Input() idInput: number;
  @Input() flagThemMoi: string;
  @Input() itemGoiThau: any;
  @Input() itemQdPdKhlcnt: any;
  @Input() itemDuAn: any;
  STATUS = STATUS;
  idPhuLuc: number;
  isViewPl: boolean
  isViewHd: boolean = false;
  hauToSoHd = "/" + dayjs().get('year') + "/HĐMB";
  listQdPdKqlcnt: any[] = [];
  listHinhThucThanhToan: any[] = []
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listGoiThau: any[] = [];
  listNhaThau: any[] = [];
  listFile: any[] = []
  listPhuLuc: any[] = [];
  dataKlcv: any[] = [];
  dataKlcvEdit: { [key: string]: { edit: boolean; data: KhoiLuongCongViec } } = {};
  rowItemKlcv: KhoiLuongCongViec = new KhoiLuongCongViec();
  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 0,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  @Output() dataItemHopDong = new EventEmitter<object>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetKhlcntService: QdPheDuyetKhlcntTdsclService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntSclService,
    private hopdongService: HopdongTdscService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      namKeHoach: [null],
      maDvi: [this.userInfo.MA_DVI],
      idQdPdKqlcnt: [null],
      soQdPdKqlcnt: [null],
      ngayKyKqlcnt: [],
      idQdPdKhlcnt: [null],
      soQdPdKhlcnt: [null],
      tenGoiThau: [null],
      idGoiThau: [null],
      soHd: [null],
      tenHd: [null],
      ngayHieuLuc: [null],
      ghiChuHieuLuc: [],
      loaiHopDong: [null],
      tenLoaiHopDong: [],
      ghiChuLoaiHd: [],
      thoiGianThHd: [null],
      thoiGianBh: [],
      ghiChu: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      cdtTen: [null],
      cdtDiaChi: [null],
      cdtMst: [null],
      cdtNguoiDaiDien: [null],
      cdtChucVu: [null],
      cdtSdt: [null],
      cdtStk: [null],
      loaiSuaChua: [null],
      cdtFax: [null],
      cdtMoTai: [null],
      cdtGiayUq: [null],
      dvccTen: [null],
      phuongThucTt: [null],
      tenPhuongThucTt: [null],
      dvccDiaChi: [null],
      dvccMst: [null],
      dvccNguoiDaiDien: [null],
      dvccChucVu: [null],
      dvccSdt: [null],
      dvccStk: [null],
      dvccFax: [null],
      dvccMoTai: [null],
      thanhTien: [],
      tenDuAn: [null],
      idDuAn: [null],
      thanhTienBangChu: [],
      fileDinhKems: [null],
      listKtTdscHopDongKlcv: [[]],
      page: ['01'],
      loai: ['00']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadHinhThucThanhToan();
      if (this.idInput && this.itemGoiThau.hopDong) {
        await this.detail(this.idInput)
      } else {
        this.bindingData();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async bindingData() {
    if (this.itemGoiThau && this.itemQdPdKhlcnt) {
      let rs = await this.quyetdinhpheduyetKqLcntService.getDetail(this.itemGoiThau.idQdPdKqlcnt);
      let dataQdPdKqlcnt;
      let goiThau;
      if (rs.msg == MESSAGE.SUCCESS) {
        dataQdPdKqlcnt = rs.data;
      }
      if (dataQdPdKqlcnt.listKtTdscQuyetDinhPdKqlcntDsgt && dataQdPdKqlcnt.listKtTdscQuyetDinhPdKqlcntDsgt.length) {
        goiThau = dataQdPdKqlcnt.listKtTdscQuyetDinhPdKqlcntDsgt.find(it => it.idGoiThau == this.itemGoiThau.id);
        this.formData.patchValue({
          namKeHoach: this.itemQdPdKhlcnt.namKeHoach,
          idQdPdKqlcnt: this.itemGoiThau.idQdPdKqlcnt,
          soQdPdKhlcnt: this.itemQdPdKhlcnt.soQd,
          idQdPdKhlcnt: this.itemQdPdKhlcnt.id,
          idDuAn: this.itemQdPdKhlcnt.idDuAn,
          tenCongTrinh: this.itemQdPdKhlcnt.tenCongTrinh,
          soQdPdKqlcnt: this.itemQdPdKhlcnt.soQdPdKqlcnt,
          idGoiThau: this.itemGoiThau.id,
          tenGoiThau: this.itemGoiThau.noiDung,
          ngayKyKqlcnt: dataQdPdKqlcnt ? dataQdPdKqlcnt.ngayKy : null,
          loaiHopDong: this.itemGoiThau.loaiHopDong,
          tenLoaiHopDong: this.itemGoiThau.tenLoaiHopDong,
          cdtTen: this.userInfo.TEN_DVI,
          cdtDiaChi: this.userInfo.DON_VI?.diaChi,
          dvccTen: goiThau.ktTdScQuyetDinhPdKhlcntDsnt?.tenNhaThau || null,
          dvccMst: goiThau.ktTdScQuyetDinhPdKhlcntDsnt?.maSoThue || null,
          dvccDiaChi: goiThau.ktTdScQuyetDinhPdKhlcntDsnt?.diaChi || null,
        });
      } else {
        this.notification.warning(MESSAGE.WARNING, "Lỗi dữ liệu");
        return;
      }
    }
  }

  async loadQdPdKqlcnt() {
    this.spinner.show();
    try {
      let body = {
        "paggingReq": {
          "limit": 10,
          "page": this.page - 1
        },
      };
      let res = await this.quyetdinhpheduyetKqLcntService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listQdPdKqlcnt = res.data.content;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  emitDataHopDong(data?) {
    this.dataItemHopDong.emit(data);
  }

  async save(isKy?) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.formData.value.soHd = this.formData.value.soHd + this.hauToSoHd;
    this.formData.value.idDuAn = this.itemDuAn.id
    this.formData.value.tenDuAn = this.itemDuAn.tenCongTrinh
    if (this.dataKlcv && this.dataKlcv.length > 0) {
      this.formData.value.listKtTdscHopDongKlcv = this.dataKlcv;
    } else {
      this.notification.success(MESSAGE.ERROR, "Danh sách khối lượng công việc không được để trống.");
      return;
    }
    if (this.listFileDinhKem && this.listFileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.listFileDinhKem;
    }
    if (this.listPhuLuc && this.listPhuLuc.length > 0) {
      this.formData.value.listPhuLuc = this.listPhuLuc;
    }
    if (isKy) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Ký hợp đồng",
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.createUpdate(this.formData.value);
            if (res) {
              let body = {
                id: res.id,
                trangThai: STATUS.DA_KY,
              }
              let res1 = await this.hopdongService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.emitDataHopDong(res1.data);
              }
            }
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      let res = await this.createUpdate(this.formData.value);
      if (res) {
        this.emitDataHopDong(res);
      }
    }
  }

  async loadHinhThucThanhToan() {
    // List loại hợp đồng
    this.listHinhThucThanhToan = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('PHUONG_THUC_TT');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listHinhThucThanhToan = resNv.data;
    }
  }

  changeGoiThau(event) {
    let item = this.listGoiThau.find(item => item.id == event);
    if (item) {
      this.formData.patchValue({
        tenGoiThau: item.noiDung,
        tenLoaiHopDong: item.tenLoaiHopDong,
        loaiHopDong: item.loaiHopDong
      })
      let nhaThauTrungThau = this.listNhaThau.find(it => it.idGoiThau == item.idGoiThau);
      if (nhaThauTrungThau) {
        this.formData.patchValue({
          dvccTen: nhaThauTrungThau.tenNhaThau,
          dvccDiaChi: nhaThauTrungThau.diaChi,
          dvccMst: nhaThauTrungThau.maSoThue,
          dvccSdt: nhaThauTrungThau.soDienThoai
        })
      }
    }
  }

  chonQdPdKqLCNT() {
    let modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QĐ PD KẾT QUẢ LỰA CHỌN NHÀ THẦU',
      nzContent: DialogQdPdKqlcntComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '700px',
      nzFooter: null,
      nzComponentParams: {
        listQdPdKqlcnt: this.listQdPdKqlcnt,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.listGoiThau = [];
        this.listNhaThau = [];
        this.formData.patchValue({
          idQdPdKhlcnt: data.idQdPdKhlcnt,
          soQdPdKhlcnt: data.soQdPdKhlcnt,
          idQdPdKqlcnt: data.id,
          soQdPdKqlcnt: data.soQd,
          ngayKyKqlcnt: data.ngayKy,
          cdtTen: data.chuDauTu,
          tenDuAn: data.tenDuAn,
          cdtDiaChi: data.diaChi
        })
        //get danh sách gói thầu thành công (đã có đơn vị trúng thầu).
        let res = await this.quyetdinhpheduyetKqLcntService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.listGoiThau = res.data.listKtTdscQuyetDinhPdKqlcntDsgt.filter(item => item.trangThai == STATUS.THANH_CONG);
        }
        //Lấy danh sách nhà thầu tham gia đấu thầu cho qd pd khlcnt
        let resp = await this.quyetdinhpheduyetKhlcntService.getDetail(data.idQdPdKhlcnt);
        if (resp.msg == MESSAGE.SUCCESS) {
          this.listNhaThau = resp.data.listKtTdscQuyetDinhPdKhlcntDsnt ? resp.data.listKtTdscQuyetDinhPdKhlcntDsnt.filter(item => item.trangThai == STATUS.TRUNG_THAU) : [];
        }
      }
    })
  }

  openModalPhuLuc(isView: boolean, id: number) {
    const modalQD = this.modal.create({
      nzTitle: 'PHỤ LỤC HỢP ĐỒNG',
      nzContent: PhuLucHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        dataHdr: this.formData.value,
        id: id,
        isView: isView
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.detail(this.idInput)
      }
    });
    this.collapseExpand.clickHeader();
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.hopdongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soHd: data.soHd ? data.soHd.split('/')[0] : null,
            thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.listPhuLuc = data.listPhuLuc;
          this.dataKlcv = data.listKtTdscHopDongKlcv && data.listKtTdscHopDongKlcv.length > 0 ? data.listKtTdscHopDongKlcv : [];
          this.updateEditKLCongViecCache()
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  deleteDetail(item
                 :
                 any, roles?
  ) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopdongService.delete(body).then(async () => {
            await this.detail(this.idInput);
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  calThanhTien(action, idx?) {
    if (action == 'add') {
      if (this.rowItemKlcv.donGia && this.rowItemKlcv.khoiLuong) {
        this.rowItemKlcv.thanhTien = this.rowItemKlcv.donGia * this.rowItemKlcv.khoiLuong;
      }
    } else {
      if (this.dataKlcvEdit[idx].data.donGia && this.dataKlcvEdit[idx].data.khoiLuong) {
        this.dataKlcvEdit[idx].data.thanhTien = this.dataKlcvEdit[idx].data.khoiLuong * this.dataKlcvEdit[idx].data.donGia;
      }
    }
  }

  addKlCongViec() {
    if (!this.rowItemKlcv.tenCongViec || !this.rowItemKlcv.donGia || !this.rowItemKlcv.khoiLuong) {
      this.notification.error(MESSAGE.ERROR, "Yêu cầu nhập đủ thông tin.");
      return;
    }
    this.rowItemKlcv.thanhTien = this.rowItemKlcv.donGia * this.rowItemKlcv.khoiLuong;
    this.dataKlcv = [...this.dataKlcv, this.rowItemKlcv];
    this.rowItemKlcv = new KhoiLuongCongViec();
    this.updateEditKLCongViecCache();
    this.formData.patchValue({
      thanhTien: this.sumKlCongViec('thanhTien'),
    })
    this.formData.patchValue({
      thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
    })
  }

  convertTien(tien
                :
                number
  ):
    string {
    return convertTienTobangChu(tien);
  }

  updateEditKLCongViecCache()
    :
    void {
    if (this.dataKlcv
    ) {
      this.dataKlcv.forEach((item, index) => {
        this.dataKlcvEdit[index] = {
          edit: false,
          data: {...item},
        };
        item.thanhTien = item.khoiLuong * item.donGia;
      });
    }
  }

  sumKlCongViec(key) {
    if (this.dataKlcv.length > 0) {
      return this.dataKlcv.reduce((a, b) => a + (b[key] || 0), 0);
    }
  }

  editDataKlCongViec(index) {
    this.dataKlcvEdit[index].edit = true;
  }

  deleteKlCongViec(index) {
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
          this.dataKlcv.splice(index, 1);
          this.formData.patchValue({
            thanhTien: this.sumKlCongViec('thanhTien'),
          })
          this.formData.patchValue({
            thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
          })
          this.updateEditKLCongViecCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEditKLCongViec(idx) {
    if (!this.dataKlcvEdit[idx].data.tenCongViec || !this.dataKlcvEdit[idx].data.donGia || !this.dataKlcvEdit[idx].data.khoiLuong) {
      this.notification.error(MESSAGE.ERROR, "Yêu cầu nhập đủ thông tin.");
      return;
    }
    this.dataKlcvEdit[idx].data.thanhTien = this.dataKlcvEdit[idx].data.khoiLuong * this.dataKlcvEdit[idx].data.donGia;
    Object.assign(this.dataKlcv[idx], this.dataKlcvEdit[idx].data);
    this.formData.patchValue({
      thanhTien: this.sumKlCongViec('thanhTien'),
    })
    this.formData.patchValue({
      thanhTienBangChu: this.convertTien(this.formData.value.thanhTien)
    })
    this.dataKlcvEdit[idx].edit = false;
  }

  cancelEditKLCongViec(idx) {
    this.dataKlcvEdit[idx] = {
      data: {...this.dataKlcv[idx]},
      edit: false
    };
  }

  async delete(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopdongService.delete(body).then(async () => {
            this.emitDataHopDong();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  refreshKLCongViec() {
    this.rowItemKlcv = new KhoiLuongCongViec();
  }
}

export class KhoiLuongCongViec {
  id: number;
  tenCongViec: string;
  donViTinh: string;
  khoiLuong: number;
  donGia: number;
  thanhTien: number;
  ghiChu: string;
}
