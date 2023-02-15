import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import {DanhMucKho} from "../../../danh-muc-du-an/danh-muc-du-an.component";
import {MESSAGE} from "../../../../../../constants/message";
import {KtQdXdHangNamService} from "../../../../../../services/kt-qd-xd-hang-nam.service";
import {UserLogin} from "../../../../../../models/userlogin";
import dayjs from "dayjs";
import {DanhMucKhoService} from "../../../../../../services/danh-muc-kho.service";
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-them-moi-qd-pd-dx-nhu-cau',
  templateUrl: './them-moi-qd-pd-dx-nhu-cau.component.html',
  styleUrls: ['./them-moi-qd-pd-dx-nhu-cau.component.scss']
})
export class ThemMoiQdPdDxNhuCauComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup
  userInfo : UserLogin
  maQd: string;
  STATUS = STATUS
  dataTable: any[] = []
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: DanhMucKho = new DanhMucKho();
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucKho } } = {};
  listPhuongAnTC: any[] = [];
  listNam: any[] = [];
  fileDinhKems: any[] = [];
  dataTableTh: any[] = [];
  listDmKho: any[] = [];
  listLoaiDuAn: any[] = [];
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private qdService : KtQdXdHangNamService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dmKhoService: DanhMucKhoService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      soQd: [null, Validators.required],
      phuongAnTc: [null, Validators.required],
      ngayTrinhBtc: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trichYeu: [null, Validators.required],
      namKeHoach: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/TCDT-TVQT';
    this.loadDsNam();
    await this.getAllDmKho();
    await this.getAllLoaiDuAn();
    await this.getAllQdTrungHan();
    await this.getDetail(this.idInput);
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


  async getAllDmKho() {
    let res = await this.dmKhoService.getAllDmKho('DMK');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
    }
  }

  async getDetail(id) {
    if (id > 0) {
      let res = await this.qdService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        phuongAnTc: data.phuongAnTc,
        soQd: data.soQd ? data.soQd.split("/")[0] : null,
        ngayTrinhBtc:data.ngayTrinhBtc,
        ngayKy: data.ngayKy,
        trichYeu: data.trichYeu,
        namKeHoach : data.namKeHoach,
        trangThai: data.trangThai,
        tenTrangThai:data.tenTrangThai,
      });
      this.fileDinhKems = data.fileDinhKems
      this.dataTable = data.ctiets;
      this.dataTableTh = data.ctietsTh;
      this.updateEditCache();
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async getAllQdTrungHan() {
    let res = await this.qdService.getAllPaTc();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongAnTC = res.data
    }
  }



  async save(isOther: boolean) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.ctiets = this.dataTable;
    body.fileDinhKems = this.fileDinhKems;
    body.maDvi = this.userInfo.MA_DVI;
    let res
    if (this.idInput > 0) {
      res = await this.qdService.update(body);
    } else {
      res = await this.qdService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isOther) {
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
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
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
              trangThai = STATUS.BAN_HANH;
              break;
            }
          }
          let body = {
            id: this.formData.get('id').value,
            lyDo: null,
            trangThai: trangThai,
          };
          let res =
            await this.qdService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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

  async updateDx(event) {
    let arr = this.listPhuongAnTC.filter(item => item.maToTrinh == event);
    if (arr && arr.length >0) {
      let result = arr[0];
      this.dataTable = result.ctiets
      this.updateEditCache()
    }
  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
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
          this.updateEditCache()
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new DanhMucKho();
    this.updateEditCache()
  }

  clearData() {

  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }

  luuEdit(index: number): void {
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        }
      });
    }
  }


  changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmKho.filter(item => item.maDuAn == event)
      if (result && result.length > 0) {
        this.rowItem = result[0];
        this.rowItem.tgKcHt = this.rowItem.tgKhoiCong + ' - ' + this.rowItem.tgHoanThanh
      }
    }
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
}
