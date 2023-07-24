import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {
  BckqKiemDinhMauService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service";
import {CHUC_NANG, STATUS} from "../../../../../../../../constants/status";
import {PhuongPhapLayMau} from "../../../../../../../../models/PhuongPhapLayMau";
import {FILETYPE} from "../../../../../../../../constants/fileType";
import {MESSAGE} from "../../../../../../../../constants/message";
import {NzSelectSizeType} from "ng-zorro-antd/select";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {
  PhieuXuatNhapKhoService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service";
import {isArray} from "rxjs/internal-compatibility";
import {
  PhieuKdclVtKtclService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuKdclVtKtcl.service";

@Component({
  selector: 'app-thong-tin-bao-cao-ket-qua-kiem-dinh',
  templateUrl: './thong-tin-bao-cao-ket-qua-kiem-dinh.component.html',
  styleUrls: ['./thong-tin-bao-cao-ket-qua-kiem-dinh.component.scss']
})
export class ThongTinBaoCaoKetQuaKiemDinhComponent extends Base2Component implements OnInit {
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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private phieuKdclVtKtclService: PhieuKdclVtKtclService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bckqKiemDinhMauService);
    this.formData = this.fb.group({
      tenDvi: [null, [Validators.required]],
      nam: [dayjs().get("year")],
      maDvi: [, [Validators.required]],
      tenTrangThai: ['Dự Thảo'],
      trangThai: [STATUS.DU_THAO],
      tenDviNhan: [],
      tenBaoCao: [null, [Validators.required]],
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
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listQdGiaoNvXhOption = this.idInput > 0 ? data.content : data.content.filter(item => !item.soBaoCaoKdm);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bckqKiemDinhMauService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            // this.formData.patchValue(res.data);
            this.formData.patchValue({
              id: res.data.id,
              tenDvi: res.data.tenDvi,
              soBaoCao: res.data.soBaoCao,
              ngayBaoCao: res.data.ngayBaoCao,
              tenBaoCao: res.data.tenBaoCao,
              trangThai: res.data.trangThai,
              tenTrangThai: res.data.tenTrangThai,
              soQdGiaoNvXh: res.data?.soQdGiaoNvXh ? (res.data.soQdGiaoNvXh.indexOf(",") > 0 ? res.data.soQdGiaoNvXh.split(",") : [res.data.soQdGiaoNvXh]) : []
            });
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
        this.getDetailPxk(idsQdGiaoNvXh);
      } else {
        this.listPhieuXuatKho = [];
        this.buildTableView();
        this.formData.patchValue({
          idQdGiaoNvXh: null
        });
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async getDetailPxk(idsQdGiaoNvXh) {
    if (idsQdGiaoNvXh && idsQdGiaoNvXh.length > 0) {
      await this.phieuXuatKhoService.search({
        canCus: idsQdGiaoNvXh,
        namKeHoach: this.formData.get("nam").value,
        dvql: this.userInfo.MA_DVI,
        loai: "XUAT_MAU",
        loaiPhieu: 'XUAT',
      }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.listPhieuXuatKho = res.data.content;
          this.selectRow(this.listPhieuXuatKho[0]);
          this.buildTableView();
        } else {
          this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.' + res.msg);
        }
      });
    }
  }

  buildTableView() {
    let dataView = chain(this.listPhieuXuatKho)
      .groupBy("soCanCu")
      .map((value, key) => {
        let qdGiaoNvXh = value.find(f => f.soCanCu === key)
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          tenTrangThaiXhQdGiaoNvXh: qdGiaoNvXh ? qdGiaoNvXh.tenTrangThaiXhQdGiaoNvXh : "",
          childData: value
        };
      }).value();
    this.children = dataView
    this.expandAll()
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems;
    }
    if (body.soQdGiaoNvXh && isArray(body.soQdGiaoNvXh)) {
      body.soQdGiaoNvXh = body.soQdGiaoNvXh.join(",");
    }
    if (body.idQdGiaoNvXh && isArray(body.idQdGiaoNvXh)) {
      body.idQdGiaoNvXh = body.idQdGiaoNvXh.join(",");
    }
    body.listDetailPxk = this.children && this.children.length > 0 ? this.conVertTreeToList(this.children) : [];
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }

  conVertTreeToList(data) {
    let arr = [];
    data.forEach(item => {
      if (item.childData && item.childData.length > 0) {
        item.childData.forEach(data => {
          arr.push(data);
        });
      } else {
        arr.push(item);
      }
    });
    return arr;
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
    await await this.phieuKdclVtKtclService.getDetail(data.idPhieuKncl).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataTableChiTieu = res.data.xhXkVtPhieuKdclDtl;
        this.dataPhieuKncl = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.' + res.msg);
      }
    });
    data.selected = true;
    this.itemSelected = data;
  }
}