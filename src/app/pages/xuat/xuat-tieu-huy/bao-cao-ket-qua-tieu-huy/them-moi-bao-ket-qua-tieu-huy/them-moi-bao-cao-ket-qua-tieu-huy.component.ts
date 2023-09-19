import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../constants/status";
import { FileDinhKem } from "../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../../constants/message";
import * as uuid from "uuid";
import { chain, cloneDeep } from 'lodash';
import {
  QuyetDinhTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/QuyetDinhTieuHuyService.service";
import {
  BaoCaoKqTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/BaoCaoKqTieuHuy.service";
import {
  BaoCaoKqDtl
} from "../../../xuat-thanh-ly/bao-cao-ket-qua/them-moi-bao-ket-qua-thanh-ly/them-moi-bao-cao-ket-qua-thanh-ly.component";

export class QuyetDinhDtl {
  idVirtual: string;
  idTongHop: number;
  maTongHop: string;
  maDiaDiem: string;
  loaiVthh: string;
  cloaiVthh: string;
  donViTinh: string;
  slHienTai: number;
  slDeXuat: number;
  slDaDuyet: number;
  slCon: number;
  donGia: number;
  thanhTien: number;
  ngayNhapKho: Date;
  ngayDeXuat: Date;
  ngayTongHop: Date;
  lyDo: string;
  ketQua: string;
  type: string;
}

@Component({
  selector: 'app-them-moi-bao-cao-ket-qua-tieu-huy',
  templateUrl: './them-moi-bao-cao-ket-qua-tieu-huy.component.html',
  styleUrls: ['./them-moi-bao-cao-ket-qua-tieu-huy.component.scss']
})
export class ThemMoiBaoCaoKetQuaTieuHuyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;

  expandSetString = new Set<string>();
  isVisible = false;
  maHauTo: any;
  listSoQd: any[] = [];
  chiTiet: any = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private baoCaoKqTieuHuyService: BaoCaoKqTieuHuyService,
    private quyetDinhTieuHuyService: QuyetDinhTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKqTieuHuyService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBaoCao: ['', [Validators.required]],
      ngayBaoCao: [],
      idQd: [],
      soQd: ['', [Validators.required]],
      noiDung: ['', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tongSoLuongTl: [],
      tongSoLuongCon: [],
      tongThanhTien: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      lyDoTuChoi: [],
      tenDvi: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKem: [new Array<FileDinhKem>()],
      baoCaoKqDtl: [new Array<BaoCaoKqDtl>()],
    });

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/CDTVP-KH&QLHDT';
      await Promise.all([
        this.loadDsSoQd(),
      ]);
      await this.loadChiTiet(this.idInput);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }


  async loadChiTiet(idInput: number) {
    if (idInput) {
      await this.baoCaoKqTieuHuyService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              soBaoCao: res.data.soBaoCao?.split('/')[0] ?? null,

            }, { emitEvent: false });
            this.formData.value.baoCaoKqDtl.forEach(s => {
              s.idVirtual = uuid.v4();
            });
            this.buildTableView(this.formData.value.baoCaoKqDtl)
          }
          console.log(this.formData.value)
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
      this.formData.controls['idQd'].disable();
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
    }

  }

  async loadDsSoQd() {
    this.quyetDinhTieuHuyService.search({
      trangThai: STATUS.BAN_HANH,
      nam: this.formData.get('nam').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0 && this.formData.value.idQd == null) {
          this.listSoQd = data.content.filter(item => item.soBaoCao == null);
        } else {
          this.listSoQd = data.content
        }
      } else {
        this.listSoQd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    this.formData.disable({ emitEvent: false });
    this.formData.disable({ emitEvent: false });
    let dt = this.dataTable.flatMap((item) => item.childData);
    this.formData.patchValue({ baoCaoKqDtl: dt })
    let body = {
      ...this.formData.value,
      soBaoCao: this.formData.value.soBaoCao ? this.formData.value.soBaoCao + this.maHauTo : this.maHauTo
    };
    let rs = await this.createUpdate(body);
    this.formData.enable({ emitEvent: false });
    this.formData.patchValue({ id: rs.id })
    this.formData.patchValue({
      id: rs.id,
    })
    let ct = await this.baoCaoKqTieuHuyService.getDetail(rs.id);
    this.buildTableView(ct.data.baoCaoKqDtl)
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = { ...body, soBaoCao: this.formData.value.soBaoCao + this.maHauTo }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeSoQd($event: any) {
    if ($event) {
      try {
        this.spinner.show();
        this.chiTiet = [];
        this.quyetDinhTieuHuyService.getDetail($event).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              if (this.userInfo.CAP_DVI === "2") {
                this.dataTable = cloneDeep(res.data.quyetDinhDtl);
                this.dataTable.forEach(f => f.id = null)
              }
              this.formData.patchValue({
                soQd: res.data.soQd,
                baoCaoKqDtl: this.dataTable,
                tongSoLuongTl: res.data.tongSoLuongTl,
                tongSoLuongCon: res.data.tongSoLuongCon,
                tongThanhTien: res.data.tongThanhTien,
              });
              this.buildTableView(this.formData.value.baoCaoKqDtl)
            }
          }
        })
      } catch (e) {
        console.log('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  buildTableView(data) {
    if (this.userService.isCuc()) {
      data = data.filter(s => s.maDiaDiem.substring(0, 6) === this.userInfo.MA_DVI);
    }
    this.dataTable = chain(data)
      .groupBy("tenChiCuc")
      .map((value, key) => {
        return {
          idVirtual: uuid.v4(),
          tenChiCuc: key,
          childData: value,
        };
      }).value();
    this.expandAll()

  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC) && this.userService.isAccessPermisson('XHDTQG_XTH_BCKQ_THEM');
    }
    return false
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('XHDTQG_XTH_BCKQ_DUYETTP'))
        || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('XHDTQG_XTH_BCKQ_DUYETLDC'))
    }
    return false
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      //Reject
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC:
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
    }
    this.approve(this.formData.value.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.TU_CHOI_TP;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.TU_CHOI_LDC;
        break;
    }
    this.reject(this.formData.value.id, trangThai);
  }

}
