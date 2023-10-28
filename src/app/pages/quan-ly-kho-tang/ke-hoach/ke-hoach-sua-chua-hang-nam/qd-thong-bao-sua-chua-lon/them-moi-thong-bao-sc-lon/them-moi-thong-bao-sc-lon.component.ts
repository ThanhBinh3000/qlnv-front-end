import {chain} from 'lodash';
import {v4 as uuidv4} from "uuid";
import {Component, Input, OnInit,} from '@angular/core';
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
  DialogQdScBtcComponent
} from "../../quyet-dinh-sc-lon-btc/them-moi-qd-sc-btc/dialog-qd-sc-btc/dialog-qd-sc-btc.component";
import {
  DialogDxScLonComponent
} from "../../de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";
import {STATUS} from "../../../../../../constants/status";
import {
  TongHopDxScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";

@Component({
  selector: 'app-them-moi-thong-bao-sc-lon',
  templateUrl: './them-moi-thong-bao-sc-lon.component.html',
  styleUrls: ['./them-moi-thong-bao-sc-lon.component.scss']
})
export class ThemMoiThongBaoScLonComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  maQdBtc: string;
  maQdTcdt: string;
  dataEdit: any
  listQdBtc: any[] = [];
  listToTrinh: any[] = [];
  dataTableReq: any[] = [];
  isEdit: number = -1

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdScBtcService: KtKhSuaChuaBtcService,
    private tongHopDxScLon: TongHopDxScLonService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScBtcService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      soQuyetDinh: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      trichYeu: [null],
      ngayKy: [null],
      noiDung: [null],
      qdBtc: [null, Validators.required],
      soTt: [null, Validators.required],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["ĐANG NHẬP DỮ LIỆU"],
      type: ['01'],
      loai: ['00']
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQdBtc = '/TCDT-TVQT';
      this.maQdTcdt = '/QĐ-TCDT';
      if (this.idInput > 0) {
        await this.getDataDetail(this.idInput)
      } else {
        this.loadQdBtc();
        this.loadDsTotrinhTc();
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
        },
        "maDvi" : this.userInfo.MA_DVI,
        "namKeHoach": this.formData.value.namKeHoach
      }
      let res = await this.qdScBtcService.search(body);
      console.log(res, "ress")
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listQdBtc = []
        this.listQdBtc = data.content;
        if (this.listQdBtc) {
          this.listQdBtc = this.listQdBtc.filter(
            (item) => (item.trangThai == this.STATUS.BAN_HANH && !item.qdTcdt)
          )
        }
      } else {
        this.listQdBtc = [];
        // this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsTotrinhTc() {
    this.spinner.show();
    try {
      let body = {
        "maDvi": this.userInfo.MA_DVI,
        "capDvi": this.userInfo.CAP_DVI,
        "namKeHoach": this.formData.value.namKeHoach,
        "maTongHop": "",
        "noiDung": "",
        "ngayTongHopTu": "",
        "ngayTongHopDen": "",
        "trangThai": "",
        "paggingReq": {"limit": 10, "page": 0}
      }
      let res = await this.tongHopDxScLon.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listToTrinh = []
        this.listToTrinh = data.content;
        if (this.listToTrinh) {
          this.listToTrinh = this.listToTrinh.filter(item => item.loaiTmdt == 'DUOI15TY' && item.trangThai == STATUS.DA_DUYET_LDTC && !item.soQdTcdt);
        }
      } else {
        console.log(1)
        this.listQdBtc = [];
        // this.notification.error(MESSAGE.ERROR, res.msg);
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
    if (event) {
      let res;
      if (this.formData.value.loai == '00') {
        res = await this.tongHopDxScLon.getDetail(event)
      } else {
        res = await this.qdScBtcService.getDetail(event);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTable = []
          const data = res.data;
          this.dataTableReq = data.chiTiets;
          this.dataTable = this.convertListData(this.dataTableReq);
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
      if (data.soTt){
        this.formData.controls["qdBtc"].clearValidators();
      }else if(data.qdBtc) {
        this.formData.controls["soTt"].clearValidators();
      }
      this.formData.patchValue({
        soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split("/")[0] : '',
        soTt: data.soTt ? data.soTt : "",
        qdBtc: data.qdBtc ? data.qdBtc : ""
      })
      this.fileDinhKem = data.fileDinhKems
      this.canCuPhapLy = data.canCuPhapLys
      this.dataTableReq = data.chiTiets;
      if (this.dataTableReq && this.dataTableReq.length > 0) {
        if (this.userService.isTongCuc()) {
          this.dataTableReq = data.chiTiets;
        } else {
          this.dataTableReq = data.chiTiets?.filter(f => f.maDvi == this.userInfo.MA_DVI);
        }
        this.dataTable = this.convertListData(this.dataTableReq);
      }
    }
  }


  async save(isOther: boolean) {
    if (isOther) {
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI
    body.soQuyetDinh = this.formData.value.soQuyetDinh + (this.formData.value.loai == '00' ? this.maQdTcdt : this.maQdBtc);
    body.fileDinhKems = this.fileDinhKem
    body.canCuPhapLys = this.canCuPhapLy
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
    if (!this.isViewDetail && this.formData.value.loai) {
      let modalQD = this.modal.create({
        nzTitle: this.formData.value.loai == '00' ? 'DANH SÁCH TỜ TRÌNH TC ĐÃ DUYỆT' : 'DANH SÁCH QUYẾT ĐỊNH PHÊ DUYỆT CỦA BỘ TÀI CHÍNH',
        nzContent: DialogQdScBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          type: this.formData.value.loai,
          listTh: this.formData.value.loai == '00' ? this.listToTrinh : this.listQdBtc
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          if (this.formData.value.loai == '00') {
            this.formData.patchValue({
              soTt: data.maToTrinh
            })
            this.formData.controls["qdBtc"].clearValidators();
          } else {
            this.formData.patchValue({
              qdBtc: data.soQuyetDinh
            })
            this.formData.controls["soTt"].clearValidators();
          }
          this.changSoTh(data.id)
        }
      })
    }

  }

  convertListData(table: any[]):
    any[] {
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
    this.expandAll(arr);
    return arr;
  }


  sumSoLuong(row: string) {
    let sl = 0;
    if (this.dataTableReq && this.dataTableReq.length > 0) {
      if (this.dataTableReq && this.dataTableReq.length > 0) {
        const sum = this.dataTableReq.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    }
    return sl;
  }

  themMoiItem(data: any, tmdt: string, type: string, idx: number, list ?: any) {
    let modalQD = this.modal.create({
      nzTitle: "CHI TIẾT DỰ ÁN SỬA CHỮA LỚN",
      nzContent: DialogDxScLonComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1200px",
      nzStyle: {top: "100px"},
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

  changeLoai(event: any) {
    if (event) {
      this.formData.patchValue({
        soTt: null,
        qdBtc: null
      })
      this.dataTableReq = [];
      this.dataTable = [];
    }
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
            if (item.dataChild && item.dataChild.length > 0) {
              item.dataChild.forEach(item1 => {
                this.expandSet.add(item1.idVirtual);
              })
            }
          });
        }
      });
    }
  }

  changeNamKh(event: any) {
    if (event) {
      this.loadQdBtc();
      this.loadDsTotrinhTc();
    }
  }
}
