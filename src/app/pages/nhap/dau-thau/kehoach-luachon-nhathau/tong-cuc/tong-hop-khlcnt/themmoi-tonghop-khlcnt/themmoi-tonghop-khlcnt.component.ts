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
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-themmoi-tonghop-khlcnt',
  templateUrl: './themmoi-tonghop-khlcnt.component.html',
  styleUrls: ['./themmoi-tonghop-khlcnt.component.scss']
})
export class ThemmoiTonghopKhlcntComponent implements OnInit {

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
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVthh: any[] = [];
  idPA: number = 0;
  selectedId: number = 0;
  errorInputRequired: string = null;
  isQuyetDinh: boolean = false;
  STATUS = STATUS;
  userInfo: UserLogin;
  dataDeXuat: any[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    public globals: Globals
  ) {
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        hthucLcnt: ['', [Validators.required]],
        pthucLcnt: ['', [Validators.required]],
        loaiHdong: ['', [Validators.required]],
        nguonVon: ['', [Validators.required]],
      }
    );
    this.formData = this.fb.group({
      id: [],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      namKhoach: [, [Validators.required]],
      ngayTao: [, [Validators.required]],
      noiDung: ['', [Validators.required]],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      ghiChu: ['',],
      trangThai: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tchuanCluong: [''],
      soQd : [''],
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
        this.loadDataComboBox(),
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
      let res = await this.tongHopDeXuatKHLCNTService.loadChiTiet(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
        this.helperService.bidingDataInFormGroup(this.formTraCuu,dataDetail)
        this.helperService.bidingDataInFormGroup(this.formData,dataDetail);
        this.isTongHop = true;
      }
      else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDataComboBox(){
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
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
      let res = await this.tongHopDeXuatKHLCNTService.deXuatCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data
        let idTh = await this.userService.getId("HH_DX_KHLCNT_THOP_HDR_SEQ");
        this.helperService.bidingDataInFormGroup(this.formData,dataDetail)
        this.formData.patchValue({
          id : idTh,
          ngayTao: dayjs().format("YYYY-MM-DD"),
        })
        this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
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
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_TONGHOP")) {
      return true;
    }
    return false;
  }

  async save() {
    if (!this.isDetailPermission()) {
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    await this.spinner.show();
    try {
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      let res = await this.tongHopDeXuatKHLCNTService.create(body);
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
    // let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
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

  idRowSelect : number;
  async showDetail($event, id: number) {
    await this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idRowSelect = id;
    await this.spinner.hide();
  }
}



