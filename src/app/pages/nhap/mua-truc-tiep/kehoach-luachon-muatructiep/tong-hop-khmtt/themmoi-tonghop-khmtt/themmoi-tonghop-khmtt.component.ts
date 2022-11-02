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
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { API_STATUS_CODE } from 'src/app/constants/config';
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
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  formTraCuu: FormGroup;
  formData: FormGroup;
  isDetailDxCuc: boolean = false;
  dataTableDanhSachMTT: any[] = [];
  isTongHop: boolean = false;
  i = 0;
  listNam: any[] = [];
  listNguonVon: any[] = [];
  selectedId: number = 0;
  errorInputRequired: string = null;
  isQuyetDinh: boolean = false;
  STATUS = STATUS;
  userInfo: UserLogin;
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
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        namKh: [dayjs().get('year'), [Validators.required]],
      }
    );
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      namKh: [dayjs().get('year'), [Validators.required]],
      soDxuat: [''],
      trichYeu: [''],
      ngayTao: [,],
      ngayPduyet: [''],
      tenDuAn: [''],
      soQd: [''],
      moTaHangHoa: [''],
      ptMua: [''],
      tchuanCluong: [''],
      giaMua: [''],
      giaChuaThue: [''],
      giaCoThue: [''],
      tgianMkho: [''],
      tgianKthuc: [''],
      ghiChu: ['',],
      tenChuDt: [''],
      tongMucDt: [''],
      nguonVon: [''],
      trangThai: [''],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      noiDung: [, [Validators.required]],
      thueGtgt: [''],
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
      let res = await this.tongHopDeXuatKHMTTService.getDetail(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.dataTableDanhSachMTT = dataDetail.hhDxKhMttThopDtls;
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

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // List loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resLoaiHinhNX = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resLoaiHinhNX.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resLoaiHinhNX.data;
    }
    // Kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
  }

  async tongHopDeXuat() {
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
        this.dataTableDanhSachMTT = dataDetail.hhDxKhMttThopDtls;
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
        data,
        onlyLuongThuc: true,
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
        let res = await this.dmTieuChuanService.getDetailByMaHh(
          this.formData.get('cloaiVthh').value,
        );
        if (res.statusCode == API_STATUS_CODE.SUCCESS) {
          this.formData.patchValue({
            tchuanCluong: res.data ? res.data.tenQchuan : null,
          });
        }
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



