
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
import {ThongTinQuyetDinh} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {LkTheKhoCt} from "../../../../../../models/LkTheKhoCt";
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

  userInfo : UserLogin
  formData: FormGroup
  dataTable: any[] = []
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: KeHoachXayDungTrungHan = new KeHoachXayDungTrungHan();
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachXayDungTrungHan } } = {};
  isTongHop: boolean = false;
  listNam: any[] = [];
  fileDinhKems: any[] = [];

  STATUS = STATUS
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
      loaiDuAn: [null, [Validators.required]],
      namBatDau: [null, [Validators.required]],
      namKetThuc: [null, [Validators.required]],
      ngayTongHop: [null],
      noiDung: [null],
      maToTrinh: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.loadDsNam()
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.formData.value.namBatDau > this.formData.value.namKetThuc) {
      this.notification.error(MESSAGE.ERROR, "Năm bắt đàu không được lớn hơn năm kết thúc!")
      this.spinner.hide();
      return
    }
    let body = this.formData.value;
    body.ctiets = this.dataTable;
    body.fileDinhKems = this.fileDinhKems;
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
              trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.TU_CHOI_TP : {
              trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.TU_CHOI_LDC : {
              trangThai = STATUS.CHO_DUYET_LDC;
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
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.TU_CHOI_TP
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_LDC
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
            case STATUS.CHO_DUYET_TP : {
              trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC : {
              trangThai = STATUS.DA_DUYET_LDC;
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
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let idTh = await this.userService.getId("KT_KH_TH_TRUNGHAN_SEQ");
    if (!idTh) {
      this.notification.error(MESSAGE.ERROR, "Lỗi hệ thống!")
      return;
    }
    let body = this.formData.value;
    let res = await this.tongHopDxXdTh.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let list = res.data;
      if (list && list.length != 0) {
        this.isTongHop = true;
        this.dataTable = list;
        this.formData.patchValue({
          id : idTh
        })
      } else  {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu!")
        return;
      }
      this.spinner.hide();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      this.spinner.hide();
    }
    this.spinner.hide();
  }
}

