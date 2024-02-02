import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {PhuongPhapLayMau} from "../../../../../../../models/PhuongPhapLayMau";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {STATUS} from "../../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {
  BienBanLayMauVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanLayMauVtTbTrongThoiGianBaoHanh.service";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-thong-tin-bien-ban-lay-mau-ban-giao-mau-vt-tb',
  templateUrl: './thong-tin-bien-ban-lay-mau-ban-giao-mau-vt-tb.component.html',
  styleUrls: ['./thong-tin-bien-ban-lay-mau-ban-giao-mau-vt-tb.component.scss']
})
export class ThongTinBienBanLayMauBanGiaoMauVtTbComponent extends Base2Component implements OnInit {
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
  maBb: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  fileDinhKems: any[] = [];
  listFiles: any = [];
  listPhieuXuatKho: any = [];
  dataTableView: any[] = [];
  rowItem: BbLayMauDtl = new BbLayMauDtl;
  dataEdit: { [key: string]: { edit: boolean; data: BbLayMauDtl } } = {};
  hasError: boolean = false;
  dataTable: any[] = []
  templateName = "Biên bản lấy mẫu bàn giao mẫu";
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
    private bienBanLayMauVtTbTrongThoiGianBaoHanhService: BienBanLayMauVtTbTrongThoiGianBaoHanhService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauVtTbTrongThoiGianBaoHanhService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        loaiBienBan: ["LAY_MAU", [Validators.required]],
        maQhNs: [],
        idQdGiaoNvXh: [null, [Validators.required]],
        soQdGiaoNvXh: [null, [Validators.required]],
        thoiGianXuat: [null, [Validators.required]],
        idPhieuXuatKho: [null, [Validators.required]],
        soPhieuXuatKho: [null, [Validators.required]],
        soBienBan: [null, [Validators.required]],
        ngayLayMau: [dayjs().format('YYYY-MM-DD'),[Validators.required]],
        ngayXuatLayMau: [null],
        dviKiemNghiem: [null, [Validators.required]],
        diaDiemLayMau: [null, [Validators.required]],
        loaiVthh: [null],
        cloaiVthh: [null],
        donViTinh: [],
        maDviTsan: [],
        namNhap: [null],
        maDiaDiem: [null, [Validators.required]],
        maDiemKho: [null],
        maNhaKho: [null],
        maNganKho: [null],
        maLoKho: [null],
        soLuongMau: [null, [Validators.required]],
        slTonKho: [null],
        ppLayMau: [null],
        chiTieuKiemTra: [null],
        ppLayMauList: [null],
        chiTieuKiemTraList: [null],
        ketQuaNiemPhong: [null],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [null],
        type: [null],
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
        bbLayMauDtl: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
      }
    );
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinhGiaoNvXh(),
        // this.loadPhuongPhapLayMau(),
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
      await this.bienBanLayMauVtTbTrongThoiGianBaoHanhService.getDetail(idInput)
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
              soPhieuXuatKho: data.soPhieuXuatKho,
              tenDiaDiem: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
            })
            if (data.fileDinhKems) {
              this.fileDinhKems = data.fileDinhKems.filter(item => item.fileType === FILETYPE.FILE_DINH_KEM);
              this.canCu = data.fileDinhKems.filter(item => item.fileType === FILETYPE.CAN_CU_PHAP_LY);
              this.fileNiemPhong = data.fileDinhKems.filter(item => item.fileType === FILETYPE.ANH_DINH_KEM);
            }
            this.dataTable=this.formData.value.bbLayMauDtl ;
            this.dataTable.forEach((item, index) => {
              this.dataEdit[index] = {
                edit: false,
                data: {...item},
              };
            });

            //Xử lý pp lấy mẫu và chỉ tiêu kiểm tra chất lượng
            if (data.ppLayMau) {
              let ppLayMauOptions = data.ppLayMau.indexOf(",") > 0 ? data.ppLayMau.split(",") : [data.ppLayMau];
              ppLayMauOptions = ppLayMauOptions.map((str, index) => ({label: str, value: index + 1, checked: true}));
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            }
            if (data.chiTieuKiemTra) {
              let chiTieuOptions = data.chiTieuKiemTra.indexOf(",") > 0 ? data.chiTieuKiemTra.split(",") : [data.chiTieuKiemTra];
              chiTieuOptions = chiTieuOptions.map((str, index) => ({label: str, value: index + 1, checked: true}));
              this.formData.patchValue({
                chiTieuKiemTraList: chiTieuOptions,
              });
            }

            }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BH_BB_LAY_MAU_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
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
      nam: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      loaiXn: "XUAT"
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
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày quyết định', 'Số lần lấy mẫu'],
        dataColumn: ['nam', 'soQuyetDinh', 'ngayKy', 'soLanLm'],
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
        thoiGianXuat: data.ngayKy
      });
      await this.getListPhieuXuatKho(data);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async getListPhieuXuatKho(itemQdGnvXh) {
    await this.spinner.show();
    this.listPhieuXuatKho = [];
    try {
      let body = {
        soCanCu: itemQdGnvXh.soQuyetDinh,
        namKeHoach: this.formData.get("nam").value
      }
      let res = await this.phieuXuatKhoVtTbTrongThoiGianBaoHanhService.search(body)
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhieuXuatKho = res.data.content;
      }
      await this.listBienBan(itemQdGnvXh.soQuyetDinh);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async listBienBan(item) {
    await this.spinner.show();
    let body = {
      soQdGiaoNvXh: item,
    }
    let res = await this.bienBanLayMauVtTbTrongThoiGianBaoHanhService.search(body)
    const data = res.data;
    this.bienBan = data.content;
    let phieuXuatKho = [
      ...this.listPhieuXuatKho.filter((e) => {
        return !this.bienBan.some((bb) => {
          return e.soPhieu === bb.soPhieuXuatKho;
        });
      }),
    ];
    this.listPhieuXuatKho = phieuXuatKho;
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    //xử lý 3 loại file đính kèm , căn cứ pháp lý và ảnh biên bản lấy mẫu đc chụp
    this.listFiles = [];
    if (this.fileDinhKems.length > 0) {
      this.fileDinhKems.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFiles.push(item)
      })
    }
    if (this.canCu.length > 0) {
      this.canCu.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFiles.push(element)
      })
    }
    if (this.fileNiemPhong.length > 0) {
      this.fileNiemPhong.forEach(element => {
        element.fileType = FILETYPE.ANH_DINH_KEM
        this.listFiles.push(element)
      })
    }
    if (this.listFiles && this.listFiles.length > 0) {
      console.log(this.listFiles,'this.listFiles')
      body.fileDinhKems = this.listFiles;
    }
    console.log( body.fileDinhKems,' body.fileDinhKems')
    // xử lý pp lấy mẫu và tiêu chuẩn cần lấy mẫu kiểm tra
    if (body.ppLayMauList && body.ppLayMauList.length > 0) {
      body.ppLayMau = body.ppLayMauList.map(function (item) {
        return item['label'];
      }).join(",");
    }
    if (body.chiTieuKiemTraList && body.chiTieuKiemTraList.length > 0) {
      body.chiTieuKiemTra = body.chiTieuKiemTraList.map(function (item) {
        return item['label'];
      }).join(",");
    }
    // xử lý người liên quan
    body.bbLayMauDtl = this.dataTable;
    console.log(body,"body")
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
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

  async loadPhuongPhapLayMau(cloaiVthh) {
    this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh).then(res => {
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

  async loadChiTieuCl(cloaiVthh) {
    this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          let chiTieuClOptions = [];
          res.data.forEach(item => {
            let option = {
              label: item.tenChiTieu,
              value: item.id,
              checked: true
            }
            chiTieuClOptions.push(option);
            this.formData.patchValue({
              chiTieuKiemTraList: chiTieuClOptions,
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

  async changeValuePhieuXuatKho($event) {
    if ($event) {
      let item = this.listPhieuXuatKho.find(it => it.soPhieu == $event);
      if (item) {
        this.formData.patchValue({
          maDiaDiem: item.maDiaDiem,
          idPhieuXuatKho: item.id,
          tenDiaDiem: item.tenLoKho ? item.tenLoKho + ' - ' + item.tenNganKho : item.tenNganKho,
          tenNhaKho: item.tenNhaKho,
          tenDiemKho: item.tenDiemKho,
          tenLoaiVthh: item.tenLoaiVthh,
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          tenCloaiVthh: item.tenCloaiVthh,
          ngayXuatLayMau: item.ngayXuat,
          slTonKho: item.slTonKho,
          namNhap: item.namNhap,
          donViTinh: item.donViTinh,
          maDviTsan: item.maDviTsan,
        });
        await this.loadPhuongPhapLayMau(item.cloaiVthh);
        await this.loadChiTieuCl(item.cloaiVthh);
      }
    }
  }

  themMoiItem1() {


    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.daiDien && this.rowItem.loaiDaiDien != null) {
      this.sortTableId1();
      let item = cloneDeep(this.rowItem);
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new BbLayMauDtl();
      this.updateEditCache1();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  clearData1() {
    this.rowItem = new BbLayMauDtl();
    this.dataTable = []
  }

  sortTableId1() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  editItem1(index: number): void {
    this.dataEdit[index].edit = true;
  }

  updateEditCache1(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  huyEdit1(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  luuEdit1(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }


  xoaItem1(index: number) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache1();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

}

export class BbLayMauDtl {
  id: number;
  daiDien: string;
  loaiDaiDien: string;
}
