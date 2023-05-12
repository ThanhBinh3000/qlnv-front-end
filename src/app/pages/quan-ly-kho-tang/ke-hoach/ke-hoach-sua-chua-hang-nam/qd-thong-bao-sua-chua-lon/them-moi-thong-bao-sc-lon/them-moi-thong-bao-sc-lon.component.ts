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
import {
  DeXuatScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";
import {
  DialogQdScBtcComponent
} from "../../quyet-dinh-sc-lon-btc/them-moi-qd-sc-btc/dialog-qd-sc-btc/dialog-qd-sc-btc.component";

@Component({
  selector: 'app-them-moi-thong-bao-sc-lon',
  templateUrl: './them-moi-thong-bao-sc-lon.component.html',
  styleUrls: ['./them-moi-thong-bao-sc-lon.component.scss']
})
export class ThemMoiThongBaoScLonComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  maQd: string;
  dataEdit : any
  listQdBtc: any[] = [];
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
      qdBtc : [null, Validators.required],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      type : ['01']
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = '/TCDT-TVQT';
      await Promise.all([
      ]);
      if (this.idInput > 0) {
        await this.getDataDetail(this.idInput)
      } else {
        this.loadQdBtc()
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async loadQdBtc() {
    this.spinner.show();
    try {
      let body = {
        "type": "00",
        "paggingReq": {
          "limit": 999,
          "page": 0
        }
      }
      let res = await this.qdScBtcService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listQdBtc = []
        this.listQdBtc = data.content;
        if (this.listQdBtc) {
          this.listQdBtc = this.listQdBtc.filter(
            (item) => (item.trangThai == this.STATUS.BAN_HANH)
          )
        }
      } else {
        this.listQdBtc = [];
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
    result = this.listQdBtc.filter(item => item.soQd = event)
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.qdScBtcService.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTable = []
          const data = res.data;
          this.dataTable = data.chiTiets;
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
      this.dataTable = data.ctiets;
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
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH PHÊ DUYỆT CỦA BỘ TÀI CHÍNH',
        nzContent: DialogQdScBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          type: "03",
          listTh : this.listQdBtc
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

  sumSoLuong(data: any, row: string, type?: any) {
    let sl = 0;
    if (!type) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        const sum = data.dataChild.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        let sum = 0;
        this.dataTable.forEach(item => {
          sum += this.sumSoLuong(item, row);
        });
        sl = sum;
      }
    }
    return sl;
  }
}
