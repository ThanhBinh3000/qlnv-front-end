import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinTongHopDeXuatLCNT } from 'src/app/models/ThongTinTongHopDeXuatLCNT';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';

@Component({
  selector: 'app-themmoi-tonghop-khmtt',
  templateUrl: './themmoi-tonghop-khmtt.component.html',
  styleUrls: ['./themmoi-tonghop-khmtt.component.scss']
})
export class ThemmoiTonghopKhmttComponent implements OnInit {
  @Input() loaiVthh: string
  @Input() id: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  formTraCuu: FormGroup;
  formData: FormGroup;
  isDetailDxCuc: boolean = false;
  dataTableDanhSachDX: any[] = [];
  danhMucDonVi: any;
  isTongHop: boolean = false;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  i = 0;
  editId: string | null = null;
  // loaiVTHH: number = 0;
  chiTiet: ThongTinTongHopDeXuatLCNT = new ThongTinTongHopDeXuatLCNT();
  listNam: any[] = [];
  yearNow: number = 0;
  idDeXuat: number = 0;
  listVthh: any[] = [];
  idPA: number = 0;
  selectedId: number = 0;
  errorInputRequired: string = null;
  isQuyetDinh: boolean = false;
  STATUS = STATUS;
  userInfo: UserLogin;
  dataDeXuat: any[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};
  chiTieuKeHoachNamCapTongCucService: any;

  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
    private userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    public globals: Globals,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
  ) {
    this.formTraCuu = this.fb.group(
      {
        namKh: [dayjs().get('year'), [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
      }
    );
    this.formData = this.fb.group({
      id: [],
      ngayThop: [''],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [''],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [''],
      namKh: [, [Validators.required]],
      noiDung: ['', [Validators.required]],
      trangThai: [''],
      ngayTao: [, [Validators.required]],
      ghiChu: ['',],
      tchuanCluong: [''],
      soQd: [''],

    })

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      await Promise.all([
        this.loadChiTiet(),
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDeXuatKHMTTService.getDetail(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.dataTableDanhSachDX = dataDetail.hhDxKhMttThopDtls;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, dataDetail)
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
        this.isTongHop = true;
      }
      else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }


  async tongHopDeXuatTuCuc() {
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formTraCuu.value;
      let res = await this.tongHopDeXuatKHMTTService.tonghop(body);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data
        let idTh = await this.userService.getId("HH_DX_KHMTT_THOP_HDR_SEQ");
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail)
        this.formData.patchValue({
          id: idTh,
          ngayTao: dayjs().format("YYYY-MM-DD"),
        })
        this.dataTableDanhSachDX = dataDetail.hhDxKhMttThopDtls;
        this.isTongHop = true;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.isTongHop = false;
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.isTongHop = false;
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_THEM") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_TONGHOP")) {
      return true;
    }
    return false;
  }

  async save() {
    // if (!this.isDetailPermission()) {
    //   return;
    // }
    this.helperService.markFormGroupTouched(this.formData);
    await this.spinner.show();
    try {
      // if (this.formData.invalid) {
      //   await this.spinner.hide();
      //   return;
      // }
      let body = this.formData.value;
      let res = await this.tongHopDeXuatKHMTTService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.id = res.data.id;
        await this.loadChiTiet();
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  showList() {
    this.isDetailDxCuc = false;
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.formTraCuu.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenLoaiVthh: data.parent.ten,
        });
      }
    });
  }

  taoQdinh() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }

  showTongHop() {
    this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
  }

  idRowSelect: number;
  async showDetail($event, id: number) {
    await this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idRowSelect = id;
    await this.spinner.hide();
  }
}



