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
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/tong-hop-de-xuat-ke-hoach-ban-dau-gia.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-them-moi-tong-hop-ke-hoach-ban-dau-gia',
  templateUrl: './them-moi-tong-hop-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-moi-tong-hop-ke-hoach-ban-dau-gia.component.scss']
})

export class ThemMoiTongHopKeHoachBanDauGiaComponent implements OnInit {
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
  datePipe = new DatePipe('en-US');
  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    private userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    public globals: Globals,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService
  ) {

    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        namKh: [dayjs().get('year'), [Validators.required]],
        ngayPduyet: [null, [Validators.required]],
      }
    );

    this.formData = this.fb.group({
      cloaiVthh: [, [Validators.required]],
      id: [],
      loaiVthh: [, [Validators.required]],
      namKh: [, [Validators.required]],
      ngayDuyetTu: [''],
      ngayDuyetDen: [''],
      ngayThop: [, [Validators.required]],
      noiDungThop: ['', [Validators.required]],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      trangThai: [''],
      soQdPd: [''],
      ngayPduyet: [''],
      tchuanCluong: [''],
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
      let res = await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.dataTableDanhSachDX = dataDetail.thopDxKhBdgDtlList;
        this.formTraCuu.patchValue({
          ngayPduyet: [dataDetail.ngayDuyetTu, dataDetail.ngayDuyetDen],
        });
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
      if (body.ngayPduyet) {
        body.ngayDuyetTu = this.datePipe.transform(body.ngayPduyet[0], 'yyyy-MM-dd');
        body.ngayDuyetDen = this.datePipe.transform(body.ngayPduyet[1], 'yyyy-MM-dd');
      }
      delete body.ngayDx;
      let res = await this.tongHopDeXuatKeHoachBanDauGiaService.tonghop(body);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data
        let idTh = await this.userService.getId("XH_THOP_DX_KH_BDG_SEQ");
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail)
        this.formData.patchValue({
          id: idTh,
          ngayThop: dayjs().format("YYYY-MM-DD"),
        })
        this.dataTableDanhSachDX = dataDetail.thopDxKhBdgDtlList;
        await this.getDataChiTieu();
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

  async getDataChiTieu() {
    let res2 =
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formTraCuu.get('namKh').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      const data = res2.data;
      this.formData.patchValue({
        soQdPd: data.soQuyetDinh
      });
    }
    this.formData.patchValue({
      soQdPd: '150/TCDT',
    });
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_TONGHOP_SUA") && this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_TONGHOP_TONGHOP")) {
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
      body.ngayDuyetDen = this.formData.get('ngayPduyet').value
        ? dayjs(this.formData.get('ngayPduyet').value[0]).format(
          'YYYY-MM-DD',
        )
        : null,
        body.ngayDuyetTu = this.formData.get('ngayPduyet').value
          ? dayjs(this.formData.get('ngayPduyet').value[1]).format(
            'YYYY-MM-DD',
          )
          : null;
      let res = await this.tongHopDeXuatKeHoachBanDauGiaService.create(body);
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



