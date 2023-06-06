import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import * as dayjs from "dayjs";
import {STATUS} from "src/app/constants/status";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {HoSoThanhLyService} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";
import {MESSAGE} from "src/app/constants/message";
import {chain, cloneDeep} from "lodash";
import {v4 as uuidv4} from "uuid";
import {TongHopThanhLyService} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import {NumberToRoman} from 'src/app/shared/commonFunction';
import {Validators} from "@angular/forms";

export class XhTlHoSoDtl {
  id: number = 0;
  idTongHop: number = 0;
  idDsHdr: number = 0;
  maTongHop: string = '';
  maDiaDiem: string = '';
  loaiVthh: string = '';
  cloaiVthh: string = '';
  donViTinh: string = '';
  slHienTai: number = 0;
  slDeXuat: number = 0;
  slDaDuyet: number = 0;
  thanhTien: number = 0;
  ngayNhapKho: Date = null;
  ngayDeXuat: Date = null;
  ngayTongHop: Date = null;
  lyDo: string = '';
  type: string = '';
  soLuong: number = 0;
  donGia: number = 0;
  ketQuaDanhGia: string = '';
  tenLoaiVthh: string = '';
  tenCloaiVthh: string = '';
  tenCuc: string = '';
  tenChiCuc: string = '';
  tenDiemKho: string = '';
  tenNhaKho: string = '';
  tenNganKho: string = '';
  tenLoKho: string = '';
}

@Component({
  selector: 'app-chi-tiet-ho-so-thanh-ly',
  templateUrl: './chi-tiet-ho-so-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-ho-so-thanh-ly.component.scss']
})
export class ChiTietHoSoThanhLyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;
  maHauTo: string;
  danhSachThanhLyView: any[] = [];
  dsAll: any = {};
  numberToRoman = NumberToRoman;
  isFirstInit = true;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donViService: DonviService,
              private danhMucService: DanhMucService,
              private hoSoThanhLyService: HoSoThanhLyService,
              private tongHopThanhLyService: TongHopThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoThanhLyService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    this.maHauTo = '/HS-' + this.userInfo.DON_VI.tenVietTat;
    this.formData = this.fb.group({
      id: [],
      nam: [],
      maDvi: [],
      soHoSo: [, [Validators.required]],
      idDanhSach: [, [Validators.required]],
      maDanhSach: [],
      idQd: [],
      soQd: [],
      idTb: [],
      soTb: [],
      ngayTaoHs: [, [Validators.required]],
      thoiGianTl: [],
      thoiGianTlTu: [],
      thoiGianTlDen: [],
      trangThai: [STATUS.DU_THAO],
      ngayDuyetLan1: [],
      ngayDuyetLan2: [],
      ngayDuyetLan3: [],
      trichYeu: [, [Validators.required]],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      ketQua: [],
      ngayKyQd: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      lyDoTuChoi: [],
      tenTrangThai: ['Dự thảo'],
      tenDvi: [],
      maDvql: [],
      tenDvql: [],
      hoSoDtl: [new Array<XhTlHoSoDtl>()],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.loadDsThanhLy(),
      ])
      await this.loadChiTiet(this.idInput);
    } catch (e) {
      console.log(e)
    } finally {
      this.isFirstInit = false;
      await this.spinner.hide();
    }
  }

  async loadDsThanhLy() {
    this.tongHopThanhLyService.search({
      trangThai: STATUS.DA_TONG_HOP,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dsAll.dsThanhLy = data.content;
        }
      }
    });
  }

  async loadChiTiet(idInput: number) {
    if (idInput > 0) {
      await this.hoSoThanhLyService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.soHoSo.split("/")[1];
            res.data.soHoSo = res.data.soHoSo.split("/")[0];
            res.data.thoiGianTl = [res.data.thoiGianTlTu, res.data.thoiGianTlDen],
              this.formData.patchValue(res.data);
            this.formData.value.hoSoDtl.forEach(s => {
              s.idVirtual = uuidv4();
            });
            await this.buildTableView(this.formData.value.hoSoDtl);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async buildTableView(data?: any) {
    this.danhSachThanhLyView = chain(data)
      .groupBy("tenChiCuc")
      .map((v, k) => {
          let rowItem = v.find(s => s.tenChiCuc === k);
          let idVirtual = uuidv4();
          return {
            idVirtual: idVirtual,
            tenChiCuc: k,
            tenCuc: rowItem?.tenCuc,
            maDiaDiem: rowItem?.maDiaDiem,
            tenCloaiVthh: rowItem?.tenCloaiVthh,
            childData: v
          }
        }
      ).value();
    console.log(this.danhSachThanhLyView, 'this.danhSachThanhLyView')
  }

  async save() {
    /*let dt = this.danhSachThanhLyView.flatMap(s => {
      return s.childData.map(data => {
        delete s.childData;
        return Object.assign(s, data);
      })
    });*/
    let dt = this.danhSachThanhLyView.flatMap((item) => item.childData);
    this.formData.patchValue({hoSoDtl: dt})
    this.formData.disable({emitEvent: false});
    let body = {
      ...this.formData.value,
      soHoSo: this.formData.value.soHoSo ? this.formData.value.soHoSo + this.maHauTo : this.maHauTo
    };
    let rs = await this.createUpdate(body);
    this.formData.enable({emitEvent: false});
    this.formData.patchValue({id: rs.id})
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    /*    let dt = this.danhSachThanhLyView.flatMap(s => {
          return s.childData.map(data => {
            delete s.childData;
            return Object.assign(s, data);
          })
        });*/
    let dt = this.danhSachThanhLyView.flatMap((item) => item.childData);
    body = {...body, soHoSo: this.formData.value.soHoSo + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async changeMaDanhSach($event: any) {
    if ($event && !this.isFirstInit) {
      try {
        await this.spinner.show();
        await this.tongHopThanhLyService.getDetail($event).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            let dataTrinh = cloneDeep(data.tongHopDtl);
            let dataThamDinh = cloneDeep(data.tongHopDtl);
            dataTrinh.forEach(s => {
              s.id = null;
              s.idVirtual = uuidv4();
              s.type = 'T';
            });
            dataThamDinh.forEach(s => {
              s.id = null;
              s.idVirtual = uuidv4();
              s.type = 'TD';
            });

            this.formData.patchValue({
              thoiGianTl: [data.thoiGianTlTu, data.thoiGianTlDen],
              thoiGianTlTu: data.thoiGianTlTu,
              thoiGianTlDen: data.thoiGianTlDen,
              hoSoDtl: [...dataTrinh, ...dataThamDinh]
            });
            this.buildTableView(this.formData.value.hoSoDtl);
          }
        });
      } catch (e) {
        console.log('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        await this.spinner.hide();
      }
    }
  }
}
