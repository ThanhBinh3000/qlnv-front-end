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
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";
import {
  BienBanLayMauVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanLayMauVtTbTrongThoiGianBaoHanh.service";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";

@Component({
  selector: 'app-thong-tin-phieu-kiem-dinh-chat-luong-vt-tb',
  templateUrl: './thong-tin-phieu-kiem-dinh-chat-luong-vt-tb.component.html',
  styleUrls: ['./thong-tin-phieu-kiem-dinh-chat-luong-vt-tb.component.scss']
})
export class ThongTinPhieuKiemDinhChatLuongVtTbComponent extends Base2Component implements OnInit {

  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

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
  canCu: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  fileDinhKems: any[] = [];
  listBbLayMau: any = [];
  LIST_DANH_GIA: any[] = [
    {value: 0, label: "Không đạt"},
    {value: 1, label: "Đạt"}
  ]
  dataTableChiTieu: any[] = [];
  phieuKd: any;
  templateName = "3.7. C84-HD_Phiếu kiểm định chất lượng_VT-Xuất khác";
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
    private bienBanLayMauVtTbTrongThoiGianBaoHanhService: BienBanLayMauVtTbTrongThoiGianBaoHanhService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKdclVtTbTrongThoiGianBaoHanhService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        loaiBienBan: ["LAY_MAU", [Validators.required]],
        maQhNs: [],
        idQdGiaoNvXh: [null, [Validators.required]],
        soQdGiaoNvXh: [null, [Validators.required]],
        soLanLm: [],
        ngayQdGiaoNvXh: [null],
        idBbLayMau: [null, [Validators.required]],
        soBbLayMau: [null, [Validators.required]],
        soPhieu: [null, [Validators.required]],
        ngayLapPhieu: [null,],
        ngayKiemDinh: [null,],
        ngayXuatLayMau: [null],
        dviKiemDinh: [null],
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
        isDat: [false],
        mauBiHuy: [false],
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
        canBoTao: [null],
        tpKtbq: [null],
        thuKho: [null],
        lanhDaoCuc: [null],
        ngayLayMau: [null],
        soLuongMau : [null],
        slTonKho: [null],
        phieuKdclDtl: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
      }
    );
    this.maPhieu = 'PKDCL-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      // await Promise.all([
      //   this.loadSoQuyetDinhGiaoNvXh(),
      // ])
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
      await this.phieuKdclVtTbTrongThoiGianBaoHanhService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            // let itemQd = this.listSoQuyetDinh.find(item => item.soQuyetDinh == data.soQdGiaoNvXh);
            // if (itemQd) {
            //   this.bindingDataQd(itemQd);
            // }
            this.formData.patchValue({
              soBbLayMau: data.soBbLayMau,
              tenDiaDiem: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
            })
             this.getListBbLayMau(data.soQdGiaoNvXh);
             this.loadPhuongPhapLayMau(data.cloaiVthh);
            //Xử lý pp lấy mẫu và chỉ tiêu kiểm tra chất lượng
            if (data.ppLayMau) {
              let ppLayMauOptions = data.ppLayMau.indexOf(",") > 0 ? data.ppLayMau.split(",") : Array.from(data.ppLayMau);
              ppLayMauOptions = ppLayMauOptions.map((str, index) => ({label: str, value: index + 1, checked: true}));
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            }
            this.dataTableChiTieu = data.phieuKdclDtl
            this.fileDinhKems = data.fileDinhKems;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BH_PHIEU_KDCL_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        canBoTao: this.userInfo.TEN_DAY_DU,
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
      namKeHoach: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      loaiXn:"XUAT",
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinhGiaoNvXh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Năm','Số quyết định', 'Ngày quyết định','Số lần lấy mẫu' ],
        dataColumn: ['nam','soQuyetDinh', 'ngayKy', 'soLanLm'],
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
        soLanLm:data.soLanLm,
        ngayXuatLayMau:data.thoiHanXuatHang,
      });
      await this.getListBbLayMau(data);
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
        nam: this.formData.get("nam").value
      }
      let res = await this.bienBanLayMauVtTbTrongThoiGianBaoHanhService.search(body)
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBbLayMau = res.data.content;
      }
      if (this.idInput == null) {
        await this.listPhieuKd(itemQdGnvXh.soQuyetDinh);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async listPhieuKd(item) {
    await this.spinner.show();
    let body = {
      soQdGiaoNvXh: item,
    }
    let res = await this.phieuKdclVtTbTrongThoiGianBaoHanhService.search(body)
    const data = res.data;
    this.phieuKd = data.content;
    let bienBan = [
      ...this.listBbLayMau.filter((e) => {
        return !this.phieuKd.some((bb) => {
          return e.soBienBan === bb.soBbLayMau;
        });
      }),
    ];
    this.listBbLayMau = bienBan;
  }
  async save(isGuiDuyet?) {
    let body = this.formData.value;
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems
    }
    body.phieuKdclDtl = this.dataTableChiTieu;
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
      console.log($event)
      console.log(this.listBbLayMau,"this.listBbLayMau")
      let item = this.listBbLayMau.find(it => it.soBienBan == $event);
      console.log(item,"item")
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
          tenCloaiVthh: item.tenCloaiVthh,
          ngayLayMau: item.ngayLayMau,
          soLuongMau:item.soLuongMau,
          slTonKho:item.slTonKho,
          donViTinh:item.donViTinh,
        });
        await this.loadPhuongPhapLayMau(item.cloaiVthh);
        // await this.tenThuKho(item.maDiaDiem);
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
}
