import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {NumberToRoman} from "../../../../../../shared/commonFunction";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {chain, cloneDeep, isEmpty} from "lodash";
import {v4 as uuidv4} from "uuid";
import {Validators} from "@angular/forms";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";
import {MESSAGE} from "../../../../../../constants/message";
import {CHUC_NANG, STATUS} from "../../../../../../constants/status";
import {
  DanhSachHangDtqgService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/DanhSachHangDtqg.service";
import {FileDinhKem} from "../../../../../../models/CuuTro";

@Component({
  selector: 'app-cap-nhat-danh-sach-hang-dtqg-theo-chi-dao-cp',
  templateUrl: './cap-nhat-danh-sach-hang-dtqg-theo-chi-dao-cp.component.html',
  styleUrls: ['./cap-nhat-danh-sach-hang-dtqg-theo-chi-dao-cp.component.scss']
})
export class CapNhatDanhSachHangDtqgTheoChiDaoCpComponent extends Base2Component implements OnInit {

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
              private danhSachHangDtqgService: DanhSachHangDtqgService,
              private cdr: ChangeDetectorRef) {
    super(httpClient, storageService, notification, spinner, modal, danhSachHangDtqgService);
    this.formData = this.fb.group({
      id: [null],
      maDanhSach: [],
      tenDanhSach: [, [Validators.required]],
      trangThai: [],
      ngayTao: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      lyDoTuChoi: [],
      tenTrangThai: [],
      loai: [0],
      soQd: [],
      fileDinhKems: [new Array<FileDinhKem>()],
      xhXkDsHangDtqgDtl: [new Array()]
    })
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = 'DSHDTQG';
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await this.loadDetail(this.idInput);
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
      await this.danhSachHangDtqgService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.selectedItem = res.data;
            this.formData.patchValue(res.data);
            this.dataTable = this.selectedItem.xhXkDsHangDtqgDtl;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      if (this.selectedItem && this.selectedItem.xhXkDsHangDtqgDtl) {
        this.dataTable = this.selectedItem.xhXkDsHangDtqgDtl;
      }
    }
  }

  async timKiem() {
    await this.search();
    // this.dataTable.forEach(s => {
    //   s.idVirtual = uuidv4();
    //   this.expandSetString.add(s.idVirtual);
    // });
    // await this.buildTableView();
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

  async capNhatDanhSach() {
    try {
      await this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
        return;
      } else {
        this.formData.patchValue({
          maDanhSach: this.selectedItem ?? this.maHauTo,
        });
        let result = await this.createUpdate(this.formData.value);
        if (result) {
          this.selectedItem = cloneDeep(result);
          await this.buildTableView(result.tongHopDtl);
          this.step.emit({step: 2, item: this.selectedItem});
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstInit) {
      if (changes.eventOk) {
        //tao moi
        if (!this.selectedItem) {
          await this.capNhatDanhSach();
        }
        //gui duyet
        else {
          this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc muốn gửi duyệt bản danh sách này ?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 350,
            nzOnOk: async () => {
              await this.spinner.show();
              try {
                let trangThai = this.STATUS.CHO_DUYET_LDV;
                switch (this.selectedItem.trangThai) {
                  case STATUS.DU_THAO: {
                    trangThai = this.STATUS.CHO_DUYET_LDV;
                    break;
                  }
                  case STATUS.CHO_DUYET_LDV: {
                    trangThai = this.STATUS.DA_DUYET_LDV;
                    break;
                  }
                }
                let body = {
                  id: this.selectedItem.id,
                  trangThai: trangThai,
                }
                let res = await this.danhSachHangDtqgService.approve(body);
                if (res.msg == MESSAGE.SUCCESS) {
                  this.notification.success(MESSAGE.NOTIFICATION, 'Gửi duyệt danh sách thành công.');
                  this.step.emit({step: 1});
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
        this.step.emit({step: 0});
        this.changeShow.emit({showDetail: false, item: this.selectedItem})
      }
    }
  }

  onClickShowDetail() {
    this.showDetail = !this.showDetail,
      this.changeShow.emit({showDetail: this.showDetail, item: this.selectedItem})
  }
}
