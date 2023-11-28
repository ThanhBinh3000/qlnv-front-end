import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { chain, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  PhieuXuatNhapKhoService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service';
import {
  PhieuKdclVtKtclService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuKdclVtKtcl.service';
import {
  QuyetDinhGiaoNvXuatHangService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service';
import {
  BckqKiemDinhMauService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { MESSAGE } from '../../../../../../constants/message';
import { isArray } from 'rxjs/internal-compatibility';
import { Base2Component } from '../../../../../../components/base2/base2.component';
import { CHUC_NANG, STATUS } from '../../../../../../constants/status';
import {
  BckqXuatHangKdmService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/BckqXuatHangKdm.service';
import {
  TongHopDanhSachHangXkdmService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/TongHopDanhSachHangXkdm.service';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { AMOUNT_TWO_DECIMAL } from '../../../../../../Utility/utils';

@Component({
  selector: 'app-thong-tin-bc-ket-qua-xuat-hang-khoi-danh-muc',
  templateUrl: './thong-tin-bc-ket-qua-xuat-hang-khoi-danh-muc.component.html',
  styleUrls: ['./thong-tin-bc-ket-qua-xuat-hang-khoi-danh-muc.component.scss'],
})
export class ThongTinBcKetQuaXuatHangKhoiDanhMucComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  size: NzSelectSizeType = 'default';
  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  checked: boolean = false;
  fileDinhKems: any[] = [];
  listDsTongTop: any[] = [];
  listPhieuXuatKho: any[] = [];
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  itemSelected: any;
  dataTableChiTieu: any[] = [];
  LIST_DANH_GIA: any[] = [
    { value: 0, label: 'Không đạt' },
    { value: 1, label: 'Đạt' },
  ];
  dataPhieuKncl: any;
  amount = AMOUNT_TWO_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private phieuKdclVtKtclService: PhieuKdclVtKtclService,
    private tongHopDanhSachHangXkdmService: TongHopDanhSachHangXkdmService,
    private bckqXuatHangKdmService: BckqXuatHangKdmService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bckqXuatHangKdmService);
    this.formData = this.fb.group({
      tenDvi: [null, [Validators.required]],
      nam: [dayjs().get('year')],
      maDvi: [, [Validators.required]],
      tenTrangThai: ['Đang nhập dữ liệu'],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      maDviNhan: [],
      tenBaoCao: [null, [Validators.required]],
      soBaoCao: [null, [Validators.required]],
      idDsTh: [null, [Validators.required]],
      maDsTh: [null, [Validators.required]],
      ngayBaoCao: [null, [Validators.required]],
      xhXkThXuatHangKdmDtl: [new Array()],
    });
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDsTongHop(),
      ]);
      await this.loadDetail(this.idInput);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsTongHop() {
    let body = {
      dvql: this.userInfo.MA_DVI,
    };
    let res = await this.tongHopDanhSachHangXkdmService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDsTongTop = this.idInput > 0 ? data.content : data.content.filter(item => !item.soBaoCaoKdm);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bckqXuatHangKdmService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.children = cloneDeep(res.data.xhXkThXuatHangKdmDtl);
            this.buildTableView(this.children);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.DANG_NHAP_DU_LIEU) {
      return true;
    }
    return false;
  }

  async changeValueMaDsTongHop(event) {
    try {
      this.children = [];
      this.spinner.show();
      if (event && event.length > 0) {
        let dsThItem = this.listDsTongTop.find(it => it.maDanhSach == event);
        if (dsThItem) {
          dsThItem.tongHopDtl.map(obj => ({ ...obj, tongHopHdr: dsThItem }));
          this.children = cloneDeep(dsThItem.tongHopDtl);
        }
        this.formData.patchValue({
          idDsTh: dsThItem.id,
        });
        this.buildTableView(this.children);
      } else {
        // this.listPhieuXuatKho = [];
        this.buildTableView();
        this.formData.patchValue({
          idDsTh: null,
        });
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async buildTableView(data?: any) {
    this.children = chain(data)
      .groupBy('tenChiCuc')
      .map((v, k) => {
          let rowItem = v.find(s => s.tenChiCuc === k);
          let idVirtual = uuidv4();
          this.expandSetString.add(idVirtual);
          return {
            idVirtual: idVirtual,
            tenChiCuc: k,
            tenCuc: rowItem?.tenCuc,
            maDiaDiem: rowItem?.maDiaDiem,
            tenCloaiVthh: rowItem?.tenCloaiVthh,
            childData: v,
          };
        },
      ).value();
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    if (this.fileDinhKems && this.fileDinhKems.length > 0) {
      body.fileDinhKems = this.fileDinhKems;
    }
    body.xhXkThXuatHangKdmDtl = this.children && this.children.length > 0 ? this.conVertTreeToList(this.children) : [];
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }

  conVertTreeToList(data) {
    let arr = [];
    data.forEach(item => {
      if (item.childData && item.childData.length > 0) {
        item.childData.forEach(data => {
          arr.push(data);
        });
      } else {
        arr.push(item);
      }
    });
    return arr;
  }

  pheDuyet() {
    let trangThai = STATUS.HOAN_THANH_CAP_NHAT;
    let msg = 'Bạn có muốn hoàn thành cập nhât?';
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai);
  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

}
