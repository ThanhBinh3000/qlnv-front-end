import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain, cloneDeep} from 'lodash';
import {NzSelectSizeType} from "ng-zorro-antd/select";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {isArray} from "rxjs/internal-compatibility";

import * as uuid from "uuid";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {CHUC_NANG, STATUS} from "../../../../../../constants/status";
import {StorageService} from "../../../../../../services/storage.service";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableCheckBoxComponent
} from "../../../../../../components/dialog/dialog-table-check-box/dialog-table-check-box.component";
import {
  BaoCaoKetQuaBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BaoCaoKetQuaBaoHanh.service";
import {
  BienBanYeuCauBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanYeuCauBaoHanh.service";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {DonviService} from "../../../../../../services/donvi.service";

@Component({
  selector: 'app-thong-tin-bao-cao-ket-qua-bao-hanh',
  templateUrl: './thong-tin-bao-cao-ket-qua-bao-hanh.component.html',
  styleUrls: ['./thong-tin-bao-cao-ket-qua-bao-hanh.component.scss']
})
export class ThongTinBaoCaoKetQuaBaoHanhComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  size: NzSelectSizeType = 'default';
  @Input() soCanCu: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoBaoCao: any[] = [];
  checked: boolean = false;
  fileDinhKems: any[] = [];
  listPhieuXuatKho: any[] = [];
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
  templateName = "21.Báo cáo KQ bảo hành_trong thời gian BH theo HĐ";
  dviNhan: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private banYeuCauBaoHanhService: BienBanYeuCauBaoHanhService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
    private baoCaoKetQuaBaoHanhService: BaoCaoKetQuaBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKetQuaBaoHanhService);
    this.formData = this.fb.group({
      id: [0],
      tenDvi: [null, [Validators.required]],
      nam: [dayjs().get("year")],
      maDvi: [, [Validators.required]],
      maDviNhan: [''],
      tenTrangThai: ['Dự Thảo'],
      trangThai: [STATUS.DU_THAO],
      lyDoTuChoi: [],
      tenDviNhan: ['',],
      tenBaoCao: [null],
      soBaoCao: [null, [Validators.required]],
      soCanCu: [null, [Validators.required]],
      idCanCu: [null, [Validators.required]],
      ngayBaoCao: [null,],
      idPhieuKtcl: [null],
      spPhieuKtcl: [null],
      idQdGiaoNvXh: [null],
      soQdGiaoNvXh: [null],
      fileDinhKems: [new Array<FileDinhKem>()],
      bhBaoCaoKqDtl: [new Array()],
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.maBc = "/" + this.userInfo.MA_QD
      console.log(this.userInfo,"dvi")
      await Promise.all([
        this.loadDviNhan(this.userInfo?.DON_VI?.maDviCha)
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
      await this.baoCaoKetQuaBaoHanhService.getDetail(idInput)
        .then((res) => {
          console.log(1)
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              id: res.data.id,
              soBaoCao: res.data.soBaoCao.split("/")[0],
              soCanCu: res.data?.soCanCu ? res.data.soCanCu.split(",") : [],
              tenDviNhan: this.dviNhan.title,
            });
            this.maBc = res.data.soBaoCao.split("/")[1]
            this.dataTable = this.formData.value.bhBaoCaoKqDtl
            this.buildTableView(this.dataTable)
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      // let maDviNhan = this.userInfo?.DON_VI?.maDviCha;
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maDviNhan: this.userInfo?.DON_VI?.maDviCha,
        tenDviNhan: this.dviNhan.title,
      });
    }
  }

  async loadDviNhan(event) {
    let res = await this.donviService.getDonVi({str: event});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dviNhan = res.data;
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems;
    }
    if (body.soCanCu && isArray(body.soCanCu)) {
      body.soCanCu = body.soCanCu.join(",");
    }
    if (body.idCanCu && isArray(body.idCanCu)) {
      body.idCanCu = body.idCanCu.join(",");
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

  async loadSoBaoCaoBaoHanh() {
    let body = {
      namKeHoach: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_HOAN_THANH,
    }
    let res = await this.banYeuCauBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      console.log(data, 7989)
      this.listSoBaoCao = data.filter(item => item.idBaoCaoKq == null);
      console.log(this.listSoBaoCao, 1)
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogBaoCao() {
    await this.loadSoBaoCaoBaoHanh();
    const modalQD = this.modal.create({
      nzTitle: 'CĂN CỨ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoBaoCao,
        dataHeader: ['Năm', 'Số biên bản', 'Ngày lập biên bản',],
        dataColumn: ['nam', 'soBienBan', 'ngayLapBb',],
        allChecked: this.allChecked,
        actionRefresh: false,
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataQd(data)
      }
    });
  }

  bindingDataQd(data: any) {
    this.listSoBaoCao = cloneDeep(data.data);
    this.allChecked = data.allChecked;

    this.listSoBaoCao = this.listSoBaoCao.filter(f => f.checked);
    this.dataTable = this.listSoBaoCao;

    this.formData.patchValue({
      soCanCu: this.listSoBaoCao.map(m => m.soBienBan),
      idCanCu: this.listSoBaoCao.map(m => m.id),
      bhBaoCaoKqDtl: this.dataTable.map((item) => ({...item, id: null, trangThaiBh: item.trangThaiBh})),
    });
    console.log(this.dataTable, 5555)
    this.buildTableView(this.dataTable);
  }

  async buildTableView(data?: any) {
    this.dataTable = chain(data)
      .groupBy("tenChiCuc")
      .map((v, k) => {
          let rowItem = v.find(s => s.tenChiCuc === k);
          let idVirtual = uuid.v4();
          this.expandSetString.add(idVirtual);
          return {
            idVirtual: idVirtual,
            tenChiCuc: k,
            tenCuc: rowItem?.tenCuc,
            maDiaDiem: rowItem?.maDiaDiem,
            tenCloaiVthh: rowItem?.tenCloaiVthh,
            tenTrangThaiBh: rowItem?.tenTrangThai,
            childData: v
          }
        }
      ).value();
  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }


  openDialogPhieuKdcl() {

  }

}
