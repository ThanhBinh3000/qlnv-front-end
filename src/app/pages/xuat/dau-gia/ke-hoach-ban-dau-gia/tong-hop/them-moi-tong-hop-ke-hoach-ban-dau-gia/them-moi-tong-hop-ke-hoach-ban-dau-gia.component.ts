import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import {DatePipe} from '@angular/common';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from 'src/app/constants/status';
import {LOAI_HANG_DTQG} from "../../../../../../constants/config";

@Component({
  selector: 'app-them-moi-tong-hop-ke-hoach-ban-dau-gia',
  templateUrl: './them-moi-tong-hop-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-moi-tong-hop-ke-hoach-ban-dau-gia.component.scss']
})

export class ThemMoiTongHopKeHoachBanDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  formTraCuu: FormGroup;
  isDetailDxCuc: boolean = false;
  isTongHop: boolean = false;
  isQuyetDinh: boolean = false;
  datePipe = new DatePipe('en-US');
  selected: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        namKh: [dayjs().get('year'), [Validators.required]],
        ngayDuyetTu: [null],
        ngayDuyetDen: [null],
      }
    );
    this.formData = this.fb.group({
      id: [],
      idTh: [],
      loaiVthh: [''],
      cloaiVthh: [''],
      namKh: [],
      ngayDuyetTu: [''],
      ngayDuyetDen: [''],
      ngayThop: [''],
      noiDungThop: ['', [Validators.required]],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      trangThai: [''],
      tenTrangThai: [''],
      children: [],
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (this.idInput > 0) {
        await this.loadChiTiet()
      } else {
        await this.initForm();
      }
      await this.loadDsVthh()
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData.patchValue({
      trangThai: STATUS.CHUA_TAO_QD,
      tenTrangThai: 'Chưa Tạo QĐ ',
    })
  }

  async loadChiTiet() {
    if (this.idInput > 0) {
      const data = await this.detail(this.idInput);
      if (data) {
        this.isTongHop = true;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, data)
        this.formData.patchValue({
          idTh: data.id
        });
        if (data.children && data.children.length > 0) {
          this.showFirstRow(event, data.children[0].idDxHdr);
        }
      } else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  async tongHopDeXuatTuCuc() {
    await this.spinner.show();
    this.setValidator();
    try {
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        await this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
        return;
      }
      let body = this.formTraCuu.value;
      await this.tongHopDeXuatKeHoachBanDauGiaService.tonghop(body).then(async res => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data
          let idTh = await this.userService.getId("XH_THOP_DX_KH_BDG_SEQ");
          this.helperService.bidingDataInFormGroup(this.formData, body)
          this.formData.patchValue({
            idTh: idTh,
            ngayThop: dayjs().format("YYYY-MM-DD"),
            children: data.children,
          })
          if (this.formData.value.children && this.formData.value.children.length > 0) {
            this.showFirstRow(event, this.formData.value.children[0].idDxHdr);
          }
          this.isTongHop = true;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
          this.isTongHop = false;
        }
        await this.spinner.hide();
      });
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.isTongHop = false;
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = this.formData.value;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async showFirstRow($event, data: any) {
    await this.showDetail($event, data);
  }

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formTraCuu.value.ngayDuyetDen) {
      return false;
    }
    return startValue.getTime() > this.formTraCuu.value.ngayDuyetDen.getTime();
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formTraCuu.value.ngayDuyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formTraCuu.value.ngayDuyetTu.getTime();
  };

  setValidator() {
    if (this.formTraCuu.value.ngayDuyetTu == null) {
      this.formTraCuu.controls["ngayDuyetDen"].setValidators([Validators.required])
      this.formTraCuu.controls["ngayDuyetTu"].clearValidators();
    } else {
      this.formTraCuu.controls["ngayDuyetTu"].setValidators([Validators.required])
      this.formTraCuu.controls["ngayDuyetDen"].clearValidators();
    }
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

  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        res.data.forEach((item) => {
          this.formTraCuu.patchValue({
            tenLoaiVthh: item.children?.find(s => s.ma == this.loaiVthh)?.ten,
          })
        })
      }
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
        this.formTraCuu.patchValue({
          tenLoaiVthh: res.data?.find(s => s.ma == this.loaiVthh)?.ten,
        })
      }
    }
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
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    this.idRowSelect = id;
    await this.spinner.hide();
  }
}



