import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../../services/donvi.service";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import * as uuid from "uuid";
import {chain} from "lodash";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  HopDongThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HopDongThanhLy.service";

@Component({
  selector: 'app-chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly',
  templateUrl: './chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component.scss']
})
export class ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent extends Base2Component implements OnInit {
  @Input() idSelected: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();

  expandSetString = new Set<string>();
  quyetDinhDtlView: any[] = [];
  maHauTo: any;
  loadDanhSachQdGiaoNv: any[] = [];
  dataHopDong: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private quyetDinhGiaoNhiemVuThanhLyService: QuyetDinhGiaoNhiemVuThanhLyService,
    private hopDongThanhLyService: HopDongThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNhiemVuThanhLyService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      soBbQd: [''],
      ngayKy: [''],
      ngayKyQd: [''],
      idHopDong: [],
      soHopDong: [''],
      maDviTsan: [''],
      toChucCaNhan: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      tenVthh: [''],
      soLuong: [],
      donViTinh: [''],
      thoiGianGiaoNhan: [''],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      trichYeu: [''],
      lyDoTuChoi: [''],
      trangThai: [''],
      tenTrangThai: [''],
      trangThaiXh: [''],
      tenTrangThaiXh: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
      quyetDinhDtl: [],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/QĐ-' + this.userInfo.DON_VI.tenVietTat;
      if (this.idSelected) {
        await this.loadChiTiet(this.idSelected);
      } else {
        this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async openDialogHopDong() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.DA_KY,
      nam: this.formData.value.nam,
    }
    await this.loadDsQdGiaoNv();
    let res = await this.hopDongThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadDanhSachQdGiaoNv.map(item => JSON.stringify({soHopDong: item.soHopDong})));
        this.dataHopDong = data.filter(item => {
          const key = JSON.stringify({soHopDong: item.soHd});
          return !set.has(key);
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN HỢP ĐỒNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dataHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.loadDtailHopDong(data.id);
      }
    });
    await this.spinner.hide();
  }

  async loadDtailHopDong(idHd: number) {
    await this.spinner.show();
    if (idHd > 0) {
      await this.hopDongThanhLyService.getDetail(idHd)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataHd = res.data;
            this.formData.patchValue({
              idHopDong: dataHd.id,
              soHopDong: dataHd.soHd,
              maDviTsan: dataHd.maDviTsan,
              toChucCaNhan: dataHd.toChucCaNhan,
              loaiVthh: dataHd.loaiVthh,
              tenLoaiVthh: dataHd.tenLoaiVthh,
              cloaiVthh: dataHd.cloaiVthh,
              tenCloaiVthh: dataHd.tenCloaiVthh,
              tenVthh: dataHd.moTaHangHoa,
              soLuong: dataHd.soLuong,
              donViTinh: dataHd.donViTinh,
              thoiGianGiaoNhan: dataHd.thoiHanXuatKho,
              loaiHinhNx: dataHd.loaiHinhNx,
              tenLoaiHinhNx: dataHd.tenLoaiHinhNx,
              kieuNx: dataHd.kieuNx,
              tenKieuNx: dataHd.tenKieuNx,
              trangThaiXh: dataHd.trangThaiXh,
              tenTrangThaiXh: dataHd.tenTrangThaiXh,
              quyetDinhDtl: dataHd.hopDongDtl,
            })
            await this.buildTableView();
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async loadDsQdGiaoNv() {
    let body = {
      nam: this.formData.value.nam,
    }
    let res = await this.quyetDinhGiaoNhiemVuThanhLyService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadDanhSachQdGiaoNv = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async buildTableView() {
    this.quyetDinhDtlView = chain(this.formData.value.quyetDinhDtl)
      .groupBy("tenChiCuc")
      .map((value, key) => {
          let soLuong = value.reduce((prev, cur) => prev + cur.slDauGia, 0);
          return {
            idVirtual: uuid.v4(),
            tenChiCuc: key,
            soLuong: soLuong,
            childData: value
          }
        }
      ).value();
    await this.expandAll();
  }

  expandAll() {
    if (this.quyetDinhDtlView && this.quyetDinhDtlView.length > 0) {
      this.quyetDinhDtlView.forEach(s => {
        this.expandSetString.add(s.idVirtual);
      });
    }
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async loadChiTiet(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhGiaoNhiemVuThanhLyService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            this.formData.patchValue(res.data);
            this.formData.value.quyetDinhDtl.forEach(s => {
              s.idVirtual = uuid.v4()
            });
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }
}
