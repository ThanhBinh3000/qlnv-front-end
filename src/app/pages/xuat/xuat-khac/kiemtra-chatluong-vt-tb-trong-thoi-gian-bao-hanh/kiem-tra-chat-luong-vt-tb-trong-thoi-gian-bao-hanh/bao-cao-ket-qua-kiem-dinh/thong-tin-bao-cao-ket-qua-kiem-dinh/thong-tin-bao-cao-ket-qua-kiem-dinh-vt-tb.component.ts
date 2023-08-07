import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import { chain, cloneDeep } from 'lodash';
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
import {
  DialogTableCheckBoxComponent
} from "../../../../../../../components/dialog/dialog-table-check-box/dialog-table-check-box.component";
import * as uuid from "uuid";
@Component({
  selector: 'app-thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb',
  templateUrl: './thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb.component.html',
  styleUrls: ['./thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb.component.scss']
})
export class ThongTinBaoCaoKetQuaKiemDinhVtTbComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  size: NzSelectSizeType = 'default';
  @Input() soCanCu: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
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
      loaiCanCu: ["QD_GNV", [Validators.required]],
      tenDvi: [null, [Validators.required]],
      nam: [dayjs().get("year")],
      maDvi: [, [Validators.required]],
      tenTrangThai: ['Dự Thảo'],
      trangThai: [STATUS.DU_THAO],
      tenDviNhan: ['Vụ quản lý hàng dự trữ Tổng cục DTNN'],
      tenBaoCao: [null],
      soBaoCao: [null, [Validators.required]],
      soCanCu: [null, [Validators.required]],
      idCanCu: [null, [Validators.required]],
      ngayBaoCao: [null, [Validators.required]],
      baoCaoDtl: [new Array()],
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.maBc = "/" + this.userInfo.MA_QD
      await Promise.all([

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
      await this.baoCaoKdmVtTbTrongThoiGianBaoHanh.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              id: res.data.id,
              soBaoCao: res.data.soBaoCao.split("/")[0],
              soCanCu: res.data?.soCanCu ? res.data.soCanCu.split(",") : []
            });
            console.log(this.formData.value,152)
            this.dataTable = this.formData.value.baoCaoDtl.map(m => {
              return m.qdGiaonvXhDtl
                .filter(i=> i.mauBiHuy==true)
                .map(dtl => ({ ...dtl, soQuyetDinh: m.soQuyetDinh,soLanLm:m.soLanLm,tenTrangThaiXh:m.tenTrangThaiXh }));
            }).flat();
            this.buildTableView(this.dataTable)
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
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDC) {
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

  async loadSoQuyetDinhGiaoNvXh() {
    let body = {
      namKeHoach: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      loaiXn:'XUAT'
    }
    let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = this.idInput > 0 ? data.content : data.content.filter(item => !item.soBaoCaoKdm);
      this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => {
        item.qdGiaonvXhDtl = item.qdGiaonvXhDtl.filter(i => i.mauBiHuy == true);
        return item.qdGiaonvXhDtl.length > 0;
      });


    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async openDialogQdGnv() {
    await this.loadSoQuyetDinhGiaoNvXh();
    const modalQD = this.modal.create({
      nzTitle: 'CĂN CỨ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày quyết định',],
        dataColumn: ['nam', 'soQuyetDinh', 'ngayKy',],
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
    this.listSoQuyetDinh = cloneDeep(data.data);
    this.allChecked = data.allChecked;

    this.listSoQuyetDinh = this.listSoQuyetDinh.filter(f => f.checked);
    this.dataTable = this.listSoQuyetDinh.map(m => {
      return m.qdGiaonvXhDtl
        .map(dtl => ({ ...dtl, soQuyetDinh: m.soQuyetDinh,soLanLm:m.soLanLm,tenTrangThaiXh:m.tenTrangThaiXh }));
    }).flat();

    this.formData.patchValue({
      soCanCu: this.listSoQuyetDinh.map(m => m.soQuyetDinh),
      idCanCu: this.listSoQuyetDinh.map(m => m.id),
      baoCaoDtl: this.dataTable,
    });
    console.log(this.formData.value,5555)
    this.buildTableView(this.dataTable);
  }
  buildTableView(data) {
    let dataView = chain(data)
      .groupBy("soQuyetDinh")
      .map((value, key) => {
        let parent = value.find(f => f.soQuyetDinh === key); // Sửa thành "soQuyetDinh"
        let rs = chain(value)
        return {
          idVirtual: uuid.v4(),
          soQuyetDinh: key != "null" ? key : '',
          soLanLm: parent ? parent.soLanLm : null,
          tenTrangThaiXh: parent ? parent.tenTrangThaiXh : null,
          childData: value
        };
      }).value();
    this.children = dataView;
    console.log(this.children, "7777");
    this.expandAll();
  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }


  openDialogPhieuKdcl() {

  }

}
