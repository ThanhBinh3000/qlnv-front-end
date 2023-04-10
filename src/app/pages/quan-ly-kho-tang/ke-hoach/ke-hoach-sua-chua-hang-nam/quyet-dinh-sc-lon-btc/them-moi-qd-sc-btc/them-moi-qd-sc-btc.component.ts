import { cloneDeep } from 'lodash';
import {Component, Input, OnInit, } from '@angular/core';
import {Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {MESSAGE} from "../../../../../../constants/message";
import {
  KtKhSuaChuaBtcService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import dayjs from "dayjs";
import {DialogQdScBtcComponent} from "./dialog-qd-sc-btc/dialog-qd-sc-btc.component";
import {STATUS} from "../../../../../../constants/status";
import {
  DeXuatScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";

@Component({
  selector: 'app-them-moi-qd-sc-btc',
  templateUrl: './them-moi-qd-sc-btc.component.html',
  styleUrls: ['./them-moi-qd-sc-btc.component.scss']
})
export class ThemMoiQdScBtcComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  maQd: string;
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  tablePaTc: any[] = []
  dataEdit : any

  listLoaiDuAn: any[] = [];
  listDxCuc: any[] = [];
  listTongHop: any[] = [];
  typeQd: string
  isEdit : number = -1

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdScBtcService : KtKhSuaChuaBtcService,
    private dexuatService : DeXuatScLonService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScBtcService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi : [null],
      tenDvi : [null],
      soQd : [null, Validators.required],
      namKeHoach : [dayjs().get('year'), Validators.required],
      trichYeu : [null],
      ngayKy : [null, Validators.required],
      ngayTrinhBtc : [null, Validators.required],
      maTh : [null],
      soTt : [null],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      type : ['00']
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = '/QĐ-BTC';
      await Promise.all([
      ]);
      if (this.idInput > 0) {
        await this.getDataDetail(this.idInput)
      } else {
        this.loadDxCuc()
        this.loadListTh()
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async loadDxCuc() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "2",
        "paggingReq": {
          "limit": 999,
          "page": 0
        }
      }
      let res = await this.dexuatService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxCuc = []
        this.listDxCuc = data.content;
        if (this.listDxCuc) {
          this.listDxCuc = this.listDxCuc.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP && !item.qdBtcId)
          )
        }
      } else {
        this.listDxCuc = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
  async loadListTh() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "1",
        "paggingReq": {
          "limit": 999,
          "page": 0
        }
      }
      let res = await this.dexuatService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = []
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && !item.qdBtcId)
          )
        }
      } else {
        this.listDxCuc = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async changSoTh(event, type?: string) {
    let result;
    if (type == 'DX') {
      result = this.listDxCuc.filter(item => item.soCongVan = event)
    } else {
      result = this.listTongHop.filter(item => item.id = event)
    }
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.dexuatService.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTable = []
          const data = res.data;
          this.dataTable = data.chiTiets;
          this.tablePaTc = cloneDeep(this.dataTable)
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
  }




  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.qdScBtcService.getDetail(id);
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd : data.soQd ? data.soQd.split("/")[0] : ''
      })
      this.fileDinhKem = data.fileDinhKems
      this.tablePaTc = data.phuongAnTc;
      this.dataTable = data.ctietList;
    }
  }




  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI
    body.soQd = body.soQd + this.maQd
    body.fileDinhKems = this.fileDinhKem
    body.ctietList = this.dataTable
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, this.STATUS.DA_KY, "Bạn có muốn ký hợp đồng ?")
      } else {
        this.goBack()
      }
    }
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  chonMaTongHop() {
    if (!this.isViewDetail && this.typeQd == 'TH') {
      this.formData.controls['maTh'].setValidators(Validators.required);
      this.formData.controls['soTt'].clearValidators()
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP PHƯƠNG ÁN SỬA CHỮA LỚN CỦA CỤC',
        nzContent: DialogQdScBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          type: "01",
          listTh : this.listTongHop
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            maTh : data.id
          })
          this.changSoTh(data.id, 'TH')
        }
      })
    }
  }

  chonSoDxCuc() {
    if (!this.isViewDetail && this.typeQd == 'DX') {
      this.formData.controls['soTt'].setValidators(Validators.required);
      this.formData.controls['maTh'].clearValidators()
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH ĐỀ XUẤT CỦA CỤC',
        nzContent: DialogQdScBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          type: "02",
          listTh : this.listDxCuc
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
            this.formData.patchValue({
              soTt : data.soCongVan
            })
          this.changSoTh(data.soCongVan, 'DX')
        }
      })
    }
  }

  editRow(idx: number) {
    this.isEdit = idx
    this.dataEdit = this.dataTable[idx].ncKhVon
  }

  deleteItem(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEdit() {
    this.isEdit = -1;
  }

  cancelEdit(data: any) {
    data.ncKhVon = this.dataEdit
    this.isEdit = -1
  }
}
