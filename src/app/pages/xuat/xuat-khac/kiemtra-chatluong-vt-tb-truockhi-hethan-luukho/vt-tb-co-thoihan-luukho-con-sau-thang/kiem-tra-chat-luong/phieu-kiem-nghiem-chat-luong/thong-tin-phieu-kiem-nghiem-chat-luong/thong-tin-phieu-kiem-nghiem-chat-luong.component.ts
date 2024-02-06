import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from '../../../../../../../../components/base2/base2.component';
import { PhuongPhapLayMau } from '../../../../../../../../models/PhuongPhapLayMau';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DanhMucService } from '../../../../../../../../services/danhmuc.service';
import {
  QuyetDinhGiaoNvXuatHangService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service';
import {
  PhieuXuatNhapKhoService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service';
import { KhCnQuyChuanKyThuat } from '../../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import {
  BienBanLayMauVtKtclService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BienBanLayMauVtKtcl.service';
import dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { STATUS } from '../../../../../../../../constants/status';
import { FileDinhKem } from '../../../../../../../../models/FileDinhKem';
import { MESSAGE } from '../../../../../../../../constants/message';
import {
  DialogTableSelectionComponent,
} from '../../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { FILETYPE, PREVIEW } from '../../../../../../../../constants/fileType';
import {
  PhieuKdclVtKtclService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuKdclVtKtcl.service';
import { MangLuoiKhoService } from '../../../../../../../../services/qlnv-kho/mangLuoiKho.service';
import { DataService } from '../../../../../../../../services/data.service';

@Component({
  selector: 'app-thong-tin-phieu-kiem-nghiem-chat-luong',
  templateUrl: './thong-tin-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./thong-tin-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThongTinPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {

  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  LIST_DANH_GIA: any[] = [
    { value: 0, label: 'Không đạt' },
    { value: 1, label: 'Đạt' },
  ];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maPhieu: string;
  radioValue: any;
  checked: boolean = false;
  fromParent: boolean = true;
  canCu: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  fileDinhKems: any[] = [];
  listFiles: any = [];
  listBbLayMau: any = [];
  dataTableChiTieu: any[] = [];
  templateName = '3.7. C84-HD_Phiếu kiểm định chất lượng_còn 6 tháng';
  listSoPhieuKd: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dataService: DataService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private bienBanLayMauVtKtclService: BienBanLayMauVtKtclService,
    private phieuKdclVtKtclService: PhieuKdclVtKtclService,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKdclVtKtclService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get('year')],
        maDvi: [, [Validators.required]],
        loaiBienBan: ['LAY_MAU', [Validators.required]],
        maQhNs: [],
        idQdGiaoNvXh: [null, [Validators.required]],
        soQdGiaoNvXh: [null, [Validators.required]],
        ngayQdGiaoNvXh: [null, [Validators.required]],
        idBbLayMau: [null, [Validators.required]],
        soBbLayMau: [null, [Validators.required]],
        soPhieu: [null, [Validators.required]],
        ngayLapPhieu: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
        ngayKiemDinh: [null, [Validators.required]],
        ngayXuatLayMau: [null],
        dviKiemNghiem: [null, [Validators.required]],
        loaiVthh: [null],
        cloaiVthh: [null],
        maDiaDiem: [null, [Validators.required]],
        maDiemKho: [null],
        maNhaKho: [null],
        maNganKho: [null],
        maLoKho: [null],
        ppLayMau: [null],
        ppLayMauList: [null],
        nhanXetKetLuan: [null],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [null],
        isDat: [null],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [null],
        tenDiaDiem: [null, [Validators.required]],
        tenDiemKho: [null],
        tenNhaKho: [null],
        tenNganKho: [null],
        tenLoKho: [null],
        tenNguoiTao: [null],
        tpKtbq: [null],
        thuKho: [null],
        ngayLayMau: [null],
        xhXkVtPhieuKdclDtl: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
      },
    );
    this.maPhieu = 'PKNCL-' + this.userInfo.DON_VI.tenVietTat;
  }


  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinhGiaoNvXh(),
      ]);
      await this.loadDetail(this.idInput);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuKdclVtKtclService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            let itemQd = this.listSoQuyetDinh.find(item => item.soQuyetDinh == data.soQdGiaoNvXh);
            if (itemQd) {
              this.bindingDataQd(itemQd);
            }
            this.formData.patchValue({
              soBbLayMau: data.soBbLayMau,
              tenDiaDiem: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
            });
            //Xử lý pp lấy mẫu và chỉ tiêu kiểm tra chất lượng
            if (data.ppLayMau) {
              console.log(data.ppLayMau, 'ppLayMauppLayMauppLayMau');
              let ppLayMauOptions = data.ppLayMau.indexOf(',') > 0 ? data.ppLayMau.split(',') : [data.ppLayMau];
              ppLayMauOptions = ppLayMauOptions.map((str, index) => ({ label: str, value: index + 1, checked: true }));
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            }
            this.dataTableChiTieu = data.xhXkVtPhieuKdclDtl;
            this.fileDinhKems = data.fileDinhKems;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_PHIEU_KDCL_HDR_SEQ');
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        tenNguoiTao: this.userInfo.TEN_DAY_DU,
        soPhieu: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
      });
      if (this.soQdGiaoNvXh) {
        let dataQdGiaoNvXh = this.listSoQuyetDinh.find(item => item.soQuyetDinh == this.soQdGiaoNvXh);
        if (dataQdGiaoNvXh) {
          this.bindingDataQd(dataQdGiaoNvXh);
        }
      }
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinhGiaoNvXh() {
    let body = {
      namKeHoach: this.formData.get('nam').value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    };
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Năm'],
        dataColumn: ['soQuyetDinh', 'ngayKy', 'namKeHoach'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data);
      }
    });
  };


  async bindingDataQd(data) {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        soQdGiaoNvXh: data.soQuyetDinh,
        idQdGiaoNvXh: data.id,
        ngayQdGiaoNvXh: data.ngayKy,
      });
      await this.getListBbLayMau(data);
      await this.listPhieuKdMau(data)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async getListBbLayMau(itemQdGnvXh) {
    await this.spinner.show();
    this.listBbLayMau = [];
    try {
      let body = {
        soQdGiaoNvXh: itemQdGnvXh.soQuyetDinh,
        nam: this.formData.get('nam').value,
        trangThai: STATUS.DA_DUYET_LDC
      };
      let res = await this.bienBanLayMauVtKtclService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBbLayMau = res.data.content;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async listPhieuKdMau(itemQdGnvXh) {
    let body = {
      soQdGiaoNvXh:  itemQdGnvXh.soQuyetDinh,
    }
    let res = await this.phieuKdclVtKtclService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoPhieuKd = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
      let bienBan = [
        ...this.listBbLayMau.filter((e) => {
          return !this.listSoPhieuKd.some((bb) => {
            return e.soBienBan === bb.soBbLayMau;
          });
        }),
      ];
      this.listBbLayMau = bienBan;
  }

  async listBienBan(item) {
    await this.spinner.show();
    let body = {
      soQdGiaoNvXh: item,
    };
    let res = await this.bienBanLayMauVtKtclService.search(body);
    const data = res.data;
    this.bienBan = data.content;
    const listDd = [
      ...this.listDiaDiemNhap.filter((e) => {
        return !this.bienBan.some((bb) => {
          if (bb.maLoKho.length > 0 && e.maLoKho.length > 0) {
            return e.maLoKho === bb.maLoKho;
          } else {
            return e.maNganKho === bb.maNganKho;
          }
        });
      }),
    ];
    this.listDiaDiemNhap = listDd;
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
      });
    }
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems;
    }
    body.xhXkVtPhieuKdclDtl = this.dataTableChiTieu;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';

    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDC || trangThai == STATUS.CHO_DUYET_TP) {
      return true;
    }
    return false;
  }

  async loadPhuongPhapLayMau(data, isDetail?) {
    if (isDetail) {
      if (data.ppLayMau) {
        let ppLayMauOptions = data.ppLayMau.indexOf(',') > 0 ? data.ppLayMau.split(',') : [data.ppLayMau];
        ppLayMauOptions = ppLayMauOptions.map((str, index) => ({ label: str, value: index + 1, checked: true }));
        this.formData.patchValue({
          ppLayMauList: ppLayMauOptions,
        });
      }
    } else {
      this.danhMucService.loadDanhMucHangChiTiet(data).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
            let ppLayMauOptions = [];
            res.data.ppLayMau.forEach(item => {
              let option = {
                label: item.giaTri,
                value: item.ma,
                checked: true,
              };
              ppLayMauOptions.push(option);
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      });
    }
  }

  async loadChiTieuCl(itemBbLayMau) {
    let [dmTieuChuan] = await Promise.all([this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(itemBbLayMau.cloaiVthh)]);
    if (dmTieuChuan.data) {
      this.dataTableChiTieu = Array.isArray(dmTieuChuan.data) ? dmTieuChuan.data.map(element => ({
        edit: false,
        chiSo: element.mucYeuCauXuat,
        tenChiTieu: element.tenChiTieu,
        maChiTieu: element.id,
        danhGia: element.danhGia,
        hdrId: element.hdrId,
        id: element.id,
        ketQua: element.ketQuaPt,
        ppKiemTra: element.phuongPhapXd,
      })) : [];
    }
  }

  async changeValueBienBanLayMau($event) {
    if ($event) {
      let item = this.listBbLayMau.find(it => it.soBienBan == $event);
      if (item) {
        this.formData.patchValue({
          maDiaDiem: item.maDiaDiem,
          idBbLayMau: item.id,
          tenDiaDiem: item.tenLoKho ? item.tenLoKho + ' - ' + item.tenNganKho : item.tenNganKho,
          tenNhaKho: item.tenNhaKho,
          tenDiemKho: item.tenDiemKho,
          tenLoaiVthh: item.tenLoaiVthh,
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          ppLayMau: item.ppLayMau,
          tenCloaiVthh: item.tenCloaiVthh,
          ngayLayMau: item.ngayLayMau,
        });
        await this.loadPhuongPhapLayMau(item, true);
        await this.tenThuKho(item.maDiaDiem);
        await this.loadChiTieuCl(item);
      }
    }
  }

  async tenThuKho(event) {
    let body = {
      maDvi: event,
      capDvi: (event?.length / 2 - 1),
    };
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      const detailThuKho = detail.data.object.detailThuKho;
      if (detailThuKho) {
        this.formData.patchValue({
          thuKho: detailThuKho.hoTen,
        });
      }
    }
  }


}
