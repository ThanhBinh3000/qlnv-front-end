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
      ngayKy:['', [Validators.required]],
      trichYeu:['', [Validators.required]],
      lyDo:[],
      trangThai:[STATUS.DU_THAO],
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
      await this.thongBaoKqTieuHuyService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              soThongBao: res.data.soThongBao?.split('/')[0] ?? null,
            }, {emitEvent: false});
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
          this.listQd = data.content.filter(item => item.soThongBao == null);
        }
      } else {
        this.listQd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    this.formData.disable({emitEvent: false});
    let body = {
      ...this.formData.value,
      soThongBao: this.formData.value.soThongBao ? this.formData.value.soThongBao + this.maHauTo : this.maHauTo
    };
    let rs = await this.createUpdate(body);
    this.formData.enable({emitEvent: false});
    this.formData.patchValue({id: rs.id})
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = {...body, soThongBao: this.formData.value.soThongBao + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeSoQd($event: any) {
    if ($event) {
      try {
        this.spinner.show();
        this.quyetDinhTieuHuyService.getDetail($event).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              this.formData.patchValue({
                soHoSo: res.data.soHoSo,
                idHoSo: res.data.idHoSo,
                soQd: res.data.soQd,

               });
            }
            console.log(123)
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

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }
}
