import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../constants/status";
import {FileDinhKem} from "../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../../constants/message";
import * as uuid from "uuid";
import {chain, cloneDeep} from 'lodash';
import {QuanLyHangTrongKhoService} from "../../../../../services/quanLyHangTrongKho.service";
import {
  QuyetDinhThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
import {HoSoThanhLyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";

export class QuyetDinhDtl {
  idVirtual: string;
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
  selector: 'app-them-moi-quyet-dinh-thanh-ly',
  templateUrl: './them-moi-quyet-dinh-thanh-ly.component.html',
  styleUrls: ['./them-moi-quyet-dinh-thanh-ly.component.scss']
})
export class ThemMoiQuyetDinhThanhLyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Input() isViewOnModal: boolean;

  expandSetString = new Set<string>();
  quyetDinhDtlView: any[] = [];
  isVisible = false;
  maHauTo: any;
  listHoSo: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private hoSoThanhLyService: HoSoThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhThanhLyService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get("year")],
      soQd: ['', [Validators.required]],
      ngayKy: ['', [Validators.required]],
      idHoSo: [],
      soHoSo: ['', [Validators.required]],
      idKq: [],
      soKq: [],
      thoiGianTl: [],
      thoiGianTlTu: [],
      thoiGianTlDen: [],
      trichYeu: ['', [Validators.required]],
      tongSoLuongTl: [],
      tongSoLuongCon: [],
      tongThanhTien: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      lyDoTuChoi: [],
      tenDvi: [],
      trangThai: [''],
      tenTrangThai: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      quyetDinhDtl: [],
    });

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
      await this.loadDsHoSo();
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async loadDsHoSo() {
    this.hoSoThanhLyService.search({
      trangThai: STATUS.DADUYET_BTC,
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0 && this.formData.value.idHoSo == null) {
          this.listHoSo = data.content.filter(item => item.soQd == null);
        } else {
          this.listHoSo = data.content;
        }
      } else {
        this.listHoSo = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async loadChiTiet(idInput: number) {
    if (idInput) {
      await this.quyetDinhThanhLyService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              soQd: res.data.soQd?.split('/')[0] ?? null,
              thoiGianTl: (res.data.thoiGianTlTu && res.data.thoiGianTlDen) ? [res.data.thoiGianTlTu, res.data.thoiGianTlDen] : null

            }, {emitEvent: false});
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : this.maHauTo,
    };
    if (this.formData.get('thoiGianTl').value) {
      body.thoiGianTlTu = dayjs(this.formData.get('thoiGianTl').value[0]).format('YYYY-MM-DD');
      body.thoiGianTlDen = dayjs(this.formData.get('thoiGianTl').value[1]).format('YYYY-MM-DD')
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {
      ...this.formData.value,
      soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : this.maHauTo,
    };
    if (this.formData.get('thoiGianTl').value) {
      body.thoiGianTlTu = dayjs(this.formData.get('thoiGianTl').value[0]).format('YYYY-MM-DD');
      body.thoiGianTlDen = dayjs(this.formData.get('thoiGianTl').value[1]).format('YYYY-MM-DD')
    }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async changeHoSo($event: any) {
    if ($event) {
      try {
        await this.spinner.show();
        this.hoSoThanhLyService.getDetail($event).then(async res => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataHs = res.data;
            this.formData.patchValue({
              quyetDinhDtl: dataHs.hoSoDtl.filter(s => s.type === 'TD'),
              soHoSo: dataHs.soHoSo,
              tongSoLuongTl: dataHs.hoSoDtl.reduce((prev, cur) => prev + cur.slDaDuyet, 0),
              tongSoLuongCon: dataHs.hoSoDtl.reduce((prev, cur) => prev + (cur.slDeXuat - cur.slDaDuyet), 0),
              tongThanhTien: dataHs.hoSoDtl.reduce((prev, cur) => prev + cur.thanhTien, 0),
            })
            await this.buildTableView();
          }
        })
        await this.spinner.hide();
      } catch (e) {
        console.log("error: ", e);
        await this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  async buildTableView() {
    this.quyetDinhDtlView = chain(this.formData.value.quyetDinhDtl)
      .groupBy("tenCuc")
      .map((value, key) => {
          value.forEach((item) => {
            item.id = null
            item.slCon = item.slDeXuat - item.slDaDuyet
            item.ketQua = item.ketQuaDanhGia
          })
          return {
            idVirtual: uuid.v4(),
            tenCuc: key,
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

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }
}
