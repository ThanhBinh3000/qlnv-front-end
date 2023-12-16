import {chain, cloneDeep} from "lodash";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {v4 as uuidv4} from "uuid";
import {UserLogin} from "../../../../../../models/userlogin";
import {STATUS} from "../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  TongHopDxScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {
  DialogDxScLonComponent
} from "../../de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";
import {
  KtKhSuaChuaBtcService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import {saveAs} from 'file-saver';

@Component({
  selector: "app-them-moi-sc-tcdt",
  templateUrl: "./them-moi-sc-tcdt.component.html",
  styleUrls: ["./them-moi-sc-tcdt.component.scss"]
})
export class ThemMoiScTcdtComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSet = new Set<number>();
  userInfo: UserLogin;
  formData: FormGroup;
  dataTable: any[] = [];
  dataTableExpand: any[] = [];

  isTongHop: boolean = false;
  listNam: any[] = [];
  fileDinhKem: any[] = [];
  fileCanCu: any[] = [];
  STATUS = STATUS;
  maTt: string;
  soQd: string;
  idTongHop: number;
  quyetDinh = false;
  hidden = false;
  @Output() tabFocus = new EventEmitter<object>();
  resultDx: any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxScLon: TongHopDxScLonService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService,
    private qdScBtcService: KtKhSuaChuaBtcService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      ngayTaoTt: [dayjs().format('YYYY-MM-DD')],
      tgTongHop: [null],
      namKeHoach: [dayjs().get('year')],
      noiDung: [null],
      maToTrinh: [null],
      soQuyetDinh: [null],
      ngayKyQd: [null],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ["Dự thảo"],
      lyDoTuChoi: [],
      loaiTmdt: ['DUOI15TY']
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maTt = "/TTr-TVQT";
    this.soQd = "/TCDT-TVQT";
    this.loadDsNam();
    await this.getDataDetail(this.idInput);
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  onExpandChange(item: any, checked: boolean): void {
    console.log(item, checked);
    item.expandSet = checked
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.isTongHop = true;
      let res = await this.tongHopDxScLon.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        namBatDau: data.namBatDau,
        namKetThuc: data.namKetThuc,
        ngayTaoTt: data.ngayTaoTt,
        ngayKyQd: data.ngayKyQd,
        noiDung: data.noiDung,
        maToTrinh: data.maToTrinh ? data.maToTrinh.split("/")[0] : null,
        soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split("/")[0] : null,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
        lyDoTuChoi: data.lyDoTuChoi,
        loaiDuAn: data.loaiDuAn,
        tgTongHop: data.tgTongHop,
        loaiTmdt: data.loaiTmdt,
      });
      this.fileDinhKem = data.fileDinhKem;
      this.fileCanCu = data.fileCanCu;

      this.dataTable = data.children;
      this.buildDataTable();
      let body = {
        maDvi: this.userInfo.MA_DVI,
        soTt: data.soQuyetDinh,
        paggingReq: {
          "limit": 999,
          "page": 0
        }
      };
      let dataQd = await this.qdScBtcService.search(body);
      if (dataQd.data.content && dataQd.data.content.length > 0) {
        this.hidden = !this.hidden;
      }
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }

  setValidators() {
    this.helperService.removeValidators(this.formData);
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      this.formData.controls["maToTrinh"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoTt"].setValidators([Validators.required]);
    }
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) {
      this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    }
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.setValidators();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    if (this.dataTable && this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách dự án công trình không được để trống');
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.tgTongHop = body.tgTongHop ? dayjs(body.tgTongHop) : null;
    body.maToTrinh = body.maToTrinh ? body.maToTrinh + this.maTt : this.maTt;
    body.soQuyetDinh = body.soQuyetDinh ? body.soQuyetDinh + this.soQd : this.soQd;
    body.children = this.dataTable;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    let res;
    if (this.idInput > 0) {
      res = await this.tongHopDxScLon.update(body);
    } else {
      res = await this.tongHopDxScLon.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        });
        this.guiDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.idInput = res.data.id;
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai
          });
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? "Bạn có chắc chắn muốn duyệt?" : "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO : {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.TU_CHOI_LDV : {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV : {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.TU_CHOI_LDTC : {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.CHO_DUYET_LDTC : {
              trangThai = STATUS.DA_DUYET_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.tongHopDxScLon.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? MESSAGE.PHE_DUYET_SUCCESS : MESSAGE.GUI_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });

  }


  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "Từ chối",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.TU_CHOI_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: trangThai
          };
          const res = await this.tongHopDxScLon.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async tongHop() {
    this.spinner.show();
    this.formData.patchValue({
      tgTongHop: new Date(),
      loaiTmdt: this.formData.value.loaiTmdt ? this.formData.value.loaiTmdt : "ALL"
    });
    let body = {
      "namKeHoach": this.formData.value.namKeHoach,
      "loaiTmdt": this.formData.value.loaiTmdt
    };
    let res = await this.tongHopDxScLon.tongHop(body);
    console.log(res);
    if (res.msg == MESSAGE.SUCCESS) {
      let list = res.data;
      if (list && list.listDxCuc.length > 0) {
        this.isTongHop = true;
        this.dataTable = res.data.listDxCuc;
        this.dataTable.forEach(item => {
          item.vonDauTuTcdt = item.vonDauTu;
        })
        await this.buildDataTable();
      } else {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu!");
        this.isTongHop = false;
        this.spinner.hide();
        return;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  async buildDataTable() {
    this.dataTableExpand = await chain(this.dataTable).groupBy("tenCuc").map((value, key) => {
      let rs = chain(value)
        .groupBy("tenChiCuc")
        .map((v, k) => {
          let rs1 = chain(v)
            .groupBy("tenKhoi")
            .map((v1, k1) => {
                return {
                  tenKhoi: k1,
                  expandSet: true,
                  children: v1
                };
              }
            ).value();
          return {
            tenChiCuc: k,
            children: rs1,
            expandSet: true,
          };
        }).value();
      return {
        tenCuc: key,
        children: rs,
        expandSet: true,
      };
    }).value();
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
          });
        }
      });
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


  sumSoLuong(data: any, row: string, type?: any) {
    let sl = 0;
    // let dataTable;
    // if (this.formData.value.id) {
    //   if (type) {
    //     if (data == 'tren') {
    //       dataTable = this.resultDx?.filter(item => item.tmdt > 15000000000);
    //     } else {
    //       dataTable = this.resultDx?.filter(item => item.tmdt <= 15000000000);
    //     }
    //   } else {
    //     if (data == 'tren') {
    //       dataTable = this.dataTableReq?.filter(item => item.tmdt > 15000000000);
    //     } else {
    //       dataTable = this.dataTableReq?.filter(item => item.tmdt <= 15000000000)
    //     }
    //   }
    // }else {
    //   if (data == 'tren') {
    //     dataTable = this.dataTableReq?.filter(item => item.tmdt > 15000000000);
    //   } else {
    //     dataTable = this.dataTableReq?.filter(item => item.tmdt <= 15000000000)
    //   }
    // }
    // if (dataTable) {
    //   const filteredData = dataTable.filter(item => {
    //     if (data == 'tren') {
    //       return item.tmdt > 15000000000;
    //     } else {
    //       return item.tmdt <= 15000000000;
    //     }
    //   });
    //   sl = filteredData.reduce((prev, cur) => {
    //     prev += cur[row];
    //     return prev;
    //   }, 0);
    // }
    return sl;
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }

  openQdPheDuyet(id, b: boolean) {
    this.idTongHop = id
    this.quyetDinh = !this.quyetDinh;
    this.emitTab({tab: "qdbtc", id: this.idTongHop, quyetDinh: this.quyetDinh});
  }

  deleteRow(data) {
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
          let indexData = this.dataTable.indexOf(data);
          this.dataTable = this.dataTable.filter((item, index) => index != indexData);
          this.buildDataTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  exportDetail($event) {
    $event.stopPropagation()
    let body = {
      id: this.idInput,
      title: this.formData.value.loaiTmdt == 'TREN15TY' ? 'TRÊN 15 TỶ' : 'DƯỚI 15 TỶ'
    }
    this.spinner.show();
    this.tongHopDxScLon
      .exportDetail(body)
      .subscribe((blob) =>
        saveAs(blob, 'data.xlsx'),
      );
    this.spinner.hide();
  }
}
