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
import {
  ThongBaoKqThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ThongBaoKqThanhLy.service";
import {HoSoThanhLyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";

@Component({
  selector: 'app-them-moi-thong-bao-ket-qua',
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
    private thongBaoKqThanhLyService: ThongBaoKqThanhLyService,
    private hoSoThanhLyService: HoSoThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongBaoKqThanhLyService);
    this.formData = this.fb.group({
      id:[],
      maDvi:[],
      nam:[dayjs().get("year"), [Validators.required]],
      soThongBao:['', [Validators.required]],
      ngayThongBao:['', [Validators.required]],
      idHoSo:[],
      soHoSo:['', [Validators.required]],
      ngayTrinhDuyet:['', [Validators.required]],
      ngayThamDinh:['', [Validators.required]],
      noiDung:['', [Validators.required]],
      lyDo:[],
      trangThai:[STATUS.DU_THAO],
      trangThaiTb:['', [Validators.required]],
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
      this.maHauTo = '/TCDT_QLHDT';
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
      await this.thongBaoKqThanhLyService.getDetail(idInput)
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

  async loadDsHoSo() {
    this.hoSoThanhLyService.search({
      trangThai: STATUS.TUCHOI_BTC,
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

  changeHoSo(id) {
    if (id) {
      try {
        this.spinner.show();
        this.chiTiet = [];
        this.hoSoThanhLyService.getDetail(id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              if (this.userInfo.CAP_DVI === "2") {
                this.dataTable = cloneDeep(res.data.hoSoDtl);
              }
              this.formData.patchValue({
                soHoSo: res.data.soHoSo,
                ngayTrinhDuyet:res.data.ngayTao,
                ngayThamDinh:res.data.ngayPduyet,
                trangThaiTb:res.data.tenTrangThai,
                lyDo:res.data.lyDoTuChoi,
              });
              console.log(this.formData.value,123)
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

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }
}
