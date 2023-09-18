import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { chain, cloneDeep, isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { NumberToRoman } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { TongHopTieuHuyService } from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/TongHopTieuHuy.service";
import { XuatTieuHuyComponent } from "../../xuat-tieu-huy.component";
import {
  DanhSachTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/DanhSachTieuHuy.service";
import { FileDinhKem } from "../../../../../models/FileDinhKem";

@Component({
  selector: 'app-chi-tiet-tong-hop-tieu-huy',
  templateUrl: './chi-tiet-tong-hop-tieu-huy.component.html',
  styleUrls: ['./chi-tiet-tong-hop-tieu-huy.component.scss']
})
export class ChiTietTongHopTieuHuyComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() selectedItem: any = {};
  @Input() isView: boolean;
  @Input() eventOk: boolean;
  @Input() eventCancel: boolean;
  @Output()
  isViewOnModal = new EventEmitter<any>();
  @Output()
  step = new EventEmitter<any>();

  isFirstInit = true;
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  expandSetString = new Set<string>();
  numberToRoman = NumberToRoman;
  maHauTo: any;
  public vldTrangThai: XuatTieuHuyComponent;

  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private tongHopTieuHuyService: TongHopTieuHuyService,
    private danhSachTieuHuyService: DanhSachTieuHuyService,
    private xuatTieuHuyComponent: XuatTieuHuyComponent,
    private cdr: ChangeDetectorRef) {
    super(httpClient, storageService, notification, spinner, modal, tongHopTieuHuyService);
    this.vldTrangThai = xuatTieuHuyComponent;
    this.formData = this.fb.group({
      id: [0],
      nam: [dayjs().get('year')],
      maDvi: [],
      maDanhSach: [],
      tenDanhSach: [, [Validators.required]],
      thoiGianTl: [, [Validators.required]],
      thoiGianTlTu: [, [Validators.required]],
      thoiGianTlDen: [, [Validators.required]],
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
      ngayTao: [],
      lyDoTuChoi: [],
      tongSlHienTai: [],
      tongSlDeXuat: [],
      tongSlDaDuyet: [],
      tenTrangThai: [],
      tenDvi: [],
      tenCuc: [],
      tongHopDtl: [new Array()],
      fileDinhKems: [new Array<FileDinhKem>()],
    })
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = '/HTL-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      /*   await Promise.all([
           this.loadDsDonVi(),
           this.loadDsVthh()
         ]);*/
      // this.formData.patchValue(this.selectedItem)
      // await this.loadDetail(this.selectedItem);
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.isFirstInit = false;
      await this.spinner.hide();
    }
  }

  async loadDetail(idInput: any) {
    if (idInput > 0) {
      await this.tongHopTieuHuyService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.maDanhSach.split("/")[1];
            res.data.maDanhSach = res.data.maDanhSach.split("/")[0];
            this.formData.patchValue(res.data);
            this.formData.value.tongHopDtl.forEach(s => {
              s.idVirtual = uuidv4();
              this.expandSetString.add(s.idVirtual);
            });
            await this.buildTableView();
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
    /*    if (this.formData.value.ngayDx) {
          this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
          this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
        }
        if (this.formData.value.ngayKetThuc) {
          this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
          this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
        }*/
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

  async buildTableView(data?: any) {
    this.selectedItem.childData = chain(data)
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
    console.log(data, 'raw');
    console.log(this.selectedItem, 'view');
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
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
        return;
      } else {
        await this.danhSachTieuHuyService.search({
          type: 'TH',
          ngayDeXuatTu: this.formData.value.thoiGianTlTu,
          ngayDeXuatDen: this.formData.value.thoiGianTlDen
        }).then(async res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.numberOfElements == 0) {
              this.notification.warning(MESSAGE.ALERT, 'Không tìm thấy hàng hóa cần thanh lý trong danh sách.');
            } else {
              res.data.content.forEach(s => {
                s.idDsHdr = cloneDeep(s.id);
                s.id = null;
              });
              this.formData.patchValue({
                maDanhSach: this.selectedItem ?? this.maHauTo,
                tongHopDtl: res.data.content
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
        })
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      console.log(e);
    } finally {
      await this.spinner.hide();
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
                }
                let res = await this.tongHopTieuHuyService.approve(body);
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
      }
    }

  }

  chonNgayXuatTieuHuy($event: any) {
    if ($event) {
      this.formData.patchValue({
        thoiGianTlTu: dayjs($event[0]).format('YYYY-MM-DD'),
        thoiGianTlDen: dayjs($event[1]).format('YYYY-MM-DD')
      })
    }

  }
}
