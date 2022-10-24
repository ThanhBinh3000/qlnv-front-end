import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import {UserLogin} from "../../../../models/userlogin";
import {QuyHoachKho} from "../../../../models/QuyHoachVaKeHoachKhoTang";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DonviService} from "../../../../services/donvi.service";
import {QuyHoachKhoService} from "../../../../services/quy-hoach-kho.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../services/helper.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../constants/message";
import {STATUS} from "../../../../constants/status";
import {QuanLyDanhSachHangHongHocService} from "../../../../services/quanLyDanhSachHangHongHoc.service";


@Component({
  selector: 'app-thong-tin-hang-sua-chua',
  templateUrl: './thong-tin-hang-sua-chua.component.html',
  styleUrls: ['./thong-tin-hang-sua-chua.component.scss']
})
export class ThongTinHangSuaChuaComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() type: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  formData: FormGroup
  dataTable: any[] = []
  danhSachNam: any[] = [];
  rowItem: QuyHoachKho = new QuyHoachKho();
  dataEdit: { [key: string]: { edit: boolean; data: QuyHoachKho } } = {}
  maQd: string;
  taiLieuDinhKemList: any[] = [];
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dmDviService: DonviService,
    private hongHocService :QuanLyDanhSachHangHongHocService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDanhSach: [null],
      tenDonvi: [null],
      ngayTao: [null],
      trangThaiXuLy: [null],
      tenTrangThaiXuLy: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
      this.maQd = '/QĐ-TCDT',
      this.getDataDetail(this.idInput)
    ])
    this.spinner.hide();
  }

  quayLai() {
    this.showListEvent.emit();
  }


  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.hongHocService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        maDanhSach: data.maDanhSach,
        tenDonvi:data.tenDonvi,
        ngayTao: data.ngayTao,
        trangThaiXuLy: data.trangThaiXuLy,
        tenTrangThaiXuLy: data.tenTrangThaiXuLy,
      });
      this.dataTable = data.ds;
      this.updateEditCache()
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

  exportData() {

  }

}
