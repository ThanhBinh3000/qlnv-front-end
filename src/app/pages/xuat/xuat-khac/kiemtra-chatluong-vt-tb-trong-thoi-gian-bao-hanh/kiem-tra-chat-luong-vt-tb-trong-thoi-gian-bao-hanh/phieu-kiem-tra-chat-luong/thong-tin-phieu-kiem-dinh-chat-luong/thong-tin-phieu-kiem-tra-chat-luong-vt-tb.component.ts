import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {PhuongPhapLayMau} from "../../../../../../../models/PhuongPhapLayMau";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {MangLuoiKhoService} from "../../../../../../../services/qlnv-kho/mangLuoiKho.service";
import {STATUS} from "../../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  PhieuKtclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKtclVtTbTrongThoiGianBaoHanh.service";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {
  BienBanYeuCauBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanYeuCauBaoHanh.service";

@Component({
  selector: 'app-thong-tin-phieu-kiem-tra-chat-luong-vt-tb',
  templateUrl: './thong-tin-phieu-kiem-tra-chat-luong-vt-tb.component.html',
  styleUrls: ['./thong-tin-phieu-kiem-tra-chat-luong-vt-tb.component.scss']
})
export class ThongTinPhieuKiemTraChatLuongVtTbComponent extends Base2Component implements OnInit {

  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listSoQuyetDinhBh: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maPhieu: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  fileDinhKems: any[] = [];
  listBbBaoHanh: any = [];
  LIST_DANH_GIA: any[] = [
    {value: 0, label: "Không đạt"},
    {value: 1, label: "Đạt"}
  ]
  dataTableChiTieu: any[] = [];
  templateName = "Biên bản lấy mẫu bàn giao mẫu vật tư";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService,
    private phieuXuatKhoVtTbTrongThoiGianBaoHanhService: PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private banYeuCauBaoHanhService: BienBanYeuCauBaoHanhService,
    private phieuKtclVtTbTrongThoiGianBaoHanhService: PhieuKtclVtTbTrongThoiGianBaoHanhService,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtclVtTbTrongThoiGianBaoHanhService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: ['', [Validators.required]],
        maQhNs: [''],
        idQdGiaoNvXh: ['', [Validators.required]],
        soQdGiaoNvXh: ['', [Validators.required]],
        idBbBaoHanh: ['', [Validators.required]],
        soBbBaoHanh: ['', [Validators.required]],
        thoiGianBh: [''],
        soPhieu: ['', [Validators.required]],
        ngayLapPhieu: [''],
        ngayKiemTra: [''],
        dviKiemTra: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        donViTinh: [''],
        slTonKho: [''],
        slBaoHanh: [''],
        maDiaDiem: ['', [Validators.required]],
        ppLayMau: [''],
        ppLayMauList: [''],
        nhanXetKetLuan: [''],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [''],
        isDat: [false],
        mauBiHuy: [false],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [''],
        tenDiaDiem: ['', [Validators.required]],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        tenNguoiTao: [''],
        tpKtbq: [''],
        thuKho: [''],
        ngayLayMauL1: [''],
        soBbLayMauL1: [''],
        ngayLayMauL2: [''],
        soBbLayMauL2: [''],
        phieuKtclDtl: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
      }
    );
    this.maPhieu = 'PKDCL-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinhGiaoNvXh(),
      ])
      await this.loadDetail(this.idInput)
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
      await this.phieuKtclVtTbTrongThoiGianBaoHanhService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            let itemQd = this.listSoQuyetDinhBh.find(item => item.soQuyetDinh == data.soQdGiaoNvXh);
            if (itemQd) {
              this.bindingDataQd(itemQd);
            }
            this.formData.patchValue({
              soBbLayMau: data.soBbLayMau,
              tenDiaDiem: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
            })
            //Xử lý pp lấy mẫu và chỉ tiêu kiểm tra chất lượng
            if (data.ppLayMau) {
              let ppLayMauOptions = data.ppLayMau.indexOf(",") > 0 ? data.ppLayMau.split(",") : Array.from(data.ppLayMau);
              ppLayMauOptions = ppLayMauOptions.map((str, index) => ({label: str, value: index + 1, checked: true}));
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            }
            this.dataTableChiTieu = data.phieuKtclDtl
            this.fileDinhKems = data.fileDinhKems;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BH_PHIEU_KTCL_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        tenNguoiTao: this.userInfo.TEN_DAY_DU,
        soPhieu: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
      });
      if (this.soQdGiaoNvXh) {
        let dataQdGiaoNvXh = this.listSoQuyetDinhBh.find(item => item.soQuyetDinh == this.soQdGiaoNvXh);
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
      namKeHoach: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      loaiXn: "XUAT",
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
      this.listSoQuyetDinhBh = this.listSoQuyetDinh.filter(i => i.loai == "XUAT_BH");
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
        dataTable: this.listSoQuyetDinhBh,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày quyết định',],
        dataColumn: ['nam', 'soQuyetDinh', 'ngayKy',],
      },
    })
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
      await this.getlistBbBaoHanh(data);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async getlistBbBaoHanh(itemQdGnvXh) {
    await this.spinner.show();
    this.listBbBaoHanh = [];
    try {
      let body = {
        soQdGiaoNvXh: itemQdGnvXh.soQuyetDinh,
        nam: this.formData.get("nam").value
      }
      let res = await this.banYeuCauBaoHanhService.search(body)
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBbBaoHanh = res.data.content;
        console.log(this.listBbBaoHanh, "list")
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems
    }
    body.phieuKtclDtl = this.dataTableChiTieu;
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
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDC || trangThai == STATUS.CHO_DUYET_TP) {
      return true
    }
    return false;
  }

  async loadPhuongPhapLayMau(data, isDetail?) {
    if (isDetail) {
      if (data.ppLayMau) {
        let ppLayMauOptions = data.ppLayMau.indexOf(",") > 0 ? data.ppLayMau.split(",") : Array.from(data.ppLayMau);
        ppLayMauOptions = ppLayMauOptions.map((str, index) => ({label: str, value: index + 1, checked: true}));
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
                checked: true
              }
              ppLayMauOptions.push(option);
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              })
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      })
    }
  }

  async loadChiTieuCl(itemBbLayMau) {
    let [dmTieuChuan] = await Promise.all([this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(itemBbLayMau.cloaiVthh)])
    console.log(dmTieuChuan.data,"dmTieuChuan.data")
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
        ppKiemTra: element.phuongPhapXd
      })) : [];
    }
  }

  async changeValueBienBanLayMau($event) {
    if ($event) {
      let item = this.listBbBaoHanh.find(it => it.soBienBan == $event);
      if (item) {
        this.formData.patchValue({
          maDiaDiem: item.maDiaDiem,
          idBbBaoHanh: item.id,
          tenDiaDiem: item.tenLoKho ? item.tenLoKho + ' - ' + item.tenNganKho : item.tenNganKho,
          tenNhaKho: item.tenNhaKho,
          tenDiemKho: item.tenDiemKho,
          tenLoaiVthh: item.tenLoaiVthh,
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          tenCloaiVthh: item.tenCloaiVthh,
          ngayLayMau: item.ngayLayMau,
          soLuongLm: item.soLuongLm,
          donViTinh: item.donViTinh,
          thoiGianBh: item.thoiGianBh,
          soBbLayMauL1: item.soBbLayMauL1,
          ngayLayMauL1: item.ngayLayMauL1,
          soBbLayMauL2: item.soBbLayMauL2,
          ngayLayMauL2: item.ngayLayMauL2,
          slTonKho: item.slTonKho,
          slBaoHanh: item.slBaoHanh,
        });
        await this.loadPhuongPhapLayMau(item.cloaiVthh);
        await this.tenThuKho(item.maDiaDiem);
        await this.loadChiTieuCl(item);
      }
    }
  }

  async tenThuKho(event) {
    let body = {
      maDvi: event,
      capDvi: (event?.length / 2 - 1)
    }
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      const detailThuKho = detail.data.object.detailThuKho
      if (detailThuKho) {
        this.formData.patchValue({
          thuKho: detailThuKho.hoTen
        })
      }
    }
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
    console.log(this.dataTableChiTieu[index],"123")
  }

  deleteRow(data: any) {
    this.dataTableChiTieu = this.dataTableChiTieu.filter(x => x.id != data.id);
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }
}
