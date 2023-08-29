import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {QuanLyHangTrongKhoService} from "../../../../../services/quanLyHangTrongKho.service";
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
import {v4 as uuidv4} from "uuid";
import {HoSoTieuHuyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/HoSoTieuHuy.service";

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
  selector: 'app-them-moi-quyet-dinh-tieu-huy',
  templateUrl: './them-moi-quyet-dinh-tieu-huy.component.html',
  styleUrls: ['./them-moi-quyet-dinh-tieu-huy.component.scss']
})
export class ThemMoiQuyetDinhTieuHuyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;

  expandSetString = new Set<string>();
  isVisible = false;
  maHauTo: any;
  listHoSo: any[] = [];

  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ'},
  ];
  listTrangThaiTh: any[] = [
    {ma: this.STATUS.CHUA_TONG_HOP, giaTri: 'Chưa tổng hợp'},
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - CĐ Vụ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhTieuHuyService: QuyetDinhTieuHuyService,
    private hoSoTieuHuyService: HoSoTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhTieuHuyService);
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
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }


  async loadChiTiet(idInput: number) {
    if (idInput) {
      await this.quyetDinhTieuHuyService.getDetail(idInput)
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
          console.log(this.formData.value)
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
    this.hoSoTieuHuyService.search({
      trangThaiTc: STATUS.DADUYET_BTC,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
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

  async save() {
    this.formData.disable({emitEvent: false});
    let dt = this.flattenTree(this.dataTable);
    console.log(this.dataTable, 555)
    console.log(dt, 66)
    this.formData.patchValue({quyetDinhDtl: dt})
    let body = {
      ...this.formData.value,
      soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : this.maHauTo
    };
    if (this.formData.get('thoiGianTl').value) {
      body.thoiGianTlTu = dayjs(this.formData.get('thoiGianTl').value[0]).format('YYYY-MM-DD');
      body.thoiGianTlDen = dayjs(this.formData.get('thoiGianTl').value[1]).format('YYYY-MM-DD')
    }
    let rs = await this.createUpdate(body);
    this.formData.enable({emitEvent: false});
    this.formData.patchValue({id: rs.id})
    let ct = await this.quyetDinhTieuHuyService.getDetail(rs.id);
    this.buildTableView(ct.data.quyetDinhDtl)
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = {...body, soQd: this.formData.value.soQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  changeHoSo($event: any) {
    if ($event) {
      try {
        this.spinner.show();
        this.hoSoTieuHuyService.getDetail($event).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              this.dataTable = cloneDeep(res.data.hoSoDtl.filter(f => f.type === 'TD'));
              this.dataTable = this.dataTable.map((item) => {
                return {
                  ...item,
                  id: null,
                  nam: this.formData.value.nam,
                  ketQua: item.ketQuaDanhGia,
                  slCon: item.slDeXuat - item.slDaDuyet
                };
              });
              this.formData.patchValue({
                soHoSo: res.data.soHoSo,
                tongSoLuongTl: this.dataTable.reduce((prev, cur) => prev + cur.slDaDuyet, 0),
                tongSoLuongCon: this.dataTable.reduce((prev, cur) => prev + cur.slCon, 0),
                tongThanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
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
      .groupBy("maTongHop")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenChiCuc")
          .map((v, k) => {
              let rowItem = v.find(s => s.tenChiCuc === k);
              let idVirtual = uuidv4();
              this.expandSetString.add(idVirtual);
              return {
                idVirtual: idVirtual,
                tenChiCuc: k,
                maDiaDiem: rowItem.maDiaDiem,
                tenCloaiVthh: rowItem.tenCloaiVthh,
                childData: v
              }
            }
          ).value();
        let maTongHop = value.find(s => s.maTongHop === key);
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          maTongHop: key,
          nam: maTongHop.nam,
          trangThai: maTongHop.trangThai,
          childData: rs
        };
      }).value();
    console.log(this.dataTable, 55)
  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }
}
