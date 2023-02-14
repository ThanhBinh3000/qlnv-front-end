import { Component, Input, OnInit } from '@angular/core';
import {Validators} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {KtKhXdHangNamService} from "../../../../../services/kt-kh-xd-hang-nam.service";
import {DanhMucKhoService} from "../../../../../services/danh-muc-kho.service";
import {QuyetDinhKhTrungHanService} from "../../../../../services/quyet-dinh-kh-trung-han.service";
import {Base2Component} from "../../../../../components/base2/base2.component";

@Component({
  selector: 'app-thong-tin-de-xuat-nhu-cau',
  templateUrl: './thong-tin-de-xuat-nhu-cau.component.html',
  styleUrls: ['./thong-tin-de-xuat-nhu-cau.component.scss']
})
export class ThongTinDeXuatNhuCauComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;

  rowItemTt: ThongTinNcChiCucPvc = new ThongTinNcChiCucPvc();
  dataEditTt: { [key: string]: { edit: boolean; data: ThongTinNcChiCucPvc } } = {};

  rowItemDx: DeXuatNcChiCucPvc = new DeXuatNcChiCucPvc();
  dataEditDx: { [key: string]: { edit: boolean; data: DeXuatNcChiCucPvc } } = {};

  dataTableTt : any[] = []
  dataTableDx : any[] = []




  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
    private dviService : DonviService,
    private dmKhoService : DanhMucKhoService,
    private qdTrungHanSv : QuyetDinhKhTrungHanService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      soCongVan: [null, Validators.required],
      namKeHoach: [null, Validators.required],
      soQdTrunghan: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
  }

  xoaItem(index: number, type : string) {
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
          if (type == 'tt') {
            this.dataTableTt.splice(index, 1);
          } else {
            this.dataTableDx.splice(index, 1);
          }
          this.updateEditCache(type)
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem(type : string) {
    if(type == 'tt') {
      if (!this.dataTableTt) {
        this.dataTableTt = [];
      }
      this.dataTableTt = [...this.dataTableTt, this.rowItemTt]
      this.rowItemTt = new ThongTinNcChiCucPvc();
    } else {
      if (!this.dataTableDx) {
        this.dataTableDx = [];
      }
      this.dataTableDx = [...this.dataTableDx, this.rowItemDx]
      this.rowItemDx = new DeXuatNcChiCucPvc();
    }
    this.updateEditCache(type)
  }

  clearData(type  :string) {
    if(type == 'tt') {
      this.rowItemTt = new ThongTinNcChiCucPvc();
    } else {
      this.rowItemDx = new DeXuatNcChiCucPvc();
    }
  }

  huyEdit(idx: number, type : string): void {
    if(type == 'tt') {
      this.dataEditTt[idx] = {
        data: { ...this.dataTableTt[idx] },
        edit: false,
      };
    } else {
      this.dataEditDx[idx] = {
        data: { ...this.dataTableDx[idx] },
        edit: false,
      };
    }
  }

  luuEdit(index: number, type : string): void {
    if(type == 'tt') {
      Object.assign(this.dataTableTt[index], this.dataEditTt[index].data);
      this.dataEditTt[index].edit = false;
    } else {
      Object.assign(this.dataTableDx[index], this.dataEditDx[index].data);
      this.dataEditDx[index].edit = false;
    }

  }

  updateEditCache(type : string): void {
    if(type == 'tt') {
      if (this.dataTableTt) {
        this.dataTableTt.forEach((item, index) => {
          this.dataEditTt[index] = {
            edit: false,
            data: { ...item },
          }
        });
      }
    } else {
      if (this.dataTableDx) {
        this.dataTableDx.forEach((item, index) => {
          this.dataEditDx[index] = {
            edit: false,
            data: { ...item },
          }
        });
      }
    }

  }
  editItem(index: number, type: string): void {
    if (type == 'tt') {
      this.dataEditTt[index].edit = true;
    } else {
      this.dataEditDx[index].edit = true;
    }
  }


}

export class ThongTinNcChiCucPvc {
  id : number;
  maDvi : string;
  noiDung : string;
  dviTinh : string;
  soLuong :number;
}

export class DeXuatNcChiCucPvc {
  id : number;
  ten : string;
  mota : string;
  dviTinh : string;
  slTon :number;
  slSdLai :number;
  slCan :number;
  ncCapMoi :number;
  slDeNghi :number;
  ghiChu :number;
}

