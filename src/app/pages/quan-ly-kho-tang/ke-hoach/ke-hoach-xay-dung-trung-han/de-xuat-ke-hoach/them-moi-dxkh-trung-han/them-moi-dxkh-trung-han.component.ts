import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThongTinQuyetDinh} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import {KeHoachXayDungTrungHan} from "../../../../../../models/QuyHoachVaKeHoachKhoTang";
import dayjs from "dayjs";
import {UserLogin} from "../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../constants/message";
import {DxXdTrungHanService} from "../../../../../../services/dx-xd-trung-han.service";
import {STATUS} from "../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {DanhMucKhoService} from "../../../../../../services/danh-muc-kho.service";
import {DanhMucKho} from "../../../danh-muc-du-an/danh-muc-du-an.component";

@Component({
  selector: 'app-them-moi-dxkh-trung-han',
  templateUrl: './them-moi-dxkh-trung-han.component.html',
  styleUrls: ['./them-moi-dxkh-trung-han.component.scss']
})
export class ThemMoiDxkhTrungHanComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup
  maQd: string;

  STATUS = STATUS
  dataTable: any[] = []
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: DanhMucKho = new DanhMucKho();
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucKho } } = {};
  listNam: any[] = [];
  userInfo: UserLogin
  listFileDinhKem: any[] = [];
  listDmKho: any[] = [];
  listLoaiDuAn: any[] = [];



  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dmKhoService: DanhMucKhoService,
    private dxTrungHanService: DxXdTrungHanService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      maDvi: [null],
      tenDvi: [null],
      soCongVan: [null, [Validators.required]],
      ngayKy: [null, [Validators.required]],
      namBatDau: [null, [Validators.required]],
      namKetThuc: [null, [Validators.required]],
      trichYeu: [null],
      lyDo: [null]
    });

  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.DON_VI.tenVietTat + "-TCKT";
    this.loadDsNam();
    await this.getAllDmKho();
    await this.getAllLoaiDuAn();
    if (this.idInput > 0) {
      await this.getDataDetail(this.idInput)
    } else {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_DVI
      })
    }
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
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Không được để trống thông tin chi tiết quy hoạch")
      this.spinner.hide();
      return
    }
    let body = this.formData.value;
    body.soCongVan = body.soCongVan + this.maQd;
    body.ctiets = this.dataTable;
    body.maDvi = this.userInfo.MA_DVI
    body.fileDinhKems = this.listFileDinhKem;
    body.tmdt = this.calcTong('1') ?  this.calcTong('1') : 0;
    let res
    if (this.idInput > 0) {
      res = await this.dxTrungHanService.update(body);
    } else {
      res = await this.dxTrungHanService.create(body);
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
          const res = await this.dxTrungHanService.approve(body);
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
            await this.dxTrungHanService.approve(
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
            await this.dxTrungHanService.approve(
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

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.dxTrungHanService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        tenDvi: data.tenDvi,
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
        tenTrangThai: data.tenTrangThai,
        soCongVan: data.soCongVan ? data.soCongVan.split('/')[0] : '',
        ngayKy: data.ngayKy,
        namBatDau: data.namBatDau,
        namKetThuc: data.namKetThuc,
        lyDo: data.lyDoTuChoi,
      });
      this.listFileDinhKem = data.fileDinhKems
      this.dataTable = data.ctiets;
      this.updateEditCache()
    }
  }

  async getAllDmKho() {
    let res = await this.dmKhoService.getAllDmKho('DMK');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }


  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.rowItem.maDvi = this.userInfo.MA_DVI
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new DanhMucKho();
    this.updateEditCache()
  }

  clearData() {

  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: {...this.dataTable[idx]},
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
          data: {...item},
        }
      });
    }
  }

  calcTong(type) {
      const sum = this.dataTable.reduce((prev, cur) => {
        switch (type) {
          case '1' : {
            prev += cur.tmdtTongSo;
            break;
          }
          case '2' : {
            prev += cur.tmdtNstw;
            break;
          }
          case '3' : {
            prev += cur.luyKeTongSo;
            break;
          }
          case '4' : {
            prev += cur.luyKeNstw;
            break;
          }
          case '5' : {
            prev += cur.ncKhTongSo;
            break;
          }
          case '6' : {
            prev += cur.ncKhNstw;
            break;
          }
        }
        return prev;
      }, 0);
      return sum;
    }

  changeDmucDuAn(event: any) {
    if (event) {
      this.rowItem.diaDiem = event.diaDiem;
      this.rowItem.tenDuAn = event.tenDuAn;
      this.rowItem.tgKcHt = event.tgKhoiCong + ' - ' + event.tgHoanThanh;
      this.rowItem.khoi = event.khoi;
      this.rowItem.soQdPd = event.soQdPd;
    }
  }
}
