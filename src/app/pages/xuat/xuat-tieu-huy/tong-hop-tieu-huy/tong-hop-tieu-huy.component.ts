import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";
import { CHUC_NANG } from 'src/app/constants/status';
import { chain, isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { FormGroup } from "@angular/forms";
import { NumberToRoman } from 'src/app/shared/commonFunction';
import { XuatTieuHuyComponent } from "../xuat-tieu-huy.component";
import { DanhSachTieuHuyService } from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/DanhSachTieuHuy.service";
import { TongHopTieuHuyService } from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/TongHopTieuHuy.service";

@Component({
  selector: 'app-tong-hop-tieu-huy',
  templateUrl: './tong-hop-tieu-huy.component.html',
  styleUrls: ['./tong-hop-tieu-huy.component.scss']
})
export class TongHopTieuHuyComponent extends Base2Component implements OnInit {

  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  expandSetString = new Set<string>();
  stepModal: any = '50%';
  isVisibleModal = false;
  formDataDetail: FormGroup;
  public vldTrangThai: XuatTieuHuyComponent;
  clickOk = false;
  clickCancel = false;
  flatDataTable: any;
  numberToRoman = NumberToRoman;
  selectedItem: any;
  modalWidth: any;
  step: any = 1;
  DanhSach: boolean = false;
  @Output() tabFocus = new EventEmitter<number>();
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private tongHopTieuHuyService: TongHopTieuHuyService,
    private danhSachTieuHuyService: DanhSachTieuHuyService,
    private xuatTieuHuyComponent: XuatTieuHuyComponent) {
    super(httpClient, storageService, notification, spinner, modal, tongHopTieuHuyService);
    this.vldTrangThai = xuatTieuHuyComponent;
    this.formData = this.fb.group({
      nam: [],
      maDanhSach: [],
      maCuc: [],
      maChiCuc: [],
      ngayTao: [],
      ngayTaoTu: [],
      ngayTaoDen: [],
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
      tongHopDtl: [new Array()]
    })
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
      await this.timKiem();
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
    /*    if (this.formData.value.ngayDx) {
          this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
          this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
        }
        if (this.formData.value.ngayKetThuc) {
          this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
          this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
        }*/
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
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiVthh = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
    }
  }

  async changeHangHoa(event: any) {
    this.formData.patchValue({ cloaiVthh: null })
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
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

  handleCancel() {
    this.showModal(false);
  }

  showModal(isVisibleModal: boolean, item?: any) {
    this.isVisibleModal = isVisibleModal;
    this.selectedItem = item;
    this.modalWidth = item ? '100vw' : '30vw';
    // this.step = item ? '1' : '2';
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
          this.tongHopTieuHuyService.delete(body).then(async () => {
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
