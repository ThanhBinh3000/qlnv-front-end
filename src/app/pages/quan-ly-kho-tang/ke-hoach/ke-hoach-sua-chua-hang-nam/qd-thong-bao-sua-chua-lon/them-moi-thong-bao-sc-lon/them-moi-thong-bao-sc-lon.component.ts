import { cloneDeep } from 'lodash';
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
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
import {
  DialogDxScLonComponent
} from "../../de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";
import {STATUS} from "../../../../../../constants/status";

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
  dataTableReq: any[] = [];
  isEdit : number = -1
  dataTableTren : any[] =[];
  dataTableDuoi : any[] =[];

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
      soQuyetDinh : [null, Validators.required],
      namKeHoach : [dayjs().get('year'), Validators.required],
      trichYeu : [null],
      ngayKy : [null, Validators.required],
      qdBtc : [null, Validators.required],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["ĐANG NHẬP DỮ LIỆU"],
      type : ['01']
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = '/QĐ-TCDT';
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
            (item) => (item.trangThai == this.STATUS.BAN_HANH && !item.qdTcdt )
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

  async changSoTh(event) {
    let result;
    result = this.listQdBtc.filter(item => item.soQuyetDinh = event)
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.qdScBtcService.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTable = []
          const data = res.data;
          this.dataTableReq = data.chiTiets;
          this.dataTableTren = this.convertListData(this.dataTableReq.filter(item => item.tmdt > 15000000000));
          this.dataTableDuoi = this.convertListData(this.dataTableReq.filter(item => item.tmdt <= 15000000000));
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
        soQuyetDinh : data.soQuyetDinh ? data.soQuyetDinh.split("/")[0] : ''
      })
      this.fileDinhKem = data.fileDinhKems
      this.dataTableReq = data.chiTiets;
      if (this.dataTableReq && this.dataTableReq.length > 0) {
        this.dataTableTren = this.convertListData(this.dataTableReq?.filter(item => item.tmdt > 15000000000));
        this.dataTableDuoi = this.convertListData(this.dataTableReq?.filter(item => item.tmdt <= 15000000000));
      }
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
    body.soQuyetDinh = body.soQuyetDinh + this.maQd
    body.fileDinhKems = this.fileDinhKem
    body.chiTiets = this.dataTableReq
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, this.STATUS.BAN_HANH, "Bạn có muốn ban hành ?")
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
          type: "00",
          listTh : this.listQdBtc
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            qdBtc : data.soQuyetDinh
          })
          this.changSoTh(data.id)
        }
      })
  }

  convertListData(table: any[]): any[] {
    let arr = [];
    if (table && table.length > 0) {
      arr = chain(table)
        .groupBy("tenCuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenChiCuc")
            .map((v, k) => {
              let rs1 = chain(v)
                .groupBy("tenKhoi")
                .map((v1, k1) => {
                    return {
                      idVirtual: uuidv4(),
                      tenKhoi: k1,
                      dataChild: v1
                    };
                  }
                ).value();
              return {
                idVirtual: uuidv4(),
                tenChiCuc: k,
                dataChild: rs1
              };
            }).value();
          return {
            idVirtual: uuidv4(),
            tenCuc: key,
            dataChild: rs
          };
        }).value();
    }
    return arr;
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

  themMoiItem(data: any, tmdt: string, type: string, idx: number, list?: any) {
    let modalQD = this.modal.create({
      nzTitle: "CHI TIẾT DỰ ÁN SỬA CHỮA LỚN",
      nzContent: DialogDxScLonComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1200px",
      nzStyle: { top: "100px" },
      nzFooter: null,
      nzComponentParams: {
        dataTable: list && list.dataChild ? list.dataChild : [],
        dataInput: data,
        type: type,
        page: tmdt
      }
    });
    modalQD.afterClose.subscribe(async (detail) => {
      if (detail) {
        if (!data.dataChild) {
          data.dataChild = [];
        }
        if (!data.idVirtual) {
          data.idVirtual = uuidv4();
        }
        if (type == "them") {
          data.dataChild.push(detail);
        } else {
          if (list) {
            Object.assign(list.dataChild[idx], detail);
          }
        }
      }
    });
  }

  deleteItem(index: any, y: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          if (this.dataTable && this.dataTable.length > 0 && this.dataTable[index]) {
            if (this.dataTable[index] && this.dataTable[index].dataChild && this.dataTable[index].dataChild[y]) {
              this.dataTable[index].dataChild.splice(y, 1);
            }
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }
}
