import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";

import {NzSelectSizeType} from "ng-zorro-antd/select";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {isArray} from "rxjs/internal-compatibility";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {CHUC_NANG, STATUS} from "../../../../../../../constants/status";
import {StorageService} from "../../../../../../../services/storage.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  BaoCaoKdmVtTbTrongThoiGianBaoHanh
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BaoCaoKdmVtTbTrongThoiGianBaoHanh.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";

@Component({
  selector: 'app-thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb',
  templateUrl: './thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb.component.html',
  styleUrls: ['./thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb.component.scss']
})
export class ThongTinBaoCaoKetQuaKiemDinhVtTbComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  size: NzSelectSizeType = 'default';
  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  checked: boolean = false;
  fileDinhKems: any[] = [];
  listQdGiaoNvXhOption: any[] = [];
  listPhieuXuatKho: any[] = [];
  listQd: any[] = [];
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  itemSelected: any;
  dataTableChiTieu: any[] = [];
  LIST_DANH_GIA: any[] = [
    {value: 0, label: "Không đạt"},
    {value: 1, label: "Đạt"}
  ]
  dataPhieuKncl: any;
  maBc: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
    private baoCaoKdmVtTbTrongThoiGianBaoHanh: BaoCaoKdmVtTbTrongThoiGianBaoHanh,
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKdmVtTbTrongThoiGianBaoHanh);
    this.formData = this.fb.group({
      id: [0],
      tenDvi: [null, [Validators.required]],
      nam: [dayjs().get("year")],
      maDvi: [, [Validators.required]],
      tenTrangThai: ['Dự Thảo'],
      trangThai: [STATUS.DU_THAO],
      tenDviNhan: ['Vụ quản lý hàng dự trữ Tổng cục DTNN'],
      tenBaoCao: [null],
      soBaoCao: [null, [Validators.required]],
      soQdGiaoNvXh: [null, [Validators.required]],
      idQdGiaoNvXh: [null, [Validators.required]],
      ngayBaoCao: [null, [Validators.required]],
      listDetailPxk: [new Array()],
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.maBc = "/" + this.userInfo.MA_QD
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

  async loadSoQuyetDinhGiaoNvXh() {
    let body = {
      namKeHoach: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
    }
    let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listQdGiaoNvXhOption = this.idInput > 0 ? data.content : data.content.filter(item => !item.soBaoCaoKdm);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.baoCaoKdmVtTbTrongThoiGianBaoHanh.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              id: res.data.id,
              soBaoCao: res.data.soBaoCao.split("/")[0],
              soQdGiaoNvXh: res.data?.soQdGiaoNvXh ? res.data.soQdGiaoNvXh.split(",") : []
            });
            console.log(res.data.id,"cmm1")
            console.log(this.formData.value.id,"cmm2")
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
      // if (this.soQdGiaoNvXh) {
      //   let dataQdGiaoNvXh = this.listSoQuyetDinh.find(item => item.soQuyetDinh == this.soQdGiaoNvXh);
      //   if (dataQdGiaoNvXh) {
      //     // this.bindingDataQd(dataQdGiaoNvXh);
      //   }
      // }
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  async changeValueQdGiaoNvXh(event) {
    try {
      this.spinner.show();
      if (event && event.length > 0) {
        const arrayQdGiaoNvXh = this.listQdGiaoNvXhOption.filter(obj1 =>
          event.some(obj2 => obj1.soQuyetDinh === obj2)
        );
        const idsQdGiaoNvXh = arrayQdGiaoNvXh && arrayQdGiaoNvXh.length > 0 ? arrayQdGiaoNvXh.map(item => item.id) : [];
        this.formData.patchValue({
          idQdGiaoNvXh: idsQdGiaoNvXh
        });
        this.getDetailQdGnvxh(idsQdGiaoNvXh);
      } else {
        this.listQd = [];
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async getDetailQdGnvxh(idsQdGiaoNvXh) {
    if (idsQdGiaoNvXh && idsQdGiaoNvXh.length > 0) {
      await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search({
        namKeHoach: this.formData.get("nam").value,
        dvql: this.userInfo.MA_DVI,
        loai: "XUAT_MAU",
        trangThai: STATUS.DA_DUYET_LDC,
      }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data.content;
          this.listQd = data.filter(item => idsQdGiaoNvXh.includes(item.id));
          this.listQd.forEach(s => {
            this.expandSetString.add(s.idVirtual);
          })
        } else {
          this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.' + res.msg);
        }
      });
    }
  }


  async save(isGuiDuyet?) {
    let body = this.formData.value;
    console.log(body,"cmm")
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems;
    }
    if (body.soQdGiaoNvXh && isArray(body.soQdGiaoNvXh)) {
      body.soQdGiaoNvXh = body.soQdGiaoNvXh.join(",");
    }
    if (body.idQdGiaoNvXh && isArray(body.idQdGiaoNvXh)) {
      body.idQdGiaoNvXh = body.idQdGiaoNvXh.join(",");
    }
    this.formData.value.soBaoCao = this.formData.value.soBaoCao + this.maBc;
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }


  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
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
    }
    this.reject(this.idInput, trangThai)
  }

  expandAll() {
    this.children.forEach(s => {
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

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  async selectRow(data) {
    if (this.itemSelected) {
      this.itemSelected = null;
      this.dataTable.forEach(parent => {
        if (parent.dataChild && parent.dataChild.length > 0) {
          parent.dataChild.forEach(lv1 => {
            lv1.selected = false;
          });
        }
      });
    }
    await this.phieuKdclVtTbTrongThoiGianBaoHanhService.getDetail(data.idPhieuKdcl).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataTableChiTieu = res.data.phieuKdclDtl;
        this.dataPhieuKncl = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.' + res.msg);
      }
    });
    data.selected = true;
    this.itemSelected = data;
  }
}
