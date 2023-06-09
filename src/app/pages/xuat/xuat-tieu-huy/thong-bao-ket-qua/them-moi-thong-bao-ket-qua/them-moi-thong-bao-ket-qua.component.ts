import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
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
import {QuanLyHangTrongKhoService} from "../../../../../services/quanLyHangTrongKho.service";
import {
  QuyetDinhTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/QuyetDinhTieuHuyService.service";
import {
  ThongBaoKqTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/ThongBaoKqTieuHuy.service";

@Component({
  selector: 'app-th-them-moi-thong-bao-ket-qua',
  templateUrl: './them-moi-thong-bao-ket-qua.component.html',
  styleUrls: ['./them-moi-thong-bao-ket-qua.component.scss']
})
export class ThemMoiThongBaoKetQuaComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;

  expandSetString = new Set<string>();
  isVisible = false;
  maHauTo: any;
  listQd: any[] = [];
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
    private quyetDinhTieuHuyService: QuyetDinhTieuHuyService,
    private thongBaoKqTieuHuyService: ThongBaoKqTieuHuyService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongBaoKqTieuHuyService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    this.formData = this.fb.group({
      id:[],
      maDvi:[],
      nam:[dayjs().get("year"), [Validators.required]],
      soThongBao:['', [Validators.required]],
      ngayThongBao:['', [Validators.required]],
      idQd:[],
      soHoSo:['', [Validators.required]],
      idHoSo:[],
      soQd:['', [Validators.required]],
      ngayTrinhDuyet:['', [Validators.required]],
      ngayKy:['', [Validators.required]],
      trichYeu:['', [Validators.required]],
      lyDo:[],
      trangThai:['', [Validators.required]],

      ngayPduyet:[],
      nguoiPduyetId:[],
      ngayGduyet:[],
      nguoiGduyetId:[],
      lyDoTuChoi:[],
      tenDvi:[],
      tenTrangThai:['Dự thảo'],
      fileDinhKem: [new Array<FileDinhKem>()],

    });

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadDsQd(),
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
      await this.thongBaoKqTieuHuyService.getDetail(idInput)
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
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
    }

  }
  async loadDsQd() {
    this.quyetDinhTieuHuyService.search({
      trangThai: STATUS.BAN_HANH,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.listQd = data.content.filter(item => item.soQd == null);
        }
      } else {
        this.listQd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async loadDsHoSo() {
    this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
      trangThai: STATUS.BAN_HANH,
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