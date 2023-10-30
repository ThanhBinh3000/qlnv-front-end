import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {DatePipe} from '@angular/common';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  TongHopKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/tong-hop-kh-ban-truc-tiep.service';
import {STATUS} from 'src/app/constants/status';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {PREVIEW} from "../../../../../../constants/fileType";
import {saveAs} from 'file-saver';
import printJS from "print-js";

@Component({
  selector: 'app-them-moi-tong-hop-kh-ban-truc-tiep',
  templateUrl: './them-moi-tong-hop-kh-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-tong-hop-kh-ban-truc-tiep.component.scss']
})

export class ThemMoiTongHopKhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  formTraCuu: FormGroup;
  isDetailDxCuc: boolean = false;
  isTongHop: boolean = false;
  isQuyetDinh: boolean = false;
  datePipe = new DatePipe('en-US');
  selected: boolean = false;
  listVatTuCha: any[] = [];
  listVatTu: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private tongHopKhBanTrucTiepService: TongHopKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopKhBanTrucTiepService);

    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
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
      noiDungThop: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      trangThai: [''],
      tenTrangThai: [''],
      ghiChu: [''],
      children: [],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.idInput > 0) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await Promise.all([
        this.loadDsTenVthh(),
        this.loadDsVthh()
      ]);
    } catch (error) {
      console.error('Error:', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  initForm() {
    this.formData.patchValue({
      trangThai: STATUS.CHUA_TAO_QD,
      tenTrangThai: 'Chưa Tạo QĐ ',
    })
  }

  async loadChiTiet() {
    if (this.idInput <= 0) return;
    const data = await this.detail(this.idInput);
    if (!data) {
      this.isTongHop = false;
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      return;
    }
    this.isTongHop = true;
    this.helperService.bidingDataInFormGroup(this.formTraCuu, data);
    this.formData.patchValue({idTh: data.id});
    if (data.children && data.children.length > 0) {
      this.showFirstRow(event, data.children[0].idDxHdr);
    }
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      await this.onChangeCLoaiVthh(data.loaiVthh);
    }
  }

  async tongHopDeXuatTuCuc() {
    try {
      await this.spinner.show();
      this.setValidator();
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
        return;
      }
      const body = this.formTraCuu.value;
      const res = await this.tongHopKhBanTrucTiepService.tonghop(body);
      if (res.msg === MESSAGE.SUCCESS) {
        if (res.data === null || (Array.isArray(res.data) && res.data.length === 0)) {
          this.notification.error(MESSAGE.ERROR, 'Dữ liệu không có.');
          this.isTongHop = false;
        } else {
          const data = res.data;
          const idTh = await this.userService.getId("XH_THOP_DX_KH_BTT_HDR_SEQ");
          this.helperService.bidingDataInFormGroup(this.formData, body);
          this.formData.patchValue({
            idTh,
            ngayThop: dayjs().format("YYYY-MM-DD"),
            children: data.children,
          });
          if (this.formData.value.children && this.formData.value.children.length > 0) {
            this.showFirstRow(event, this.formData.value.children[0].idDxHdr);
          }
          this.isTongHop = true;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.isTongHop = false;
      }
    } catch (e) {
      console.error('error:', e);
      this.isTongHop = false;
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async save(isTaoQuyetDinh?) {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["noiDungThop"].setValidators([Validators.required]);
      const body = this.formData.value;
      const data = await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
      if (data.id) {
        if (isTaoQuyetDinh) {
          this.formData.controls["noiDungThop"].setValidators([Validators.required]);
          this.taoQdinh();
        }
      }
    } catch (error) {
      console.error('Error in save:', error);
    }
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

  showList() {
    this.isDetailDxCuc = false;
  }

  selectHangHoa() {
    const modal = this.modal.create({
      nzTitle: 'DANH SÁCH HÀNG HÓA',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: this.loaiVthh
      },
    });
    modal.afterClose.subscribe(data => {
      if (data) {
        const {ma, ten, parent} = data;
        this.formTraCuu.patchValue({
          cloaiVthh: ma,
          tenCloaiVthh: ten,
          loaiVthh: parent.ma,
          tenLoaiVthh: parent.ten,
        });
      }
    });
  }

  async loadDsVthh() {
    const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg === MESSAGE.SUCCESS) {
      const data = res.data.find(item => item.ma === this.loaiVthh);
      this.listVatTuCha = data?.children || [];
      if (this.formData.value.loaiVthh) {
        const chungLoai = this.listVatTuCha.find(item => item.ma === this.formData.value.loaiVthh);
        this.listVatTu = chungLoai?.children || [];
      }
    }
  }

  onChangeCLoaiVthh(event, isCloai?) {
    if (isCloai) {
      this.formTraCuu.patchValue({
        cloaiVthh: null,
        tenCloaiVthh: null,
      });
    }
    const data = this.listVatTuCha.find(item => item.ma === event);
    this.listVatTu = data?.children || [];
  }

  async loadDsTenVthh() {
    const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg !== MESSAGE.SUCCESS) return;
    if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
      const tenLoaiVthh = res.data
        .flatMap(item => item.children || [])
        .find(s => s.ma === this.loaiVthh)?.ten;
      this.formTraCuu.patchValue({tenLoaiVthh});
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
      const tenLoaiVthh = res.data.find(s => s.ma === this.loaiVthh)?.ten;
      this.formTraCuu.patchValue({tenLoaiVthh});
    }
  }

  setValidator() {
    if (!this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.formTraCuu.controls["loaiVthh"].setValidators([Validators.required])
      this.formTraCuu.controls["tenLoaiVthh"].setValidators([Validators.required])
      this.formTraCuu.controls["cloaiVthh"].setValidators([Validators.required])
      this.formTraCuu.controls["tenCloaiVthh"].setValidators([Validators.required])
    } else {
      this.formTraCuu.controls["loaiVthh"].setValidators([Validators.required])
      this.formTraCuu.controls["tenLoaiVthh"].clearValidators();
      this.formTraCuu.controls["cloaiVthh"].clearValidators();
      this.formTraCuu.controls["tenCloaiVthh"].clearValidators();
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
    await this.spinner.show();
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

  async preview(id) {
    await this.tongHopKhBanTrucTiepService.preview({
      tenBaoCao: 'Tổng hợp kế hoạch bán đấu giá',
      id: id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.printSrc = res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadPdf() {
    saveAs(this.pdfSrc, "tong-hop-ke-hoach-ban-truc-tiep.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "tong-hop-ke-hoach-ban-truc-tiep.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }
}




