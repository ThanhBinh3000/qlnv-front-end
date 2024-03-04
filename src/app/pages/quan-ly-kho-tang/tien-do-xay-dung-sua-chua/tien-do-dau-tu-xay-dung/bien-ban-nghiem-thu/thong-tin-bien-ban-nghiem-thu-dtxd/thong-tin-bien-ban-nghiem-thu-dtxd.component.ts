import {Component, Input, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../constants/status";
import {
  MmHopDongCt
} from "../../../../../dinh-muc/may-moc-thiet-bi/mm-hop-dong/mm-thong-tin-hop-dong/mm-thong-tin-hop-dong.component";
import {
  BienBanNghiemThuDtxdService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/bien-ban-nghiem-thu-dtxd.service";
import {HopdongService} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/hopdong.service";
import {
  DialogMmBbGiaoNhanComponent
} from "../../../../../dinh-muc/may-moc-thiet-bi/mm-bien-ban-giao-nhan/mm-them-moi-bb-giao-nhan/dialog-mm-bb-giao-nhan/dialog-mm-bb-giao-nhan.component";

@Component({
  selector: 'app-thong-tin-bien-ban-nghiem-thu-dtxd',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-dtxd.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-dtxd.component.scss']
})
export class ThongTinBienBanNghiemThuDtxdComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() itemDuAn: any;
  @Input() itemQdPdKhLcnt: any;

  rowItem: MmHopDongCt = new MmHopDongCt();
  rowItemChuDauTu: KtDtxdBbNghiemThuDtl = new KtDtxdBbNghiemThuDtl();
  rowItemDvSuDung: KtDtxdBbNghiemThuDtl = new KtDtxdBbNghiemThuDtl();
  rowItemDvGiamSat: KtDtxdBbNghiemThuDtl = new KtDtxdBbNghiemThuDtl();
  rowItemDvThiCong: KtDtxdBbNghiemThuDtl = new KtDtxdBbNghiemThuDtl();
  rowItemDvQuanLy: KtDtxdBbNghiemThuDtl = new KtDtxdBbNghiemThuDtl();
  dataEditChuDauTu: { [key: string]: { edit: boolean; data: KtDtxdBbNghiemThuDtl } } = {};
  dataEditDvSuDung: { [key: string]: { edit: boolean; data: KtDtxdBbNghiemThuDtl } } = {};
  dataEditDvGiamSat: { [key: string]: { edit: boolean; data: KtDtxdBbNghiemThuDtl } } = {};
  dataEditDvThiCong: { [key: string]: { edit: boolean; data: KtDtxdBbNghiemThuDtl } } = {};
  dataEditDvQuanLy: { [key: string]: { edit: boolean; data: KtDtxdBbNghiemThuDtl } } = {};
  listHopDong: any[] = [];
  talbeChuDauTu: any[] = [];
  tableDvSuDung: any[] = [];
  talbeDvGiamSat: any[] = [];
  talbeDvThiCong: any[] = [];
  talbeDvQuanLy: any[] = [];
  maBb: string


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv: BienBanNghiemThuDtxdService,
    private hopdongService: HopdongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year')],
      soBienBan: [null, Validators.required],
      soHopDong: [null , Validators.required],
      tenHopDong: [null],
      idHopDong: [null],
      tenDuAn: [null],
      ngayKy: [null , Validators.required],
      chuDauTu: [null],
      dvGiamSat: [null],
      dvSuDung: [null],
      dvThiCong: [null],
      dvQuanLy: [null],
      ngayKhoiCong: [null],
      ngayHoanThanh: [null],
      thoiGianBatDau: [null , Validators.required],
      thoiGianKetThuc: [null , Validators.required],
      chatLuong: [null],
      ketLuan: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.loadDsHopDong()
      if (this.id > 0) {
        this.detail(this.id)
      } else {
        this.formData.patchValue({
          namKeHoach: this.itemDuAn.namKeHoach
        })
      }
      this.maBb = `/${this.formData.value.namKeHoach}/BBNT-` + this.userInfo.DON_VI.tenVietTat;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsHopDong() {
    this.spinner.show();
    try {
      let body = {
       "namKh" : this.itemDuAn.namKeHoach,
        "idDuAn" : this.itemDuAn.id
      }
      let res = await this.hopdongService.listHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listHopDong = data.filter(i=>i.trangThaiTd==STATUS.DA_HOAN_THANH);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.bienBanSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          let dataSobb = data.soBienBan?.split('/');
          this.maBb = dataSobb && dataSobb.length > 0 ? '/' + dataSobb[1] + '/' +  dataSobb[2] : null
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.formData.patchValue({
            soBienBan: dataSobb && dataSobb.length > 0 ? dataSobb[0] : null,
            tenHopDong : data && data.hopDong && data.hopDong.tenHd ? data.hopDong.tenHd : ''
          })
          let dataList = data.listKtTdxdBienbanNghiemthuDtl;
          if (dataList && dataList.length > 0) {
            this.talbeChuDauTu = dataList.filter(item => item.loai == '00');
            this.tableDvSuDung = dataList.filter(item => item.loai == '01');
            this.talbeDvGiamSat = dataList.filter(item => item.loai == '02');
            this.talbeDvThiCong = dataList.filter(item => item.loai == '03');
            this.talbeDvQuanLy = dataList.filter(item => item.loai == '04');
          }
          this.updateEditCacheBgBn('chuDauTu')
          this.updateEditCacheBgBn('dvSuDung')
          this.updateEditCacheBgBn('dvGiamSat')
          this.updateEditCacheBgBn('dvThiCong')
          this.updateEditCacheBgBn('dvQuanLy')
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
  async save(isKy?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.formData.value.maDvi = this.userInfo.MA_DVI
    let body = this.formData.value;
    body.soBienBan = body.soBienBan + this.maBb
    body.fileDinhKems = this.fileDinhKem
    body.idDuAn = this.itemDuAn.id
    body.idQdPdKhlcnt = this.itemQdPdKhLcnt.id
    body.listKtTdxdBienbanNghiemthuDtl = [...this.talbeChuDauTu, this.talbeDvThiCong, this.tableDvSuDung, this.talbeDvGiamSat, this.talbeDvQuanLy].flat();
    if (isKy) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Ký hợp đồng",
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.createUpdate(body);
            if (res) {
              let body = {
                id: res.id,
                trangThai: STATUS.DA_KY,
              }
             let resPd =  await this.bienBanSv.approve(body);
              if (resPd) {
                this.modal.closeAll()
              }
            }
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
     await this.createUpdate(body);
    }
  }

  themMoiChiTiet(type) {
    if (type == 'chuDauTu') {
      this.rowItemChuDauTu.loai = '00'
      this.rowItemChuDauTu.id = null
      this.talbeChuDauTu = [...this.talbeChuDauTu, this.rowItemChuDauTu];
      this.rowItemChuDauTu = new KtDtxdBbNghiemThuDtl();
      this.updateEditCacheBgBn(type);
    } else if (type == 'dvSuDung') {
      this.rowItemDvSuDung.loai = '01'
      this.rowItemDvSuDung.id = null
      this.tableDvSuDung = [...this.tableDvSuDung, this.rowItemDvSuDung];
      this.rowItemDvSuDung = new KtDtxdBbNghiemThuDtl();
      this.updateEditCacheBgBn(type);
    } else if (type == 'dvGiamSat') {
      this.rowItemDvGiamSat.loai = '02'
      this.rowItemDvGiamSat.id = null
      this.talbeDvGiamSat = [...this.talbeDvGiamSat, this.rowItemDvGiamSat];
      this.rowItemDvGiamSat = new KtDtxdBbNghiemThuDtl();
      this.updateEditCacheBgBn(type);
    } else if (type == 'dvThiCong') {
      this.rowItemDvThiCong.loai = '03'
      this.rowItemDvThiCong.id = null
      this.talbeDvThiCong = [...this.talbeDvThiCong, this.rowItemDvThiCong];
      this.rowItemDvThiCong = new KtDtxdBbNghiemThuDtl();
      this.updateEditCacheBgBn(type);
    } else if (type == 'dvQuanLy') {
      this.rowItemDvQuanLy.loai = '04'
      this.rowItemDvQuanLy.id = null
      this.talbeDvQuanLy = [...this.talbeDvQuanLy, this.rowItemDvQuanLy];
      this.rowItemDvQuanLy = new KtDtxdBbNghiemThuDtl();
      this.updateEditCacheBgBn(type);
    }
  }

  updateEditCacheBgBn(type, isAll?: string) {
    if (type == 'chuDauTu') {
      if (this.talbeChuDauTu) {
        this.talbeChuDauTu.forEach((item, index) => {
          this.dataEditChuDauTu[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    } else if (type == 'dvSuDung') {
      if (this.tableDvSuDung) {
        this.tableDvSuDung.forEach((item, index) => {
          this.dataEditDvSuDung[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    } else if (type == 'dvGiamSat') {
      if (this.talbeDvGiamSat) {
        this.talbeDvGiamSat.forEach((item, index) => {
          this.dataEditDvGiamSat[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    } else if (type == 'dvThiCong') {
      if (this.talbeDvThiCong) {
        this.talbeDvThiCong.forEach((item, index) => {
          this.dataEditDvThiCong[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    } else if (type == 'dvQuanLy') {
      if (this.talbeDvQuanLy) {
        this.talbeDvThiCong.forEach((item, index) => {
          this.dataEditDvQuanLy[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
  }

  refreshBgBn(type) {
    if (type == 'chuDauTu') {
      this.rowItemChuDauTu = new KtDtxdBbNghiemThuDtl();
    } else if (type == 'dvSuDung') {
      this.rowItemDvSuDung = new KtDtxdBbNghiemThuDtl();
    } else if (type == 'dvGiamSat') {
      this.rowItemDvGiamSat = new KtDtxdBbNghiemThuDtl();
    } else if (type == 'dvThiCong') {
      this.rowItemDvThiCong = new KtDtxdBbNghiemThuDtl();
    } else if (type == 'dvQuanLy') {
      this.rowItemDvQuanLy = new KtDtxdBbNghiemThuDtl();
    }
  }

  editRowBgBn(stt: number, type) {
    if (type == 'chuDauTu') {
      this.dataEditChuDauTu[stt].edit = true;
    } else if (type == 'dvSuDung') {
      this.dataEditDvSuDung[stt].edit = true;
    } else if (type == 'dvGiamSat') {
      this.dataEditDvGiamSat[stt].edit = true;
    } else if (type == 'dvThiCong') {
      this.dataEditDvThiCong[stt].edit = true;
    } else if (type == 'dvQuanLy') {
      this.dataEditDvQuanLy[stt].edit = true;
    }
  }

  cancelEditBgBn(stt: number, type): void {
    if (type == 'chuDauTu') {
      this.dataEditChuDauTu[stt] = {
        data: {...this.talbeChuDauTu[stt]},
        edit: false
      };
    } else if (type == 'dvSuDung') {
      this.dataEditDvSuDung[stt] = {
        data: {...this.tableDvSuDung[stt]},
        edit: false
      };
    } else if (type == 'dvGiamSat') {
      this.dataEditDvGiamSat[stt] = {
        data: {...this.talbeDvGiamSat[stt]},
        edit: false
      };
    } else if (type == 'dvThiCong') {
      this.dataEditDvThiCong[stt] = {
        data: {...this.talbeDvThiCong[stt]},
        edit: false
      };
    } else if (type == 'dvQuanLy') {
      this.dataEditDvQuanLy[stt] = {
        data: {...this.talbeDvQuanLy[stt]},
        edit: false
      };
    }
  }

  async saveEditBgBn(idx: number, type) {
    if (type == 'chuDauTu') {
      this.dataEditChuDauTu[idx].edit = false;
      Object.assign(this.talbeChuDauTu[idx], this.dataEditChuDauTu[idx].data);
      this.updateEditCacheBgBn(type);
    } else   if (type == 'dvSuDung') {
      this.dataEditDvSuDung[idx].edit = false;
      Object.assign(this.tableDvSuDung[idx], this.dataEditDvSuDung[idx].data);
      this.updateEditCacheBgBn(type);
    }   if (type == 'dvGiamSat') {
      this.dataEditDvGiamSat[idx].edit = false;
      Object.assign(this.talbeDvGiamSat[idx], this.dataEditDvGiamSat[idx].data);
      this.updateEditCacheBgBn(type);
    }   if (type == 'dvThiCong') {
      this.dataEditDvThiCong[idx].edit = false;
      Object.assign(this.talbeDvThiCong[idx], this.dataEditDvThiCong[idx].data);
      this.updateEditCacheBgBn(type);
    }  if (type == 'dvQuanLy') {
      this.dataEditDvQuanLy[idx].edit = false;
      Object.assign(this.talbeDvQuanLy[idx], this.dataEditDvQuanLy[idx].data);
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
          if (type == 'chuDauTu') {
            this.talbeChuDauTu.splice(index, 1);
            this.updateEditCacheBgBn(type);
          } else if (type == 'dvSuDung') {
            this.tableDvSuDung.splice(index, 1);
            this.updateEditCacheBgBn(type);
          } else if (type == 'dvGiamSat') {
            this.talbeDvGiamSat.splice(index, 1);
            this.updateEditCacheBgBn(type);
          } else if (type == 'dvThiCong') {
            this.talbeDvThiCong.splice(index, 1);
            this.updateEditCacheBgBn(type);
          } else if (type == 'dvQuanLy') {
            this.talbeDvQuanLy.splice(index, 1);
            this.updateEditCacheBgBn(type);
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async chonHopDong() {
    if (!this.isView) {
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH HỢP ĐỒNG',
        nzContent: DialogMmBbGiaoNhanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listHopDong,
          dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Tên dự án'],
          dataColumn: ['soHd', 'tenHd', 'tenDuAn'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soHopDong: data.soHd,
            tenHopDong: data.tenHd,
            tenDuAn : data.tenDuAn,
            idHopDong : data.id,
            chuDauTu : data.cdtTen
          })
        }
      })
    }
  }

  closeModal() {
    this.modal.closeAll();
  }
}

export class KtDtxdBbNghiemThuDtl {
  chucVu: string;
  hoTen: string;
  id: number = 0;
  ktTdxdBienbanNghiemthuId: number = 0;
  loai: string;
}
