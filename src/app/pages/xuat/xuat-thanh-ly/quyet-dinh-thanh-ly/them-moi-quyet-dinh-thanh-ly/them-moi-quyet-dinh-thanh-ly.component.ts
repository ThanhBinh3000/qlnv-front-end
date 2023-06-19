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

  expandSetString = new Set<string>();
  isVisible = false;
  maHauTo: any;
  listHoSo: any[] = [];
  chiTiet: any = [];


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
      canCu: [new Array<FileDinhKem>()],
      quyetDinhDtl: [new Array<QuyetDinhDtl>()],
    });

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadDsHoSo(),
      ]);
      await this.loadChiTiet(this.idInput);
      // if (Object.keys(this.dataInit).length > 0) {
      //   this.formData.patchValue({idHoSo: this.dataInit.id})
      //   await this.changeHoSo(this.dataInit.id);
      // }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }


  async loadChiTiet(idInput: number) {
    if (idInput) {
      await this.quyetDinhThanhLyService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              soQd: res.data.soQd?.split('/')[0] ?? null,
              thoiGianTl: (res.data.thoiGianTlTu && res.data.thoiGianTlDen) ? [res.data.thoiGianTlTu, res.data.thoiGianTlDen] : null

            }, {emitEvent: false});
            this.formData.value.quyetDinhDtl.forEach(s => {
              s.idVirtual = uuid.v4();
            });
            this.buildTableView(this.formData.value.quyetDinhDtl);
          }
        })
        .catch((e) => {
          console.log("error: ", e);
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

  async loadDsHoSo() {
    this.hoSoThanhLyService.search({
      trangThai: STATUS.DADUYET_BTC,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.listHoSo = data.content.filter(item => item.soQd == null);
        }
      } else {
        this.listHoSo = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    this.formData.disable({emitEvent: false});
    if (this.formData.value.id == null) {
      this.formData.value.quyetDinhDtl = this.formData.value.quyetDinhDtl.map(f => ({...f, id: null}))
    }
    let body = {
      ...this.formData.value,
      soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : this.maHauTo,
    };
    if (this.formData.get('thoiGianTl').value) {
      body.thoiGianTlTu = dayjs(this.formData.get('thoiGianTl').value[0]).format('YYYY-MM-DD');
      body.thoiGianTlDen = dayjs(this.formData.get('thoiGianTl').value[1]).format('YYYY-MM-DD')
    }
    let rs = await this.createUpdate(body);
    this.formData.enable({emitEvent: false});
    this.formData.patchValue({
      id: rs.id,
      quyetDinhDtl: rs.quyetDinhDtl
    })
    this.dataTable = cloneDeep(rs.quyetDinhDtl);
    this.buildTableView(this.dataTable)
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = {...body, soQd: this.formData.value.soQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeHoSo(id) {
    if (id) {
      try {
        this.spinner.show();
        this.chiTiet = [];
        this.hoSoThanhLyService.getDetail(id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              this.formData.patchValue({
                soHoSo: res.data.soHoSo,
                quyetDinhDtl: res.data.hoSoDtl.filter(f => f.type === 'TD'),
                tongSoLuongTl: res.data.hoSoDtl.reduce((prev, cur) => prev + cur.slDaDuyet, 0),
                tongSoLuongCon: res.data.hoSoDtl.reduce((prev, cur) => prev + (cur.slDeXuat-cur.slDaDuyet), 0),
                tongThanhTien: res.data.hoSoDtl.reduce((prev, cur) => prev + cur.thanhTien, 0),
              });
              this.dataTable = cloneDeep(this.formData.value.quyetDinhDtl);
              this.dataTable = this.dataTable.map((item) => {
                return {
                  ...item,
                  ketQua: item.ketQuaDanhGia,
                  slCon: item.slDeXuat - item.slDaDuyet
                };
              });
              this.buildTableView(this.dataTable)
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


  buildTableView(data?: any) {
    this.dataTable = chain(data)
      .groupBy("tenCuc")
      .map((value, key) => {
        return {
          idVirtual: uuid.v4(),
          tenCuc: key,
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
}
