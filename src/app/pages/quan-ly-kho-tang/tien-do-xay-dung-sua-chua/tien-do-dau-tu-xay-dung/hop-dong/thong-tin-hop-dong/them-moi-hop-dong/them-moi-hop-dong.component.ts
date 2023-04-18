import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetKqLcnt.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {HopdongService} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/hopdong.service";
import {
  CongViec
} from "../../../quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt.component";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {
  DialogQdPdKhlcntComponent
} from "../../../../../../../components/dialog/ql-kho-tang/dialog-qd-pd-khlcnt/dialog-qd-pd-khlcnt.component";
import {
  DialogQdPdKqlcntComponent
} from "../../../../../../../components/dialog/ql-kho-tang/dialog-qd-pd-kqlcnt/dialog-qd-pd-kqlcnt.component";

@Component({
  selector: 'app-them-moi-hop-dong',
  templateUrl: './them-moi-hop-dong.component.html',
  styleUrls: ['./them-moi-hop-dong.component.scss']
})
export class ThemMoiHopDongComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  @Input()
  flagThemMoi: string;
  STATUS = STATUS;
  idPhuLuc: number;
  isViewPl: boolean
  isViewHd: boolean = false;
  hauToSoHd = "/" + dayjs().get('year') + "/HĐMB";
  listQdPdKqlcnt: any[] = [];
  listHinhThucHopDong: any[] = []
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listGoiThau: any[] = [];
  listNhaThau: any[] = [];
  listFile: any[] = []
  listPhuLuc: any[] = [];
  dataKlcv: any[] = [];
  dataKlcvEdit: { [key: string]: { edit: boolean; data: KhoiLuongCongViec } } = {};
  rowItemKlcv: KhoiLuongCongViec = new KhoiLuongCongViec();
  thanhTien: number = 0;
  thanhTienBangChu: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService,
    private hopdongService: HopdongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      idQdPdKqlcnt: [null, Validators.required],
      soQdPdKqlcnt: [null, Validators.required],
      ngayKyKqlcnt: [],
      idQdPdKhlcnt: [null, Validators.required],
      soQdPdKhlcnt: [null, Validators.required],
      tenGoiThau: [null, Validators.required],
      idGoiThau: [null, Validators.required],
      soHd: [null, Validators.required],
      tenHd: [null, Validators.required],
      ngayHieuLuc: [null, Validators.required],
      ghiChuHieuLuc: [],
      loaiHopDong: [null, Validators.required],
      tenLoaiHopDong: [],
      ghiChuLoaiHd: [],
      thoiGianThHd: [null, Validators.required],
      thoiGianBh: [],
      loai: ['00'],
      ghiChu: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      cdtTen: [null, Validators.required],
      cdtDiaChi: [null, Validators.required],
      cdtMst: [null, Validators.required],
      cdtNguoiDaiDien: [null, Validators.required],
      cdtChucVu: [null, Validators.required],
      cdtSdt: [null, Validators.required],
      cdtStk: [null, Validators.required],
      dvccTen: [],
      dvccDiaChi: [],
      dvccMst: [],
      dvccNguoiDaiDien: [],
      dvccChucVu: [],
      dvccSdt: [],
      dvccStk: [],
      thanhTien: [],
      tenDuAn: [],
      thanhTienBangChu: [],
      fileDinhKems: [null],
      listKtXdscTdxdHopDongKlcv: [[]]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadQdPdKqlcnt(),
        // this.loadNguonVon(),
        // this.loadPhuongThucLcnt(),
        // this.loadHinhThucLcnt(),
        this.loadLoaiHd()
      ]);
      if (this.idInput) {
        await this.detail(this.idInput)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  async save(isKy?) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.formData.value.soHd = this.formData.value.soHd + this.hauToSoHd;
    if (this.dataKlcv && this.dataKlcv.length > 0) {
      this.formData.value.listKtXdscTdxdHopDongKlcv = this.dataKlcv;
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
      let res = await this.createUpdate(this.formData.value)
      if (res.msg == MESSAGE.SUCCESS) {
        this.approve(res.id, STATUS.DA_KY, 'Ký hợp đồng');
      }
    } else {
      this.createUpdate(this.formData.value)
    }
  }

  async loadLoaiHd() {
    // List loại hợp đồng
    this.listHinhThucHopDong = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listHinhThucHopDong = resNv.data;
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
          tenDuAn:data.tenDuAn,
          cdtDiaChi: data.diaChi
        })
        //get danh sách gói thầu thành công (đã có đơn vị trúng thầu).
        let res = await this.quyetdinhpheduyetKqLcntService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.listGoiThau = res.data.listKtXdscQuyetDinhPdKqlcntDsgt.filter(item => item.trangThai == STATUS.THANH_CONG);
        }
        //Lấy danh sách nhà thầu tham gia đấu thầu cho qd pd khlcnt
        let resp = await this.quyetdinhpheduyetKhlcntService.getDetail(data.idQdPdKhlcnt);
        if (resp.msg == MESSAGE.SUCCESS) {
          this.listNhaThau = resp.data.listKtXdscQuyetDinhPdKhlcntDsnt ? resp.data.listKtXdscQuyetDinhPdKhlcntDsnt.filter(item => item.trangThai == STATUS.TRUNG_THAU) : [];
        }
      }
    })
  }

  redirectToPhuLuc(isView: boolean, id: number) {
    this.idPhuLuc = id;
    this.isViewHd = true;
    this.isViewPl = isView;
  }

  goBackPl(event) {
    this.isViewHd = false;
    if (event) {
      this.detail(this.idInput)
    }
  }

  async detail(id) {
    //   this.spinner.show();
    //   try {
    //     let res = await this.hopDongService.getDetail(id);
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (res.data) {
    //         const data = res.data;
    //         this.changeSoQdMs(data.soQdpdKhMuaSam);
    //         this.helperService.bidingDataInFormGroup(this.formData, data);
    //         this.formData.patchValue({
    //           soHopDong: this.formData.value.soHopDong ? this.formData.value.soHopDong.split('/')[0] : null
    //         })
    //         this.fileDinhKem = data.listFileDinhKems;
    //         this.dataTable = data.listQlDinhMucHdLoaiHh;
    //         this.listPhuLuc = data.listPhuLuc
    //         this.listDiaDiem = data.listQlDinhMucHdDiaDiemNh;
    //         this.buildDiaDiemTc()
    //         this.updateEditCache()
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //       this.spinner.hide();
    //     }
    //   } catch (e) {
    //     this.notification.error(MESSAGE.ERROR, e);
    //     this.spinner.hide();
    //   } finally {
    //     this.spinner.hide();
    //   }
  }

  deleteDetail(item: any, roles?) {
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

  addKlCongViec() {
    if (!this.rowItemKlcv.tenCongViec || !this.rowItemKlcv.donViTinh || !this.rowItemKlcv.donGia || !this.rowItemKlcv.khoiLuong) {
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

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  updateEditKLCongViecCache(): void {
    if (this.dataKlcv) {
      this.dataKlcv.forEach((item, index) => {
        this.dataKlcvEdit[index] = {
          edit: false,
          data: {...item},
        };
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
    if (!this.dataKlcvEdit[idx].data.tenCongViec || !this.dataKlcvEdit[idx].data.donViTinh || !this.dataKlcvEdit[idx].data.donGia || !this.dataKlcvEdit[idx].data.khoiLuong) {
      this.notification.error(MESSAGE.ERROR, "Yêu cầu nhập đủ thông tin.");
      return;
    }
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
