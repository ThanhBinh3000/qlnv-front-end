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
import {QuyHoachKho} from "../../../../../../models/QuyHoachVaKeHoachKhoTang";
import {QuyHoachKhoService} from "../../../../../../services/quy-hoach-kho.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {DANH_MUC_LEVEL} from "../../../../../luu-kho/luu-kho.constant";
import {UserLogin} from "../../../../../../models/userlogin";
import {STATUS} from "../../../../../../constants/status";

import {DonviService} from "../../../../../../services/donvi.service";


@Component({
  selector: 'app-them-moi-qd',
  templateUrl: './them-moi-qd.component.html',
  styleUrls: ['./them-moi-qd.component.scss']
})
export class ThemMoiQdComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() type: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  formData: FormGroup
  maQd: string;
  dataTable: any[] = []
  danhSachNam: any[] = [];
  rowItem: QuyHoachKho = new QuyHoachKho();
  dataEdit: { [key: string]: { edit: boolean; data: QuyHoachKho } } = {};
  danhSachPhuongAn: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  danhSachChiCuc: any[] = [];
  danhSachDiemKho: any[] = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dmDviService: DonviService,
    private quyHoachKhoService: QuyHoachKhoService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soQuyetDinh: [null, [Validators.required]],
      trichYeu: [null, [Validators.required]],
      ngayKy: [null, [Validators.required]],
      namBatDau: [null, [Validators.required]],
      namKetThuc: [null, [Validators.required]],
      moTa: [null, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/QĐ-BTC',
      await Promise.all([
        await this.loadListPa(),
        await this.loadDsCuc(this.userInfo.MA_DVI),
         await this.getDataDetail(this.idInput)
      ])
    this.spinner.hide();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -5; i < 5; i++) {
      this.danhSachNam.push((thisYear - i));
    }
  }


  async loadListPa() {
    this.danhSachPhuongAn = [];
    let res = await this.danhMucService.danhMucChungGetAll('PA_QUY_HOACH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachPhuongAn = res.data;
    }
  }

  async loadDsCuc(maCuc) {
    const body = {
      maDviCha: maCuc,
      trangThai: '01',
    };

    const dsTong = await this.dmDviService.layDonViTheoCapDo(body);
    this.dsCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.dsCuc = this.dsCuc.filter(item => item.type != "PB")
  }

  async onChangeCuc(event, type?) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.dmDviService.layDonViTheoCapDo(body);
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.danhSachChiCuc = this.danhSachChiCuc.filter(item => item.type != "PB")
    const chiCuc = this.dsCuc.filter(item => item.maDvi == event);
    if (type) {
      type.tenCuc = chiCuc[0].tenDvi;
    } else {
      this.rowItem.tenCuc = chiCuc[0].tenDvi;
    }
  }


  async onChangChiCuc(event, type?) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.dmDviService.layDonViTheoCapDo(body);
    this.danhSachDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
    this.danhSachDiemKho = this.danhSachDiemKho.filter(item => item.type == "MLK")
    const chiCuc = this.danhSachChiCuc.filter(item => item.maDvi == event);
    if (type) {
      type.tenChiCuc = chiCuc[0].tenDvi;
    } else {
      this.rowItem.tenChiCuc = chiCuc[0].tenDvi;
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }


  async save(isBanHanh?) {
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
    body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.quyetDinhQuyHoachCTietReqs = this.dataTable
    body.maDvi = this.userInfo.MA_DVI;
    body.type = this.type;
    let res
    if (this.idInput > 0) {
      res = await this.quyHoachKhoService.update(body);
    } else {
      res = await this.quyHoachKhoService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
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

  banHanh() {
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
          let body = {
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH,
          };
          let res =
            await this.quyHoachKhoService.approve(
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


  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyHoachKhoService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
        tenTrangThai: data.tenTrangThai,
        soQuyetDinh: data.soQuyetDinh.split('/')[0],
        ngayKy: data.ngayKy,
        namBatDau: data.namBatDau,
        namKetThuc: data.namKetThuc,
        moTa: data.moTa
      });
      this.dataTable = data.quyetDinhQuyHoachCTiets;
      this.updateEditCache()
    }
  }

  async loadDanhSachDiemKho(maChiCuc) {
    const body = {
      maDviCha: maChiCuc,
      trangThai: '01',
    };
    const dsTong = await this.dmDviService.layDonViTheoCapDo(body);
    this.danhSachDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
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
    this.rowItem = new QuyHoachKho();
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

  exportData() {

  }

  changePhuongAn(event, type?) {
    const phuongAn = this.danhSachPhuongAn.filter(item => item.ma == event);
    if (phuongAn) {
      if (type) {
        type.tenPhuongAn = phuongAn[0].giaTri
      } else {
        this.rowItem.tenPhuongAn = phuongAn[0].giaTri
      }
    }

  }

  onChangDiemKho(event, type?) {
    const diemKho = this.danhSachDiemKho.filter(item => item.maDvi == event);
    if (diemKho) {
      if (type) {
        type.tenDiemKho = diemKho[0].tenDvi
        type.diaDiem = diemKho[0].diaChi
      } else {
        this.rowItem.tenDiemKho = diemKho[0].tenDvi
        this.rowItem.diaDiem = diemKho[0].diaChi
      }
    }
  }

}
