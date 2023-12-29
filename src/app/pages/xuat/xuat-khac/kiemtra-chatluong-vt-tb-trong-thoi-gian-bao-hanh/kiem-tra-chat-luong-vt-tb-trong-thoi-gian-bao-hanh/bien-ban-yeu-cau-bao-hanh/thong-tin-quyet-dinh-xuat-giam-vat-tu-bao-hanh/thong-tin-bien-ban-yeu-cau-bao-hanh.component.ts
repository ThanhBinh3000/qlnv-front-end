import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {CHUC_NANG, STATUS} from "../../../../../../../constants/status";
import {
  PhieuXuatNhapKhoService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service";
import {StorageService} from "../../../../../../../services/storage.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {Validators} from "@angular/forms";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../../constants/message";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  BienBanYeuCauBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanYeuCauBaoHanh.service";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {MangLuoiKhoService} from "../../../../../../../services/qlnv-kho/mangLuoiKho.service";
import {OldResponseData} from "../../../../../../../interfaces/response";

@Component({
  selector: 'app-thong-tin-bien-ban-yeu-cau-bao-hanh',
  templateUrl: './thong-tin-bien-ban-yeu-cau-bao-hanh.component.html',
  styleUrls: ['./thong-tin-bien-ban-yeu-cau-bao-hanh.component.scss']
})
export class ThongTinBienBanYeuCauBaoHanhComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listPhieuKdcl: any[] = [];
  maBb: string;
  checked: boolean = false;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  listPhieuXuatKho: any[] = [];
  listTrangThaiBh: any[] = [
    {value: 'DANG_BH', label: "Đang bảo hành"},
    {value: 'DA_BH', label: "Đã hoàn thành bảo hành"},
  ]
  matchingLoaiVthh = ['0201', '0202', '0208'];
  dataThTree: any[] = [];
  expandSetString = new Set<string>();
  LIST_DANH_GIA: any[] = [
    {value: 0, label: "Không đạt"},
    {value: 1, label: "Đạt"}
  ]
  maQd: string;
  templateName = "Biên bản lấy mẫu bàn giao mẫu vật tư";
  bienBan: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private bienBanYeuCauBaoHanhService: BienBanYeuCauBaoHanhService,
    private danhMucService: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanYeuCauBaoHanhService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get("year")],
      maDvi: [, [Validators.required]],
      soBienBan: [],
      ngayLapBb: [dayjs().format('YYYY-MM-DD')],
      soCanCu: [, [Validators.required]],
      idCanCu: [, [Validators.required]],
      soLanLm: [],
      soPhieuKdcl: [, [Validators.required]],
      idPhieuKdcl: [, [Validators.required]],
      ngayKdcl: [],
      maDiaDiem: [, [Validators.required]],
      loaiVthh: [null, [Validators.required]],
      cloaiVthh: [null, [Validators.required]],
      slTonKho: [],
      capLaiCaLo: [false],
      slBaoHanh: [],
      thoiGianBh: [],
      canBoLapBb: [],
      noiDung: [, [Validators.required]],
      lyDo: [, [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      lyDoTuChoi: [],
      idQdGnvNh: [],
      soQdGnvNh: [],
      idPhieuKtcl: [],
      soPhieuKtcl: [],
      ngayLayMauL1: [],
      soBbLayMauL1: [],
      slLayMauL1: [],
      ngayLayMauL2: [],
      soBbLayMauL2: [],
      slLayMauL2: [],
      ketQuaKdclL2: [false],
      tenTrangThai: ['Dự Thảo'],
      trangThaiBh: [],
      tenDvi: [],
      tenLoai: [],
      tenLoaiVthh: [null, [Validators.required]],
      tenCloaiVthh: [null, [Validators.required]],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [null, [Validators.required]],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      fileDinhKems: [new Array()],

    })
    this.maBb = '-BBNĐK';

  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([])
      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanYeuCauBaoHanhService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              id: res.data.id,
            });
            await this.loadSoPhieuKdcl(res.data.soCanCu)
            this.listFile = res.data.fileDinhKems;
            if (res.data.fileDinhKems && res.data.fileDinhKems.length > 0) {
              res.data.fileDinhKems.forEach(item => {
                if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                  this.listFileDinhKem.push(item)
                }
              })
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BH_BB_BAO_HANH_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        canBoLapBb: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('nam').value}${this.maBb}`,
        trangThaiBh: 'DANG_BH'
      });
    }
  }


  async save(update?) {
    if (update) {
      this.formData.patchValue({
        trangThaiBh: "DA_BH",
      })
    }
    let body = this.formData.value;
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id
      })
    }
  }

  expandAll() {
    this.dataThTree.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async loadSoQd() {
    let body = {
      nam: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      loai: "XUAT_MAU",
      loaiXn: "XUAT"
    }
    let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content.filter(i => i.soLanLm == 2);
      console.log(this.listSoQuyetDinh, "1111")
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQd();
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
        await this.bindingDataQd(data.id);
      }
    });
  };


  async bindingDataQd(id) {
    try {
      await this.spinner.show();
      let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        console.log(data,"data")
        this.formData.patchValue({
          soCanCu: data.soQuyetDinh,
          idCanCu: data.id,
          soLanLm: data.soLanLm,
        });
         this.loadSoPhieuKdcl(data.soQuyetDinh)
         this.changePhieuKdclL1(data.idCanCu)
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadSoPhieuKdcl(item) {
    await this.spinner.show();
    this.listPhieuXuatKho = [];
    try {
      let body = {
        soQdGiaoNvXh: item,
        nam: this.formData.get("nam").value
      }
      let res = await this.phieuKdclVtTbTrongThoiGianBaoHanhService.search(body)
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhieuKdcl = res.data.content;
        console.log(this.listPhieuKdcl, 123)
      }
      // await this.listBienBan(item);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async listBienBan(item) {
    await this.spinner.show();
    let body = {
      soCanCu: item,
    }
    let res = await this.bienBanYeuCauBaoHanhService.search(body)
    const data = res.data;
    this.bienBan = data.content;
    let phieuKdcl = [
      ...this.listPhieuKdcl.filter((e) => {
        return !this.bienBan.some((bb) => {
          return e.soPhieu === bb.soPhieuKdcl;
        });
      }),
    ];
    this.listPhieuKdcl = phieuKdcl;
  }

  async changePhieuKdcl($event: any) {
    if (!$event) {
      return;
    }

    const item = this.listPhieuKdcl.find(it => it.soPhieu == $event);
    if (!item) {
      return;
    }
    // const res = await this.getDetailMlkByKey(item.maDiaDiem, (item.maDiaDiem.length / 2 - 1));
    // console.log(res, "sl");

    const isLoaiVthhMatching = this.matchingLoaiVthh.includes(item.loaiVthh);
    this.formData.patchValue({
      capLaiCaLo: isLoaiVthhMatching,
      // slTonKho: res.slTon,
      // slBaoHanh: res.slTon,
      slTonKho: item.slTonKho,
      slBaoHanh: item.slTonKho,
      idPhieuKdcl: item.id,
      soPhieuKdcl: item.soPhieu,
      maDiaDiem: item.maDiaDiem,
      maDviTsan: item.maDviTsan,
      donViTinh: item.donViTinh,
      loaiVthh: item.loaiVthh,
      cloaiVthh: item.cloaiVthh,
      tenLoaiVthh: item.tenLoaiVthh,
      tenCloaiVthh: item.tenCloaiVthh,
      tenDiemKho: item.tenDiemKho,
      tenNhaKho: item.tenNhaKho,
      tenNganKho: item.tenNganKho,
      tenLoKho: item.tenLoKho,
      idBbLayMauL2: item.idBbLayMau,
      soBbLayMauL2: item.soBbLayMau,
      ngayLayMauL2: item.ngayLayMau,
      slLayMauL2: item.soLuongMau,
      ketQuaKdclL2: item.isDat,
    });
  }


  async changePhieuKdclL1($event: any) {
    if ($event) {
      await this.phieuKdclVtTbTrongThoiGianBaoHanhService.getDetail($event).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let item = res.data;
          console.log(item,"lấy mẫu lần 1")
          if (item) {
            this.formData.patchValue({
              idBbLayMauL1: item.idBbLayMau,
              soBbLayMauL1: item.soBbLayMau,
              ngayLayMauL1: item.ngayLayMau,
              slLayMauL1: item.soLuongMau,
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.' + res.msg);
        }
      });

    }
  }

  async getDetailMlkByKey(maDvi, capDvi) {
    let body = {
      maDvi: maDvi,
      capDvi: capDvi
    }
    let resp;
    await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        resp = res.data.object;
      }
    })
    return resp;
  }


  async updateTrangThaiBb(update: boolean) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Đã hoàn thành bảo hành  ',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(update)
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
}
