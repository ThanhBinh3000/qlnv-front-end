import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Base2Component} from "../../../../../../components/base2/base2.component";
import {FormGroup} from "@angular/forms";
import {NumberToRoman} from "../../../../../../shared/commonFunction";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {chain, isEmpty} from "lodash";
import {v4 as uuidv4} from "uuid";
import {
  TongHopDanhSachHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service";
import {MESSAGE} from "../../../../../../constants/message";
import {CHUC_NANG} from "../../../../../../constants/status";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";
import {
  TongHopDanhSachVttbService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service";
import {DANH_MUC_LEVEL} from "../../../../../luu-kho/luu-kho.constant";

@Component({
  selector: 'app-tong-hop-danh-sach-vt12th',
  templateUrl: './tong-hop-danh-sach-vt12th.component.html',
  styleUrls: ['./tong-hop-danh-sach-vt12th.component.scss']
})
export class TongHopDanhSachVt12thComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  expandSetString = new Set<string>();
  isVisibleModal = false;
  formDataDetail: FormGroup;
  clickOk = false;
  flatDataTable: any;
  numberToRoman = NumberToRoman;
  selectedItem: any;
  modalWidth: any;
  @Input() openModal: boolean;
  step: any = 1;
  DanhSach: boolean = false;
  showDetail: boolean;
  @Output() tabFocus = new EventEmitter<number>();
  listChiCuc: any[];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private tongHopDanhSachVttbService: TongHopDanhSachVttbService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDanhSachVttbService);
    this.formData = this.fb.group({
      nam: [],
      maDanhSach: [],
      maCuc: [],
      maChiCuc: [],
      ngayTao: [],
      ngayTaoTu: [],
      ngayTaoDen: [],
      loai: [LOAI_HH_XUAT_KHAC.VT_12_THANG],
    })
    this.formDataDetail = this.fb.group({
      id: [],
      nam: [],
      maDvi: [],
      maDanhSach: [],
      thoiGianTlTu: [],
      thoiGianTlDen: [],
      trangThai: [],
      idHoSo: [],
      soHoSo: [],
      idQdPd: [],
      soQdPd: [],
      ngayKyQd: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      lyDoTuChoi: [],
      tongSlHienTai: [],
      tongSlDeXuat: [],
      tongSlDaDuyet: [],
      tenTrangThai: [],
      tenDvi: [],
      capTh: [this.userInfo.CAP_DVI],
      loai: [LOAI_HH_XUAT_KHAC.VT_12_THANG],
      tongHopDtl: [new Array()]
    })
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      this.emitTab(1);
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
      await this.timKiem();
      if (this.openModal) {
        await this.showModal(true);
      }
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  disabledNgayTaoTu = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.NgayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.NgayTaoTu.getTime();
  };

  disabledNgayTaoDen = (startValue: Date): boolean => {
    if (startValue && this.formData.value.NgayTaoDen) {
      return startValue.getTime() > this.formData.value.NgayTaoDen.getTime();
    }
    return false;
  };


  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.tongHopDtl ? this.flattenTree(item.tongHopDtl) : item;
    });
  }

  async timKiem() {
    await this.search();
    this.flatDataTable = this.dataTable.flatMap(s => {
      if (s.tongHopDtl && s.tongHopDtl.length > 0) {
        return s.tongHopDtl.map(s1 => {
          delete s.tongHopDtl;
          s.idVirtual = uuidv4();
          s.header = s.nam + s.maDanhSach + s.tenDanhSach;
          this.expandSetString.add(s.idVirtual);
          return Object.assign(s1, s);
        })
      } else return s;

    });
    this.buildTableView();
  }

  async loadDsDonVi() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
      /* if (this.userService.isTongCuc()) {
         this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
       } else {
         this.dsDonvi = dsTong.data.filter(s => s.type === 'PB');
       }*/
    }
    if (!this.userService.isTongCuc()) {
      this.loadDsChiCuc();
    }
  }

  async loadDsChiCuc() {
    const body = {
      maDviCha: this.userService.isTongCuc() ? this.formData.value.maCuc : this.userInfo.MA_DVI,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    this.listChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.listChiCuc = this.listChiCuc.filter(item => item.type === 'DV')
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiVthh = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
    }
  }

  async changeHangHoa(event: any) {
    this.formData.patchValue({cloaiVthh: null})
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dsCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  buildTableView() {
    this.dataTableView = chain(this.flatDataTable)
      .groupBy("header")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenChiCuc")
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
                childData: v
              }
            }
          ).value();
        let rowItem = value.find(s => s.header === key);
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          id: rowItem.id,
          nam: rowItem.nam,
          tenCuc: rowItem.tenCuc,
          maDanhSach: rowItem.maDanhSach,
          tenDanhSach: rowItem.tenDanhSach,
          trangThai: rowItem.trangThai,
          tenTrangThai: rowItem.tenTrangThai,
          ngayTao: rowItem.ngayTao,
          childData: rs
        };
      }).value();
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  handleOk() {
    this.clickOk = !this.clickOk;
  }

  exportExcel() {
    if (this.selectedItem) {
      console.log(this.selectedItem, 'this.selectedItemthis.selectedItem')
      this.formData.patchValue({
        maDanhSach: this.selectedItem.maDanhSach
      });
      this.exportData("danh-sach-vat-tu-thiet-bi-co-thoi-han-luu-kho-lon-hon-12-thang.xlsx");
    }
  }

  handleCancel() {
    this.showModal(false);
  }

  showModal(isVisibleModal: boolean, item?: any, showDetail?: boolean) {
    this.isVisibleModal = isVisibleModal;
    this.selectedItem = item;
    this.modalWidth = showDetail ? '80vw' : (item ? '40vw' : '40vw');
    this.emitTab(1);
  }

  async changeStep($event: any) {
    //0=dong 1=guiduyet 2=luu(chuyen tiep sang trang2)
    if ($event.step == 0 || $event.step == 1) {
      this.showModal(false);
    } else if ($event.step == 2) {
      this.showModal(true, $event.item);
    }
    this.timKiem();
  }

  async changeShowDetail($event: any) {
    this.showModal(true, $event.item, $event.showDetail);
  }

  async delete(item: any, roles?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.tongHopDanhSachVttbService.delete(body).then(async () => {
            await this.timKiem();
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          });
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }

  danhSach() {
    this.DanhSach = true;
    this.emitTab(0)
  }

}
