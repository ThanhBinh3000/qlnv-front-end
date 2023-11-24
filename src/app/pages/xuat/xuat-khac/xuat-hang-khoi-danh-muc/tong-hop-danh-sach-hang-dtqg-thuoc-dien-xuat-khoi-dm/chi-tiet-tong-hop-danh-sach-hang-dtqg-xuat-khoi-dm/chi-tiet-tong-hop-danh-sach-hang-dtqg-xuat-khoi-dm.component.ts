import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Base2Component } from '../../../../../../components/base2/base2.component';
import { NumberToRoman } from '../../../../../../shared/commonFunction';
import {
  VtTbCoThoihanLuukhoConSauThangComponent,
} from '../../../kiemtra-chatluong-vt-tb-truockhi-hethan-luukho/vt-tb-co-thoihan-luukho-con-sau-thang/vt-tb-co-thoihan-luukho-con-sau-thang.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from '../../../../../../services/donvi.service';
import { DanhMucService } from '../../../../../../services/danhmuc.service';
import { chain, cloneDeep, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { LOAI_HH_XUAT_KHAC } from '../../../../../../constants/config';
import { MESSAGE } from '../../../../../../constants/message';
import {
  TongHopDanhSachHangXkdmService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/TongHopDanhSachHangXkdm.service';
import {
  DanhSachHangDtqgService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/DanhSachHangDtqg.service';
import { CHUC_NANG, STATUS } from '../../../../../../constants/status';
import {
  QuyetDinhXuatHangKhoiDmService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/QuyetDinhXuatHangKhoiDm.service';
import { MangLuoiKhoService } from '../../../../../../services/qlnv-kho/mangLuoiKho.service';

@Component({
  selector: 'app-chi-tiet-tong-hop-danh-sach-hang-dtqg-xuat-khoi-dm',
  templateUrl: './chi-tiet-tong-hop-danh-sach-hang-dtqg-xuat-khoi-dm.component.html',
  styleUrls: ['./chi-tiet-tong-hop-danh-sach-hang-dtqg-xuat-khoi-dm.component.scss'],
})
export class ChiTietTongHopDanhSachHangDtqgXuatKhoiDmComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() selectedItem: any = {};
  @Input() isView: boolean;
  @Input() eventOk: boolean;
  @Input() eventCancel: boolean;
  @Output()
  isViewOnModal = new EventEmitter<any>();
  @Output()
  step = new EventEmitter<any>();
  @Output()
  changeShow = new EventEmitter<any>();
  showDetail = false;
  isFirstInit = true;
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  listQdXuatHangKdm: any = [];
  dataTh: any[] = [];
  expandSetString = new Set<string>();
  numberToRoman = NumberToRoman;
  maHauTo: any;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopDanhSachHangXkdmService: TongHopDanhSachHangXkdmService,
              private quyetDinhXuatHangKhoiDmService: QuyetDinhXuatHangKhoiDmService,
              private mangLuoiKhoService: MangLuoiKhoService,
              private danhSachHangDtqgService: DanhSachHangDtqgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDanhSachHangXkdmService);
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year')],
      maDvi: [],
      maDanhSach: [],
      tenDanhSach: [, [Validators.required]],
      trangThai: [],
      ngayTao: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      lyDoTuChoi: [],
      tongSlHienTai: [],
      tenTrangThai: [],
      tenDvi: [],
      tenCuc: [],
      capTh: [this.userInfo.CAP_DVI],
      soQdXhKdm: [],
      idQdXhKdm: [],
      tongHopDtl: [new Array()],
    });
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = 'DSLK6';
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await this.loadListQdXuathangKdm();
      await this.loadDetail(this.idInput);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.isFirstInit = false;
      await this.spinner.hide();
    }
  }

  async loadDetail(idInput: any) {
    if (idInput > 0) {
      await this.tongHopDanhSachHangXkdmService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.selectedItem = res.data;
            this.formData.patchValue(res.data);
            this.formData.value.tongHopDtl.forEach(s => {
              s.idVirtual = uuidv4();
              this.expandSetString.add(s.idVirtual);
            });
            await this.buildTableView(this.formData.value.tongHopDtl);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async timKiem() {
    await this.search();
    this.dataTable.forEach(s => {
      s.idVirtual = uuidv4();
      this.expandSetString.add(s.idVirtual);
    });
    await this.buildTableView();
  }

  async loadDsDonVi() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      if (this.userService.isTongCuc()) {
        this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
      } else {
        this.dsDonvi = dsTong.data.filter(s => s.type === 'PB');
      }
    }
  }

  async loadListQdXuathangKdm() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
    };
    this.listQdXuatHangKdm = [];
    const res = await this.quyetDinhXuatHangKhoiDmService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdXuatHangKdm = res.data.content;
      console.log(this.listQdXuatHangKdm, 'this.listQdXuatHangKdm this.listQdXuatHangKdm ');
    }
  }

  changeSoQdXhKdm() {
    if (this.formData.get('idQdXhKdm').value) {
      let itemQd = this.listQdXuatHangKdm.find(it => it.id == this.formData.get('idQdXhKdm').value);
      if (itemQd) {
        this.formData.patchValue({
          soQdXhKdm: itemQd.soQd,
        });
      }
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiVthh = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match('^01.*')) || (x.ma.length == 4 && x.ma.match('^01.*')));
    }
  }

  async changeHangHoa(event: any) {
    this.formData.patchValue({ cloaiVthh: null });
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

  async buildTableView(data?: any) {
    this.selectedItem.childData = chain(data)
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

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  handleCancel() {

  }

  handleOk() {

  }

  async tongHopDanhSach() {
    try {
      await this.spinner.show();
      this.dataTh = [];
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
        return;
      } else {
        let idQdXhKdm = this.formData.get('idQdXhKdm').value;
        await this.quyetDinhXuatHangKhoiDmService.getDetail(idQdXhKdm).then(async res => {
          if (res.msg == MESSAGE.SUCCESS) {
            console.log(res.data,'aaaaa');
            if (!res.data || res.data.listDtl.length <= 0) {
              this.notification.warning(MESSAGE.ALERT, 'Không tìm thấy quyết định xuất hàng khỏi danh mục');
            } else {
              let listCLoaiVthh = [];
              res.data.listDtl.forEach(item => {
                if (item.children && item.children.length > 0) {
                  item.children.forEach(child => {
                    child.loaiHinhXuat = item.loaiHinhXuat;
                  });
                }
                this.dataTh = [...this.dataTh, ...item.children];
                listCLoaiVthh.push(item.ma);
              });
              console.log(this.dataTh,' this.dataTh this.dataTh this.dataTh this.dataTh');
              let listLoaiHinhXuatByCLoaiVthh = this.dataTh.map(({ ma, loaiHinhXuat }) => ({ ma, loaiHinhXuat }));
              let listDtl = [];

              let body = {
                // listCloaiVthh: ['010102', '021102', '021302', '020301'],
                // maDvi: '010102',
                listCloaiVthh : listCLoaiVthh,
                maDvi: this.userInfo.MA_DVI,
              };
              let resp = await this.mangLuoiKhoService.dsNganLoKhoTheoCloaiVthh(body);
              if (resp.msg == MESSAGE.SUCCESS) {
                if (resp.data && resp.data.length > 0) {
                  resp.data.forEach(s => {
                    let itemHh = listLoaiHinhXuatByCLoaiVthh.find(it => it.ma == s.cloaiVthh);
                    let itemDtl = {
                      loaiVthh: s.loaiVthh,
                      cloaiVthh: s.cloaiVthh,
                      slTonKho: s.slTon,
                      loaiHinhXuat: itemHh ? itemHh.loaiHinhXuat : null,
                      maDiaDiem: s.maDvi,
                      donViTinh: s.donViTinh,
                    };
                    listDtl.push(itemDtl);
                  });
                } else {
                  this.notification.warning(MESSAGE.WARNING, 'Cục DTNN KV không dự trữ hàng hóa có trong quyết định xuất hàng khỏi danh mục.');
                  return;
                }
              } else {
                this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
              }
              this.formData.patchValue({
                maDanhSach: this.selectedItem ?? this.maHauTo,
                tongHopDtl: (listDtl && listDtl.length) > 0 ? listDtl : [],
              });
              let result = await this.createUpdate(this.formData.value);
              if (result) {
                this.selectedItem = cloneDeep(result);
                await this.buildTableView(result.tongHopDtl);
                this.step.emit({ step: 2, item: this.selectedItem });
              }
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  convertTreeToList(data) {
    if (data && data.length > 0) {
      this.dataTh = [];
      this.dataTable.forEach(item => {
        this.dataTh.push(item);
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            this.dataTh.push(child);
          });
        }
      });
    }
  }


  @Input() categoryId: string;
  async ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstInit) {
      if (changes.eventOk) {
        //tao moi
        if (!this.selectedItem) {
          await this.tongHopDanhSach();
        }
        //gui duyet
        else {
          this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc muốn gửi duyệt bản tổng hợp này ?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 350,
            nzOnOk: async () => {
              await this.spinner.show();
              try {
                let body = {
                  id: this.selectedItem.id,
                  trangThai: this.STATUS.GUI_DUYET,
                };
                let res = await this.tongHopDanhSachHangXkdmService.approve(body);
                if (res.msg == MESSAGE.SUCCESS) {
                  this.notification.success(MESSAGE.NOTIFICATION, 'Gửi duyệt tổng hợp thành công.');
                  this.step.emit({ step: 1 });
                } else {
                  this.notification.error(MESSAGE.ERROR, res.msg);
                }
              } catch (e) {
                console.log('error: ', e);
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
              } finally {
                await this.spinner.hide();
              }
            },
          });
        }
      }
      if (changes.eventCancel) {
        // this.quayLai();
        this.step.emit({ step: 0 });
        this.changeShow.emit({ showDetail: false, item: this.selectedItem });
      }
    }
  }

  onClickShowDetail() {
    this.showDetail = !this.showDetail,
      this.changeShow.emit({ showDetail: this.showDetail, item: this.selectedItem });
  }
}
