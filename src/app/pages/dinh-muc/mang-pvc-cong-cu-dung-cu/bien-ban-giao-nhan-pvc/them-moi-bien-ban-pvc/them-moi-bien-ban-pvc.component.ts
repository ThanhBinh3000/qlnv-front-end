import { Component, Input, OnInit } from '@angular/core';
import {Validators} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {KtKhXdHangNamService} from "../../../../../services/kt-kh-xd-hang-nam.service";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {ChiTiet} from "../../../../../models/BienBanGuiHang";
import {MESSAGE} from "../../../../../constants/message";

@Component({
  selector: 'app-them-moi-bien-ban-pvc',
  templateUrl: './them-moi-bien-ban-pvc.component.html',
  styleUrls: ['./them-moi-bien-ban-pvc.component.scss']
})
export class ThemMoiBienBanPvcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;

  rowItem: BienBanPvcCt = new BienBanPvcCt();
  dataEdit: { [key: string]: { edit: boolean; data: BienBanPvcCt } } = {};
  dataTableBg : any[] = []
  dataTableBn : any[] = []

  benNhan: ChiTiet = new ChiTiet();
  benGiao: ChiTiet = new ChiTiet();




  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      soBienBan: [null, Validators.required],
      diaDiem: [null, Validators.required],
      namKeHoach: [null, Validators.required],
      soHopDong: [null, Validators.required],
      quyCach: [null, Validators.required],
      noiDung: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
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
      this.rowItem = new BienBanPvcCt();
    this.updateEditCache()
  }

  clearData() {
      this.rowItem = new BienBanPvcCt();
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
  editItem(index: number): void {
      this.dataEdit[index].edit = true;
  }

  addDaiDien(bienBan: ChiTiet, type: string) {
    if (!(bienBan.chucVu && bienBan.daiDien)) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng không để trống!');
      return;
    }
    const chiTiet = new ChiTiet();
    chiTiet.loaiDaiDien = type;
    if (type == "00") {
      chiTiet.chucVu = this.benNhan.chucVu;
      chiTiet.daiDien = this.benNhan.daiDien;
      console.log(chiTiet)
      this.dataTableBn.push(chiTiet);
    }
    if (type == "01") {
      chiTiet.chucVu = this.benGiao.chucVu;
      chiTiet.daiDien = this.benGiao.daiDien;
      this.dataTableBg.push(chiTiet);
    }
    this.clearDaiDien(type);
  }


  clearDaiDien(type: string) {
    if (type == '00') {
      this.benNhan = new ChiTiet();
    }
    if (type == '01') {
      this.benGiao = new ChiTiet();
    }
  }

  deleteBienBan(idx: number, type) {
    if (type == '00') {
      this.dataTableBn.splice(idx, 1);
    }
    if (type == '01') {
      this.dataTableBg.splice(idx, 1);
    }
  }


}

export class BienBanPvcCt {
  id : number;
  loaiVthh : string;
  soLuong :number;
  dviTinh : string;
  donGia : string;
  thanhTien : number;
}
