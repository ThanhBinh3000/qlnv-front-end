import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../constants/status";
import {FileDinhKem} from "../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../../constants/message";
import * as uuid from "uuid";
import {chain, cloneDeep} from 'lodash';
import {
  QuyetDinhTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/QuyetDinhTieuHuyService.service";
import {
  BaoCaoKqTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/BaoCaoKqTieuHuy.service";

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
      soQd: ['', [Validators.required]],
      ngayKy: ['', [Validators.required]],
      idQd: ['', [Validators.required]],
      soHoSo: ['', [Validators.required]],
      idKq: [],
      soKq: [],
      thoiGianTl: [],
      thoiGianTlTu: [],
      thoiGianTlDen: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tongSoLuongTl: [],
      tongSoLuongCon: [],
      tongThanhTien: [],
      lyDoTuChoi: [],
      tenDvi: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKem: [new Array<FileDinhKem>()],
      quyetDinhDtl: [new Array<QuyetDinhDtl>()],
      ngayTao: [],
      nguoiTaoId: [],
      ngaySua: [],
      nguoiSuaId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
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
      if (Object.keys(this.dataInit).length > 0) {
        this.formData.patchValue({idQd: this.dataInit.id})
        await this.changeSoQd(this.dataInit.id);
      }
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
            this.formData.setValue({
              ...res.data,
              soBaoCao: res.data.soBaoCao?.split('/')[0] ?? null,

            }, {emitEvent: false});

            this.formData.value.quyetDinhDtl.forEach(s => {
              idVirtual: uuid.v4();
            });
            this.changeSoQd(res.data.idQd);
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
        if (data && data.content && data.content.length > 0) {
          this.listSoQd = data.content.filter(item => item.soBaoCao == null);
        }
      } else {
        this.listSoQd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    this.formData.disable({emitEvent: false});
    let body = {
      ...this.formData.value,
      soBaoCao: this.formData.value.soBaoCao ? this.formData.value.soBaoCao + this.maHauTo : this.maHauTo
    };
    let rs = await this.createUpdate(body);
    this.formData.enable({emitEvent: false});
    this.formData.patchValue({id: rs.id})
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = {...body, soBaoCao: this.formData.value.soBaoCao + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeSoQd(id) {
    if (id) {
      try {
        this.spinner.show();
        this.chiTiet = [];
        this.quyetDinhTieuHuyService.getDetail(id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              if (this.userInfo.CAP_DVI === "2") {
                this.dataTable = cloneDeep(res.data.hoSoDtl);
              }
              this.formData.patchValue({
                soHoSo: res.data.soHoSo,
                quyetDinhDtl: this.dataTable.length>0?this.dataTable:null,
                tongSoLuongTl : this.dataTable.reduce((prev, cur) => prev + cur.slDaDuyet, 0),
                tongSoLuongCon : this.dataTable.reduce((prev, cur) => prev + cur.slCon, 0),
                tongThanhTien : this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
              });
              this.buildTableView()
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


  buildTableView() {
    let data = cloneDeep(this.formData.value.quyetDinhDtl);

    if (this.userService.isCuc()) {
      data = data.filter(s => s.maChiCuc.substring(0, 6) === this.userInfo.MA_DVI);
    }
    let dataView = chain(data)
      .groupBy("maChiCuc")
      .map((value, key) => {
        let rs = chain(value)
        return {
          idVirtual: uuid.v4(),
          maDvi: key,
          childData: rs,
        };
      }).value();

    this.dataTable = dataView;
    this.expandAll()

  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }
}
