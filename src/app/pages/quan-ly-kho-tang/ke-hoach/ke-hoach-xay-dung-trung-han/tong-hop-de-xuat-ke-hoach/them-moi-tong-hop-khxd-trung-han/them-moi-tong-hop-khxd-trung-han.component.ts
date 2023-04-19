
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
import {TongHopKhTrungHanService} from "../../../../../../services/tong-hop-kh-trung-han.service";
import {UserLogin} from "../../../../../../models/userlogin";
import {KeHoachXayDungTrungHan} from "../../../../../../models/QuyHoachVaKeHoachKhoTang";
import {STATUS} from "../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

@Component({
  selector: 'app-them-moi-tong-hop-khxd-trung-han',
  templateUrl: './them-moi-tong-hop-khxd-trung-han.component.html',
  styleUrls: ['./them-moi-tong-hop-khxd-trung-han.component.scss']
})
export class ThemMoiTongHopKhxdTrungHanComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSet = new Set<number>();
  userInfo : UserLogin
  formData: FormGroup
  formTongHop: FormGroup
  listDx: any[] = []
  dataTable: any[] = []
  dataTableReq: any[] = []
  dataTableDx: any[] = []
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: KeHoachXayDungTrungHan = new KeHoachXayDungTrungHan();
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachXayDungTrungHan } } = {};
  isTongHop: boolean = false;
  listNam: any[] = [];
  fileDinhKems: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS
  maTt: string;
  soQd : string;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxXdTh: TongHopKhTrungHanService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      namBatDau: [null],
      namKetThuc: [null],
      ngayTongHop: [null],
      tgTongHop: [null],
      namKeHoach: [''],
      noiDung: [null],
      maToTrinh: [null],
      soQuyetDinh: [null],
      ngayKyQd: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDo: [],
    });
    this.formTongHop = this.fb.group({
      namKeHoach : [dayjs().get('year')],
      namBatDau : [],
      namKetThuc : [],
      loaiDuAn : [],
      tgTongHop : [],
    })
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maTt = '/TTr-TCDT';
    this.soQd = '/QĐ-TCDT';
    this.loadDsNam();
    await this.getDataDetail(this.idInput)
    await this.getAllLoaiDuAn();
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.isTongHop = true;
      let res = await this.tongHopDxXdTh.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        loaiDuAn: data.loaiDuAn,
        namBatDau: data.namBatDau,
        namKetThuc: data.namKetThuc,
        ngayTongHop: data.ngayTongHop,
        noiDung: data.noiDung,
        maToTrinh: data.maToTrinh,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
        lyDo: data.lyDoTuChoi,
      });
      this.fileDinhKems = data.fileDinhKems
      this.dataTable = data.ctiets;
      this.dataTableDx = data.ctietsDx;
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }

  setValidators() {
    this.formData.controls["ngayTongHop"].setValidators([Validators.required]);
    this.formData.controls["noiDung"].setValidators([Validators.required]);
    this.formData.controls["maToTrinh"].setValidators([Validators.required]);
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.setValidators();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maToTrinh = body.maToTrinh ? body.maToTrinh + this.maTt : null;
    body.soQuyetDinh = body.soQuyetDinh ? body.soQuyetDinh + this.soQd : null;
    body.ctiets = this.dataTableReq;
    body.fileDinhKems = this.fileDinhKems;
    body.maDvi = this.userInfo.MA_DVI;
    let res
    if (this.idInput > 0) {
      res = await this.tongHopDxXdTh.update(body);
    } else {
      res = await this.tongHopDxXdTh.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.guiDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
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
          }
          let body = {
            id: this.formData.get('id').value,
            lyDo: null,
            trangThai: trangThai,
          };
          let res =
            await this.tongHopDxXdTh.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.GUI_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });

  }


  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.TU_CHOI_LDTC
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDo: text,
            trangThai: trangThai,
          };
          const res = await this.tongHopDxXdTh.approve(body);
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

  duyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_LDV : {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.CHO_DUYET_LDTC : {
              trangThai = STATUS.DA_DUYET_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.get('id').value,
            lyDo: null,
            trangThai: trangThai,
          };
          let res =
            await this.tongHopDxXdTh.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async tongHop() {
    this.spinner.show();
    this.formTongHop.patchValue({
      tgTongHop : Date.now()
    })
    let body = this.formData.value;
    let res = await this.tongHopDxXdTh.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        namKeHoach : this.formTongHop.value.namKeHoach,
        tgTongHop : this.formTongHop.value.tgTongHop,
        namBatDau : this.formTongHop.value.namBatDau,
        namKetThuc : this.formTongHop.value.namKetThuc
      })
      let list = res.data;
      if (list && list.length != 0) {
        this.isTongHop = true;
        this.listDx= list;
        this.dataTableReq= list;
      } else  {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu!")
        this.spinner.hide();
        return;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  calcTong(type) {
    let sum;
    if (this.dataTable && this.dataTable.length > 0) {
      sum = this.dataTable.reduce((prev, cur) => {
        switch (type) {
          case '1' : {
            prev += cur.tmdtDuKien;
            break;
          }
          case '2' : {
            prev += cur.nstwDuKien;
            break;
          }
          case '3' : {
            prev += cur.tongSoLuyKe;
            break;
          }
          case '4' : {
            prev += cur.luyKeNstw;
            break;
          }
          case '5' : {
            prev += cur.tmdtDuyet;
            break;
          }
          case '6' : {
            prev += cur.nstwDuyet;
            break;
          }
        }
        return prev;
      }, 0);
    }
    return sum;
  }

  selectRow(item: any) {
    if (!item.selected) {
      this.listDx.forEach(item => {
        item.selected = false
      })
      item.selected = true;
      if (item.chiTiets && item.chiTiets.length > 0) {
        this.dataTableDx = item.chiTiets;
        this.dataTableDx = this.convertListData(this.dataTableDx)
        this.expandAll(this.dataTableDx);
      }
    }
  }

  expandAll(table : any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  convertListData(table : any[]) {
    if (table && table.length > 0) {
      table = chain(table).groupBy("khoi").map((value, key) => ({
          khoi: key,
          dataChild: value,
          idVirtual: uuidv4()
        })
      ).value();
    }
    return table;
  }

  sumSoLuong(data: any, row: string, table : any[], type?: any) {
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
      if (table && table.length > 0) {
        let sum = 0;
        table.forEach(item => {
          sum +=  this.sumSoLuong(item, row, table)
        })
        sl = sum;
      }
    }
    return sl;
  }

}

