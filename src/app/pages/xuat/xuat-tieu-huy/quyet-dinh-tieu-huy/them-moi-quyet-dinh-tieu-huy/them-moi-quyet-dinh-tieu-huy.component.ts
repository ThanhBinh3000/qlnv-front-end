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
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
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
export class ThemMoiQuyetDinhTieuHuyComponent  extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;

  expandSetString = new Set<string>();
  isVisible = false;
  maHauTo: any;
  listHoSo: any[] = [];
  chiTiet: any = [];

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
    private quyetDinhTieuHuyService: QuyetDinhTieuHuyService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhTieuHuyService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    this.formData = this.fb.group({

      id: [],
      maDvi: [],
      nam: [dayjs().get("year")],
      soQd:['', [Validators.required]],
      ngayKy:['', [Validators.required]],
      idHoSo: [],
      soHoSo :['', [Validators.required]],
      idKq: [],
      soKq: [],
      thoiGianTl: [],
      thoiGianTlTu: [],
      thoiGianTlDen: [],
      trichYeu:['', [Validators.required]],
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
      if (Object.keys(this.dataInit).length > 0) {
        this.formData.patchValue({idHoSo: this.dataInit.id})
        await this.changeHoSo(this.dataInit.id);
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
      await this.quyetDinhTieuHuyService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.setValue({
              ...res.data,
              soQd: res.data.soQd?.split('/')[0] ?? null,
              thoiGianTl: (res.data.thoiGianTlTu && res.data.thoiGianTlDen) ? [res.data.thoiGianTlTu, res.data.thoiGianTlDen] : null

            }, {emitEvent: false});

            this.formData.value.quyetDinhDtl.forEach(s => {
              idVirtual: uuid.v4();
            });
            this.changeHoSo(res.data.idHoSo);
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
      // this.formData.patchValue({
      //   maDvi: this.userInfo.MA_DVI,
      //   tenDvi: this.userInfo.TEN_DVI,
      // });
      this.formData.patchValue({
        id: 85,
        maDvi: "test_0c5b58375e5b",
        nam: 48,
        soQd: "test_0bc84c3e955e",
        trichYeu: "test_3b2a08e027d7",
        ngayKy: "2027-07-30",
        idHoSo: 81,
        soHoSo: "test_35afcede2e5c",
        idKq: 95,
        soKq: "test_4bc8cc72e2a7",
        thoiGianThTu: "2017-07-18",
        thoiGianThDen: "2023-05-09",
        trangThai: "test_3a558289af2c",
        tongSoLuongTh: 45.72,
        tongSoLuongCon: 22.10,
        tongThanhTien: 77.95,
        lyDoTuChoi: "test_c078c8bbd63e",
        tenDvi: "test_6e083cf7447f",
        tenTrangThai: "test_9b20bda262e2",
        quyetDinhDtl: [
          {
            id: 32,
            nam: 80,
            idTongHop: 8,
            maTongHop: "test_9d6670a65cd3",
            maDiaDiem: "test_c8678459274c",
            loaiVthh: "test_12abb5407ac2",
            cloaiVthh: "test_97d2134d6b3c",
            donViTinh: "test_dc86cf544531",
            slHienTai: 50.40,
            slDeXuat: 32.98,
            slDaDuyet: 83.48,
            slCon: 47.70,
            donGia: 44.03,
            thanhTien: 67.03,
            ngayNhapKho: "2032-08-10",
            ngayDeXuat: "2018-04-29",
            tgianDxTu: "2016-06-04",
            tgianDxDen: "2027-01-05",
            ngayTongHop: "2015-03-25",
            lyDo: "test_5363de94d151",
            ketQua: "test_e7d0302afe5f",
            type: "test_6f85751bdf25",
            trangThai: "test_7ade46baf855",
            trangThaiTh: "test_85778417f63c",
            tenLoaiVthh: "test_12cb1b43628a",
            tenCloaiVthh: "test_12967afa0ff1",
            tenCuc: "test_be9c8c3222be",
            tenChiCuc: "test_d4c1d2fdcdb8",
            tenDiemKho: "test_f48089d619eb",
            tenNhaKho: "test_aed2453bef98",
            tenNganKho: "test_4ba2515e02fb",
            tenLoKho: "test_cda22bf17b90",
            ngayTao: "2021-09-26",
    }
    ]
    });
      await  this.buildTableView();
    }
    console.log(this.formData.value,"value")
  }

  async loadDsHoSo() {
    this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
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
        this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(id).then(res => {
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
    this.dataTable = chain(this.formData.value.quyetDinhDtl)
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
          nam:maTongHop.nam,
          trangThai:maTongHop.trangThai,
          childData: rs
        };
      }).value();
  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }
}
