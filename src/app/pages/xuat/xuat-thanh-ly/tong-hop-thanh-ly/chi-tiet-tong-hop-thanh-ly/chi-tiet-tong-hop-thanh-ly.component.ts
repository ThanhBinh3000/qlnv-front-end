import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {XuatThanhLyComponent} from "src/app/pages/xuat/xuat-thanh-ly/xuat-thanh-ly.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from "src/app/components/base2/base2.component";
import {CHUC_NANG} from 'src/app/constants/status';
import {chain, isEmpty} from "lodash";
import {v4 as uuidv4} from "uuid";
import {TongHopThanhLyService} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import {DanhSachThanhLyService} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/DanhSachThanhLy.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-chi-tiet-tong-hop-thanh-ly',
  templateUrl: './chi-tiet-tong-hop-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-tong-hop-thanh-ly.component.scss']
})
export class ChiTietTongHopThanhLyComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() eventOk: boolean;
  @Input() eventCancel: boolean;
  @Output()
  isViewOnModal = new EventEmitter<any>();

  isFirstInit = true;
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  expandSetString = new Set<string>();
  stepModal: any = '50%';
  isVisibleModal = false;
  maHauTo: any;
  public vldTrangThai: XuatThanhLyComponent;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopThanhLyService: TongHopThanhLyService,
              private danhSachThanhLyService: DanhSachThanhLyService,
              private xuatThanhLyComponent: XuatThanhLyComponent,
              private cdr: ChangeDetectorRef) {
    super(httpClient, storageService, notification, spinner, modal, tongHopThanhLyService);
    this.vldTrangThai = xuatThanhLyComponent;
    this.formData = this.fb.group({
      id: [0],
      nam: [dayjs().get('year')],
      maDvi: [],
      maDanhSach: [],
      tenDanhSach: [],
      thoiGianTl: [],
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
      ngayTao:[],
      lyDoTuChoi: [],
      tongSlHienTai: [],
      tongSlDeXuat: [],
      tongSlDaDuyet: [],
      tenTrangThai: [],
      tenDvi: [],
      tongHopDtl: [new Array()]
    })
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = '/HTL-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
      await this.loadDetail(this.idInput);
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.isFirstInit = false;
      await this.spinner.hide();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.tongHopThanhLyService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.maDanhSach.split("/")[1];
            res.data.maDanhSach = res.data.maDanhSach.split("/")[0];
            this.formData.patchValue(res.data);
            this.formData.value.tongHopDtl.forEach(s => {
              s.idVirtual = uuidv4();
              this.expandSetString.add(s.idVirtual);
            });
            this.buildTableView();
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
    this.buildTableView();
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

  buildTableView() {
    this.dataTableView = chain(this.dataTable)
      .groupBy("tenCuc")
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
                maDiaDiem: rowItem.maDiaDiem,
                tenCloaiVthh: rowItem.tenCloaiVthh,
                childData: v
              }
            }
          ).value();
        let rowItem = value.find(s => s.tenChiCuc === key);
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenCuc: key,
          childData: rs
        };
      }).value();
    console.log(this.dataTableView, 'dataTableView')
    console.log(this.expandSetString)
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
    console.log(this.expandSetString)
  }

  handleCancel() {

  }

  handleOk() {

  }

  async tongHopDanhSach() {
    try {
      await this.spinner.show();
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
        return;
      } else {
        await this.danhSachThanhLyService.search({}).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.content.forEach(s => s.id = null);
            this.formData.patchValue({
              maDanhSach: this.idInput > 0 ? this.idInput + this.maHauTo : this.maHauTo,
              tongHopDtl: res.data.content
            });
            this.createUpdate(this.formData.value);
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

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstInit) {
      console.log(changes);
      if (changes.eventOk) {
        this.tongHopDanhSach();
      }
      if (changes.eventCancel) {
        // this.quayLai();
        this.isViewOnModal.emit(false);
      }
    }

  }

  chonNgayXuatThanhLy($event: any) {
    if ($event) {
      this.formData.patchValue({
        thoiGianTlTu: dayjs($event[0]).format('YYYY-MM-DD'),
        thoiGianTlDen: dayjs($event[1]).format('YYYY-MM-DD')
      })
    }

  }
}
