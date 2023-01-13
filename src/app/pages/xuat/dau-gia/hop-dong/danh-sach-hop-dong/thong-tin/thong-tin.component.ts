import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogCanCuKQLCNTComponent
} from 'src/app/components/dialog/dialog-can-cu-kqlcnt/dialog-can-cu-kqlcnt.component';
import {
  DialogThongTinPhuLucBangGiaHopDongComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import { HopDongXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import {
  DialogCanCuQdPheDuyetKqdgComponent
} from "../../../../../../components/dialog/dialog-can-cu-qd-phe-duyet-kqdg/dialog-can-cu-qd-phe-duyet-kqdg.component";
import { QuyetDinhPheDuyetKQBanDauGiaService } from "../../../../../../services/quyetDinhPheDuyetKQBanDauGia.service";
import { HelperService } from "../../../../../../services/helper.service";
import { STATUS } from "../../../../../../constants/status";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

interface DonviLienQuanModel {
  id: number;
  tenDvi: string;
  diaChi: string;
  mst: string;
  sdt: string;
  stk: string;
  nguoiDdien: string;
  chucVu: string;
  version?: number;
}

@Component({
  selector: 'app-thong-tin',
  templateUrl: './thong-tin.component.html',
  styleUrls: ['./thong-tin.component.scss']
})

export class ThongTinComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean = true;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  listLoaiHopDong: any[] = [];
  listGoiThau: any[] = [];
  listDviLquan: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;

  maHopDongSuffix: string = '';
  dvLQuan: DonviLienQuanModel = {
    id: 0,
    tenDvi: '',
    diaChi: '',
    mst: '',
    sdt: '',
    stk: '',
    nguoiDdien: '',
    chucVu: '',
  };

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviLienQuanService: DonviLienQuanService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private quyetDinhPheDuyetKQBanDauGiaService: QuyetDinhPheDuyetKQBanDauGiaService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongXuatHangService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        soQdKq: [null, [Validators.required]],
        ngayKyQdKq: [null,],
        soQdPd: [null, [Validators.required]],
        maDviTsan: [],

        soHd: [null, [Validators.required]],
        tenHd: [null, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        ghiChuNgayKy: [null],

        loaiHdong: [],
        ghiChuLoaiHdong: [],

        tgianThienHd: [],
        tgianBhanh: [],

        tgianTtoan: [],
        tgianTtoanGhiChu: [],
        dieuKienTtoan: [],

        tgianGnhan: [],
        tgianGnhanGhiChu: [],
        tgianNhanHang: [],
        noiDung: [],

        maDvi: [],
        tenDvi: [],
        diaChiChuDt: [],
        mstDt: [],
        tenNguoiDt: [],
        chucVuDt: [],
        sdtDt: [],
        stkDt: [],


        tenDviCc: [''],
        diaChiCc: [],
        mstCc: [],
        tenNguoiCc: [],
        chucVuCc: [''],
        sdtCc: [''],
        stkCc: [''],

        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        dviTinh: [''],
        soLuong: [''],
        ghiChu: [''],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo']
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
    await Promise.all([
      this.loaiDonviLienquanAll()
    ]);

    if (this.id) {
      await this.loadChiTiet(this.id);
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null
    })
  }

  async loadChiTiet(id) {
    // if (id > 0) {
    //   let res = await this.hopDongXuatHangService.getDetail(id);
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     if (res.data) {
    //       this.detail = res.data;
    //       this.formData.patchValue({
    //         canCu: this.detail.canCu ?? null,
    //         idGoiThau: this.detail.idGoiThau ?? null,
    //         maHdong: this.detail.soHd ? this.detail.soHd.split('/')[0] : null,
    //         tenHd: this.detail.tenHd ?? null,
    //         ngayKy: this.detail.ngayKy ?? null,
    //         namKh: this.detail.namKh ?? null,
    //         ngayHieuLuc: this.detail.tuNgayHluc && this.detail.denNgayHluc ? [this.detail.tuNgayHluc, this.detail.denNgayHluc] : null,
    //         soNgayThien: this.detail.soNgayThien ?? null,
    //         tenVthh: this.detail.tenVthh ?? null,
    //         loaiVthh: this.detail.loaiVthh ?? null,
    //         cloaiVthh: this.detail.cloaiVthh ?? null,
    //         tenCloaiVthh: this.detail.tenCloaiVthh ?? null,
    //         tgianNkho: this.detail.tgianNkho ?? null,
    //         soLuong: this.detail.soLuong ?? null,
    //         donGiaVat: this.detail.donGiaVat ?? null,
    //         gtriHdSauVat: this.detail.gtriHdSauVat ?? null,
    //         maDvi: this.detail.maDvi ?? null,
    //         tenDvi: this.detail.tenDvi ?? null,
    //         diaChi: this.detail.diaChi ?? null,
    //         mst: this.detail.mst ?? null,
    //         sdt: this.detail.sdt ?? null,
    //         stk: this.detail.stk ?? null,
    //         tenNguoiDdien: this.detail.stk ?? null,
    //         chucVu: this.detail.stk ?? null,
    //         ghiChu: this.detail.ghiChu ?? null,
    //         trangThai: this.detail.trangThai ?? null,
    //         tenTrangThai: this.detail.tenTrangThai ?? null
    //       })
    //       if (this.userService.isTongCuc) {
    //         this.formData.patchValue({
    //           dviTinh: this.detail.dviTinh ?? null
    //         })
    //       }
    //       this.dvLQuan = this.listDviLquan.find(item => item.id == this.detail.idNthau);
    //       this.fileDinhKem = this.detail.fileDinhKems;
    //       await this.getListGoiThau(this.detail.id);
    //     }
    //   }
    // }
  }

  async loaiDonviLienquanAll() {
    this.listDviLquan = [];
    const body = {
      "typeDvi": "NT"
    };
    let res = await this.donviLienQuanService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviLquan = res.data;
    }
  }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    console.log("🚀 ~ file: thong-tin.component.ts ~ line 288 ~ ThongTinComponent ~ save ~ body", body)


    // this.spinner.show();
    // try {
    //   if (!this.formData.value.ghiChu && this.formData.value.ghiChu == '') {
    //     this.errorGhiChu = true;
    //   } else {
    //     let body = this.formData.value;
    //     body.soHd = `${this.formData.value.maHdong}${this.maHopDongSuffix}`;
    //     body.namKh = this.formData.value.namKh ? this.formData.value.namKh : new Date().getUTCFullYear();
    //     body.fileDinhKems = this.fileDinhKem,
    //       body.tuNgayHluc = this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0 ? dayjs(this.formData.value.ngayHieuLuc[0]).format('YYYY-MM-DD') : null,
    //       body.denNgayHluc = this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0 ? dayjs(this.formData.value.ngayHieuLuc[1]).format('YYYY-MM-DD') : null,
    //       delete body.ngayHieuLuc;
    //     delete body.maHdong;
    //     delete body.tenCloaiVthh;
    //     delete body.tenVthh;

    //     body.idNthau = `${this.dvLQuan.id}`;
    //     body.diaDiemNhapKhoReq = this.diaDiemNhapListCuc;
    //     if (this.id > 0) {
    //       body.id = this.id;
    //       let res = await this.hopDongXuatHangService.update(
    //         body,
    //       );
    //       if (res.msg == MESSAGE.SUCCESS) {
    //         if (!isOther) {
    //           this.notification.success(
    //             MESSAGE.SUCCESS,
    //             MESSAGE.UPDATE_SUCCESS,
    //           );
    //           this.back();
    //         }
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, res.msg);
    //       }
    //     } else {
    //       let res = await this.hopDongXuatHangService.create(
    //         body,
    //       );
    //       if (res.msg == MESSAGE.SUCCESS) {
    //         if (!isOther) {
    //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //           this.back();
    //         }
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, res.msg);
    //       }
    //     }
    //   }
    //   this.spinner.hide();
    // } catch (e) {
    //   console.log('error: ', e);
    //   this.spinner.hide();
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    // }
  }


  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.id);
  }

  openDialogBang(data) {
    const modalPhuLuc = this.modal.create({
      nzTitle: 'Thông tin phụ lục bảng giá chi tiết hợp đồng',
      nzContent: DialogThongTinPhuLucBangGiaHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalPhuLuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  openDialogCanCu() {
    // if (this.id == 0) {
    // const modalQD = this.modal.create({
    //   nzTitle: 'Thông tin Kết quả lựa chọn nhà thầu',
    //   nzContent: DialogCanCuQdPheDuyetKqdgComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '900px',
    //   nzFooter: null,
    //   nzComponentParams: {
    //     loaiVthh: this.loaiVthh
    //   },
    // });
    // modalQD.afterClose.subscribe(async (data) => {
    //   if (data) {
    //     this.formData.patchValue({
    //       canCu: data.soQuyetDinh ?? null,
    //       namKh: +data.namKhoach ?? null,
    //       idGoiThau: null,
    //       soNgayThien: null,
    //       loaiVthh: data.loaiVthh,
    //       tenVthh: data.tenVthh,
    //       cloaiVthh: null,
    //       tenCloaiVthh: null,
    //       soLuong: null,
    //       donGiaVat: null,
    //     })
    //     await this.getListGoiThau(data.id);
    //   }
    // });
    // }
  }

  async onChangeGoiThau(event) {
    // if (event) {
    //   let res = await this.dauThauGoiThauService.chiTietByGoiThauId(event);
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     const data = res.data;
    //     console.log("🚀 ~ file: thong-tin.component.ts ~ line 416 ~ ThongTinComponent ~ onChangeGoiThau ~ data", data)
    //     this.formData.patchValue({
    //       soNgayThien: data.tgianThienHd ?? null,
    //       tenVthh: data.tenVthh ?? null,
    //       loaiVthh: data.loaiVthh ?? null,
    //       cloaiVthh: data.cloaiVthh ?? null,
    //       tenCloaiVthh: data.tenCloaiVthh ?? null,
    //       soLuong: data.soLuong ?? null,
    //       donGiaVat: data.donGiaTrcVat && data.vat ? (data.donGiaTrcVat + (data.donGiaTrcVat * data.vat / 100)) : null,
    //     })
    //     this.onChangeDvlq(data.idNhaThau);
    //     this.diaDiemNhapListCuc = data.diaDiemNhapList;
    //     this.diaDiemNhapListCuc.forEach(element => {
    //       delete element.id
    //     });
    //     if (this.userService.isTongCuc()) {
    //       this.formData.patchValue({
    //         dviTinh: data.dviTinh ?? null
    //       })
    //     }
    //   }
    // }
  }

  back() {
    this.showListEvent.emit();
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Tài liệu đính kèm',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            this.fileDinhKem.push(fileDinhKem);
          });
      }
    });
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }

  onChangeDvlq(event) {
    this.dvLQuan = this.listDviLquan.find(item => item.id == event);
  }

  async getListGoiThau(idCanCu) {
    // let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(idCanCu);
    let res = await this.quyetDinhPheDuyetKQBanDauGiaService.chiTiet(idCanCu);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.listGoiThau = data.hhQdPduyetKqlcntDtlList;
    }
  }

  isDisabled() {
    return false;
  }

  getNameFile($event) {

  }
}

