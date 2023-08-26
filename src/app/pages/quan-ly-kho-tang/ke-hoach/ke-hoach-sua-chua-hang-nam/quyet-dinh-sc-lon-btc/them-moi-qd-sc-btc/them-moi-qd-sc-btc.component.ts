import {chain, cloneDeep} from "lodash";
import {Component, Input, OnInit} from "@angular/core";
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
import {
  TongHopDxScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {v4 as uuidv4} from "uuid";
import {
  DialogDxScLonComponent
} from "../../de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";

@Component({
  selector: "app-them-moi-qd-sc-btc",
  templateUrl: "./them-moi-qd-sc-btc.component.html",
  styleUrls: ["./them-moi-qd-sc-btc.component.scss"]
})
export class ThemMoiQdScBtcComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  maQd: string;
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  tablePaTcTren: any[] = [];
  tablePaTcDuoi: any[] = [];
  dataTableTren: any[] = [];
  dataTableDuoi: any[] = [];
  dataEdit: any;
  listLoaiDuAn: any[] = [];
  listDxCuc: any[] = [];
  listTongHop: any[] = [];
  dataTableReq: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdScBtcService: KtKhSuaChuaBtcService,
    private dexuatService: DeXuatScLonService,
    private tongHopDxScLon : TongHopDxScLonService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScBtcService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      soQuyetDinh: [null, Validators.required],
      namKeHoach: [dayjs().get("year"), Validators.required],
      trichYeu: [null],
      ngayKy: [null, Validators.required],
      ngayTrinhBtc: [null, Validators.required],
      maTh: [null],
      soTt: [null],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      type: ["00"]
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = "/QĐ-BTC";
      await Promise.all([]);
      if (this.idInput > 0) {
        await this.getDataDetail(this.idInput);
      } else {
        this.loadDxCuc();
        this.loadListTh();
      }
    } catch (e) {
      console.log("error: ", e);
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
      };
      let res = await this.dexuatService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxCuc = [];
        this.listDxCuc = data.content;
        if (this.listDxCuc) {
          this.listDxCuc = this.listDxCuc.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP && !item.qdBtcId)
          );
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
        "namKeHoach" : this.formData.value.namKeHoach,
        "paggingReq": {
          "limit": 999,
          "page": 0
        }
      };
      let res = await this.tongHopDxScLon.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = [];
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && !item.soQdBtc)
          );
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

  async changSoTh(event) {
    let result = this.listTongHop.filter(item => item.id = event);
    if (result && result.length > 0) {
      let detailTh = result[0];
      let res = await this.tongHopDxScLon.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataTableTren = [];
        this.dataTableDuoi = [];
        this.tablePaTcTren = [];
        this.tablePaTcDuoi = [];
        if (res.data) {
          const data = res.data;
          this.dataTableReq = data.chiTiets;
          if (this.dataTableReq && this.dataTableReq.length > 0) {
            this.tablePaTcTren = this.convertListData(this.dataTableReq.filter(item => item.tmdt > 5000000000));
            this.tablePaTcDuoi = this.convertListData(this.dataTableReq.filter(item => item.tmdt <= 5000000000));
            this.dataTableTren = cloneDeep(this.tablePaTcTren);
            this.dataTableDuoi = cloneDeep(this.tablePaTcDuoi);
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
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



  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.qdScBtcService.getDetail(id);
      const data = res.data;
      this.maQd = data.soQuyetDinh ? "/" + data.soQuyetDinh.split("/")[1] : null,
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split("/")[0] : ""
      });
      this.fileDinhKem = data.fileDinhKems;
      this.dataTableReq = data.chiTiets;
      let listDx = data.chiTietDxs;
      if (listDx && listDx.length > 0) {
        this.tablePaTcTren = this.convertListData(listDx?.filter(item => item.tmdt > 5000000000));
        this.tablePaTcDuoi = this.convertListData(listDx?.filter(item => item.tmdt <= 5000000000));
      }
      this.dataTableTren = this.convertListData(this.dataTableReq?.filter(item => item.tmdt > 5000000000));
      this.dataTableDuoi = this.convertListData(this.dataTableReq?.filter(item => item.tmdt <= 5000000000));
    }
  }


  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI;
    body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.fileDinhKems = this.fileDinhKem;
    body.chiTiets = this.dataTableReq;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, this.STATUS.BAN_HANH, "Bạn có muốn ban hành?");
      }
    }
  }

  xoaItem(index: number) {
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
          this.dataTable.splice(index, 1);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  chonMaTongHop() {
    if (!this.isViewDetail) {
      let modalQD = this.modal.create({
        nzTitle: "DANH SÁCH QUYẾT ĐỊNH SỬA CHỮA LỚN CỦA TỔNG CỤC",
        nzContent: DialogQdScBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "700px",
        nzFooter: null,
        nzComponentParams: {
          type: "00",
          listTh: this.listTongHop
        }
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soTt: data.soQuyetDinh
          });
          await this.changSoTh(data.id);
        }
      });
    }
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
      nzTitle: "ĐỀ XUẤT KẾ HOẠCH SỬA CHỮA LỚN HÀNG NĂM",
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
