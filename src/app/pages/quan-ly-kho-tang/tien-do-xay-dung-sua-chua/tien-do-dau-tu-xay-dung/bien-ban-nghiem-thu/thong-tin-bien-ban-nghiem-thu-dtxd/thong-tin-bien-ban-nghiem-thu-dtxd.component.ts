import {Component, Input, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../../constants/message";
import {HopDongMmTbcdService} from "../../../../../../services/hop-dong-mm-tbcd.service";
import dayjs from "dayjs";
import {MmBbGiaoNhanService} from "../../../../../../services/mm-bb-giao-nhan.service";
import {STATUS} from "../../../../../../constants/status";
import {
  MmHopDongCt
} from "../../../../../dinh-muc/may-moc-thiet-bi/mm-hop-dong/mm-thong-tin-hop-dong/mm-thong-tin-hop-dong.component";
import {
  BienBanNghiemThuDtxdService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/bien-ban-nghiem-thu-dtxd.service";

@Component({
  selector: 'app-thong-tin-bien-ban-nghiem-thu-dtxd',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-dtxd.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-dtxd.component.scss']
})
export class ThongTinBienBanNghiemThuDtxdComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;

  rowItem: MmHopDongCt = new MmHopDongCt();
  rowItemBg: MmBbGiaoNhanCt = new MmBbGiaoNhanCt();
  rowItemBn: MmBbGiaoNhanCt = new MmBbGiaoNhanCt();
  dataEditBg: { [key: string]: { edit: boolean; data: MmBbGiaoNhanCt } } = {};
  dataEditBn: { [key: string]: { edit: boolean; data: MmBbGiaoNhanCt } } = {};
  dataEdit: { [key: string]: { edit: boolean; data: MmHopDongCt } } = {};
  listHopDong: any[] = []
  listHangHoa: any[] = []
  tableBenGiao: any[] = []
  tableBenNhan: any[] = []
  maBb: string


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv : BienBanNghiemThuDtxdService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      soBienBan: [null, Validators.required],
      diaDiemGiaoNhan: [null],
      namKeHoach: [dayjs().get('year'), Validators.required],
      soHopDong: [null, Validators.required],
      ngayGiaoNhan: [null, Validators.required],
      benGiaoHang: [null, Validators.required],
      benNhanHang: [null, Validators.required],
      quyCachChatLuong: [null],
      noiDungKhac: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maBb = `/${this.formData.value.namKeHoach}/BBGN-` + this.userInfo.DON_VI.tenVietTat;
      if (this.id > 0) {
        this.detail(this.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.bienBanSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.formData.patchValue({
            soBienBan : this.formData.value.soBienBan ?  this.formData.value.soBienBan.split('/')[0] : null
          })
          this.dataTable = data.listQlDinhMucBbGnLoaiHh;
          this.tableBenNhan = data.listQlDinhMucBbGnDaiDienBenNhan;
          this.tableBenGiao = data.listQlDinhMucBbGnDaiDienBenGiao;
          this.updateEditCache()
          this.updateEditCacheBgBn('benGiao')
          this.updateEditCacheBgBn('benNhan')
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.formData.value.listQlDinhMucBbGnLoaiHh = this.dataTable;
    this.formData.value.listQlDinhMucBbGnDaiDienBenGiao = this.dataTable;
    this.formData.value.listQlDinhMucBbGnDaiDienBenNhan = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI
    let body = this.formData.value;
    body.soBienBan = body.soBienBan + this.maBb
    body.fileDinhKems = this.fileDinhKem
    body.listQlDinhMucBbGnDaiDienBenGiao = this.tableBenGiao
    body.listQlDinhMucBbGnDaiDienBenNhan = this.tableBenNhan
    let data = await this.createUpdate(body);
    if (data) {
      this.goBack()
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
      case STATUS.TUCHOI_CB_CUC : {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_KY : {
        trangThai = STATUS.DADUYET_CB_CUC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
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


  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    this.rowItem.id= null
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new MmHopDongCt();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maHangHoa == item.maHangHoa) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: MmHopDongCt) {
    let msgRequired = '';
    //validator
    if (!item.maHangHoa) {
      msgRequired = "Loại tài sản không được để trống";
    } else if (!item.soLuong) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  refresh() {
    this.rowItem = new MmHopDongCt();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveEdit(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiBgBn(type) {
    if (type == 'benGiao') {
      this.rowItemBg.loai = 'GIAO'
      this.rowItemBg.id= null
      this.tableBenGiao = [...this.tableBenGiao, this.rowItemBg];
      this.rowItemBg = new MmBbGiaoNhanCt();
      this.updateEditCacheBgBn(type);
    } else {
      this.rowItemBn.loai = 'NHAN '
      this.rowItemBn.id= null
      this.tableBenNhan = [...this.tableBenNhan, this.rowItemBn];
      this.rowItemBn = new MmBbGiaoNhanCt();
      this.updateEditCacheBgBn(type);
    }
  }

  updateEditCacheBgBn(type) {
    if (type == 'benGiao') {
      if (this.tableBenGiao) {
        this.tableBenGiao.forEach((item, index) => {
          this.dataEditBg[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    } else {
      if (this.tableBenNhan) {
        this.tableBenNhan.forEach((item, index) => {
          this.dataEditBn[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
  }

  refreshBgBn(type) {
    if (type =='benGiao') {
      this.rowItemBg = new MmBbGiaoNhanCt();
    } else {
      this.rowItemBn = new MmBbGiaoNhanCt();
    }
  }

  editRowBgBn(stt: number, type) {
    if (type == 'benGiao') {
      this.dataEditBg[stt].edit = true;
    } else {
      this.dataEditBn[stt].edit = true;
    }
  }

  cancelEditBgBn(stt: number, type): void {
    if (type == 'benGiao') {
      this.dataEditBg[stt] = {
        data: {...this.tableBenGiao[stt]},
        edit: false
      };
    } else {
      this.dataEditBn[stt] = {
        data: {...this.tableBenNhan[stt]},
        edit: false
      };
    }
  }

  async saveEditBgBn(idx: number, type) {
    if (type == 'benGiao') {
      this.dataEditBg[idx].edit = false;
      Object.assign(this.tableBenGiao[idx], this.dataEditBg[idx].data);
      this.updateEditCacheBgBn(type);
    } else {
      this.dataEditBn[idx].edit = false;
      Object.assign(this.tableBenNhan[idx], this.dataEditBn[idx].data);
      this.updateEditCacheBgBn(type);
    }

  }

  deleteItemBgBn(index: any, type) {
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
          if (type == 'benGiao') {
            this.tableBenGiao.splice(index, 1);
            this.updateEditCacheBgBn(type);
          } else {
            this.tableBenNhan.splice(index, 1);
            this.updateEditCacheBgBn(type);
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }
}

export class MmBbGiaoNhanCt {
  id : number;
  bbGnId : number;
  hoVaTen : string;
  chucVu : string;
  loai : string;
}
