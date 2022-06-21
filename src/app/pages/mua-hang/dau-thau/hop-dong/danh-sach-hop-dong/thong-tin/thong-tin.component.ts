import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuKQLCNTComponent } from 'src/app/components/dialog/dialog-can-cu-kqlcnt/dialog-can-cu-kqlcnt.component';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThongTinPhuLucBangGiaHopDongComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/quyetDinhPheDuyetKetQuaLCNT.service';

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

export class ThongTinComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  userInfo: UserLogin;
  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

  detail: any = {};
  detailChuDauTu: any = {};
  detailDviCungCap: any = {};
  fileDinhKem: Array<FileDinhKem> = [];
  tabSelected: string = 'thong-tin-chung';

  optionsDonVi: any[] = [];
  optionsDonViShow: any[] = [];

  listLoaiHopDong: any[] = [];
  listGoiThau: any[] = [];
  listDviLquan: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;

  formDetailHopDong: FormGroup;
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
    private router: Router,
    private fb: FormBuilder,
    public userService: UserService,
    public globals: Globals,
    private modal: NzModalService,
    private thongTinHopDong: ThongTinHopDongService,
    private routerActive: ActivatedRoute,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private dauThauGoiThauService: dauThauGoiThauService,
    private uploadFileService: UploadFileService,
    private donviLienQuanService: DonviLienQuanService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService
  ) {
    this.formDetailHopDong = this.fb.group(
      {
        canCu: [null],
        idGoiThau: [null],
        maHdong: [null],
        tenHd: [null],
        ngayKy: [null],
        namKh: [null],
        ngayHieuLuc: [null],
        soNgayThien: [null],
        tenVthh: [null],
        loaiVthh: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        soLuong: [null],
        donGiaVat: [null],
        gtriHdSauVat: [null],

        maDvi: [null],
        tenDvi: [null],
        diaChi: [null],
        mst: [null],
        sdt: [null],
        stk: [null],
        tenNguoiDdien: [null],
        chucVu: [null],
        idNthau: [null],
        ghiChu: [null]
      }
    );
    this.formDetailHopDong.controls['donGiaVat'].valueChanges.subscribe(value => {
      if (value) {
        const gtriHdSauVat = this.formDetailHopDong.controls.donGiaVat.value * this.formDetailHopDong.controls.soLuong.value;
        this.formDetailHopDong.controls['gtriHdSauVat'].setValue(gtriHdSauVat);
      } else {
        this.formDetailHopDong.controls['gtriHdSauVat'].setValue(0);
      }
    });
  }

  async ngOnInit() {
    const yearNow = new Date().getUTCFullYear();
    this.maHopDongSuffix = `/${yearNow}/HĐMB`;
    this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
    this.getTitleVthh();
    this.detail.trangThai = "00";
    this.detailChuDauTu.type = 'A';
    this.detailDviCungCap.type = 'B';
    this.detail.bangGia = [];
    this.userInfo = this.userService.getUserLogin();
    this.formDetailHopDong.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null
    })
    await Promise.all([
      this.loadDonVi(),
      this.loaiHopDongGetAll(),
      this.loaiDonviLienquanAll()
    ]);
    await this.loadChiTiet(this.id);

  }

  validateGhiChu() {
    if (this.formDetailHopDong.value.ghiChu && this.formDetailHopDong.value.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.thongTinHopDong.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.formDetailHopDong.patchValue({
            canCu: data.canCu ?? null,
            idGoiThau: data.idGoiThau ?? null,
            maHdong: data.soHd ? data.soHd.split('/')[0] : null,
            tenHd: data.tenHd ?? null,
            ngayKy: data.ngayKy ?? null,
            namKh: data.namKh ?? null,
            ngayHieuLuc: data.tuNgayHluc && data.denNgayHluc ? [data.tuNgayHluc, data.denNgayHluc] : null,
            soNgayThien: data.soNgayThien ?? null,
            tenVthh: data.tenVthh ?? null,
            loaiVthh: data.loaiVthh ?? null,
            cloaiVthh: data.cloaiVthh ?? null,
            tenCloaiVthh: data.tenCloaiVthh ?? null,
            soLuong: data.soLuong ?? null,
            donGiaVat: data.donGiaVat ?? null,
            gtriHdSauVat: data.gtriHdSauVat ?? null,

            maDvi: data.maDvi ?? null,
            tenDvi: data.tenDvi ?? null,
            diaChi: data.diaChi ?? null,
            mst: data.mst ?? null,
            sdt: data.sdt ?? null,
            stk: data.stk ?? null,
            tenNguoiDdien: data.stk ?? null,
            chucVu: data.stk ?? null,
            ghiChu: data.ghiChu ?? null
          })
          const dvlq = data.idNthau;
          if (dvlq) {
            this.dvLQuan = this.listDviLquan.find(item => item.id == dvlq.split('/')[0] && item.version == dvlq.split('/')[1])
          }
          await this.getListGoiThau(data.canCu)

          console.log("🚀 ~ file: thong-tin.component.ts ~ line 178 ~ ThongTinComponent ~ loadChiTiet ~ res.data", res.data)
          // this.detail = res.data;
          // if (this.detail.tuNgayHluc && this.detail.denNgayHluc) {
          //   this.detail.ngayHieuLuc = [this.detail.tuNgayHluc, this.detail.denNgayHluc];
          // }
          // if (this.detail.tuNgayTdo && this.detail.denNgayTdo) {
          //   this.detail.ngayTocDo = [this.detail.tuNgayTdo, this.detail.denNgayTdo];
          // }
          // if (this.detail.children1 && this.detail.children1.length > 0) {
          //   this.detail.children1.forEach(element => {
          //     if (element.type == 'A') {
          //       this.detailChuDauTu = element;
          //     }
          //     else if (element.type == 'B') {
          //       this.detailDviCungCap = element;
          //     }
          //   });
          // }
          // if (this.detail.children && this.detail.children.length > 0) {
          //   this.detail.bangGia = [];
          //   this.detail.children.forEach(element => {
          //     let item = cloneDeep(element);
          //     if (element.children && element.children.length > 0) {
          //       item.detail = element.children;
          //     }
          //     this.detail.bangGia.push(item);
          //   });
          // }
          // if (this.detail.children2 && this.detail.children2.length > 0) {
          //   this.fileDinhKem = this.detail.children2;
          // }
        }
      }
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
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

  async loadDonVi() {
    const res = await this.donViService.layDonViCon();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.detail.tenDvi = donVi.tenDvi;
    this.detailChuDauTu.ten = this.detail.tenDvi;
    this.detail.maDvi = donVi.maDvi;
    this.detailChuDauTu.ma = this.detail.maDvi;
  }

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/") != -1) {
      this.loaiStr = "Thóc";
      this.loaiVthh = "01";
      this.maVthh = "0101";
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/") != -1) {
      this.loaiStr = "Gạo";
      this.loaiVthh = "00";
      this.maVthh = "0102";
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/") != -1) {
      this.loaiStr = "Muối";
      this.loaiVthh = "02";
      this.maVthh = "04";
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/") != -1) {
      this.loaiStr = "Vật tư";
      this.loaiVthh = "03";
      this.routerVthh = 'vat-tu';
    }
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      if (!this.formDetailHopDong.value.ghiChu && this.formDetailHopDong.value.ghiChu == '') {
        this.errorGhiChu = true;
      }
      else {
        // let detail1 = [];
        // if (this.detailChuDauTu && this.detailChuDauTu.ten) {
        //   detail1.push(this.detailChuDauTu);
        // }
        // if (this.detailDviCungCap && this.detailDviCungCap.ten) {
        //   detail1.push(this.detailDviCungCap);
        // }
        // let body = {
        //   "canCu": this.detail.canCu,
        //   "denNgayHluc": this.detail.ngayHieuLuc && this.detail.ngayHieuLuc.length > 1 ? dayjs(this.detail.ngayHieuLuc[1]).format('YYYY-MM-DD') : null,
        //   "denNgayTdo": this.detail.ngayTocDo && this.detail.ngayTocDo.length > 1 ? dayjs(this.detail.ngayTocDo[1]).format('YYYY-MM-DD') : null,
        //   "detail": this.detail.bangGia,
        //   "detail1": detail1,
        //   "fileDinhKems": this.fileDinhKem,
        //   "ghiChu": this.detail.ghiChu,
        //   "gtriHdSauVat": this.detail.gtriHdSauVat,
        //   "gtriHdTrcVat": this.detail.gtriHdTrcVat,
        //   "id": this.id,
        //   "ldoTuchoi": null,
        //   "loaiHd": this.detail.loaiHd,
        //   "loaiVthh": this.loaiVthh,
        //   "namKhoach": this.detail.namKhoach,
        //   "ngayKy": this.detail.ngayKy,
        //   "nuocSxuat": this.detail.nuocSxuat,
        //   "soHd": this.detail.soHd,
        //   "soLuong": this.detail.soLuong,
        //   "soNgayTdo": this.detail.soNgayTdo,
        //   "soNgayThien": this.detail.soNgayThien,
        //   "tenHd": this.detail.tenHd,
        //   "tieuChuanCl": this.detail.tieuChuanCl,
        //   "tuNgayHluc": this.detail.ngayHieuLuc && this.detail.ngayHieuLuc.length > 0 ? dayjs(this.detail.ngayHieuLuc[0]).format('YYYY-MM-DD') : null,
        //   "tuNgayTdo": this.detail.ngayTocDo && this.detail.ngayTocDo.length > 0 ? dayjs(this.detail.ngayTocDo[0]).format('YYYY-MM-DD') : null,
        //   "vat": this.detail.vat
        // }
        let body = this.formDetailHopDong.value;
        body.soHd = `${this.formDetailHopDong.value.maHdong}${this.maHopDongSuffix}`;
        body.fileDinhKems = this.fileDinhKem,
          body.tuNgayHluc = this.formDetailHopDong.value.ngayHieuLuc && this.formDetailHopDong.value.ngayHieuLuc.length > 0 ? dayjs(this.formDetailHopDong.value.ngayHieuLuc[0]).format('YYYY-MM-DD') : null,
          body.denNgayHluc = this.formDetailHopDong.value.ngayHieuLuc && this.formDetailHopDong.value.ngayHieuLuc.length > 0 ? dayjs(this.formDetailHopDong.value.ngayHieuLuc[1]).format('YYYY-MM-DD') : null,
          delete body.ngayHieuLuc;
        delete body.maHdong;
        delete body.tenCloaiVthh;
        delete body.tenVthh;

        body.idNthau = `${this.dvLQuan.id}/${this.dvLQuan.version}`
        if (this.id > 0) {
          let res = await this.thongTinHopDong.update(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.back();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          let res = await this.thongTinHopDong.create(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === '00' ||
      trangThai === '01' ||
      trangThai === '04' ||
      trangThai === '03'
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }

  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.id = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.tabSelected = 'thong-tin-chung';
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

  caculatorSauVAT() {
    this.detail.gtriHdSauVat = ((this.detail?.soLuong ?? 0) * (this.detail?.donGiaVat ?? 0)).toFixed();
  }

  changeDateThucHien() {
    if (this.detail.ngayHieuLuc && this.detail.ngayHieuLuc.length > 1) {
      this.detail.soNgayThien = dayjs(this.detail.ngayHieuLuc[1]).diff(dayjs(this.detail.ngayHieuLuc[0]), 'day')
    }
  }

  changeDateTocDo() {
    if (this.detail.ngayTocDo && this.detail.ngayTocDo.length > 1) {
      this.detail.soNgayTdo = dayjs(this.detail.ngayTocDo[1]).diff(dayjs(this.detail.ngayTocDo[0]), 'day')
    }
  }

  openDialogKQLCNT() {
    // if (this.id == 0) {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Kết quả lựa chọn nhà thầu',
      nzContent: DialogCanCuKQLCNTComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        loaiVthh: this.loaiVthh
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formDetailHopDong.patchValue({
          canCu: data.soQd ?? null,
          namKh: +data.namKhoach ?? null,
          idGoiThau: null,
          soNgayThien: null,
          tenVthh: null,
          loaiVthh: null,
          cloaiVthh: null,
          tenCloaiVthh: null,
          soLuong: null,
          donGiaVat: null,
        })
        if (data.children1 && data.children1.length > 0) {
          this.listGoiThau = data.children1;
        }
      }
    });
    // }
  }

  async onChangeGoiThau(event) {
    if (event) {
      let res = await this.dauThauGoiThauService.chiTietByGoiThauId(event);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formDetailHopDong.patchValue({
          soNgayThien: data.tgianThienHd ?? null,
          tenVthh: data.tenVthh ?? null,
          loaiVthh: data.loaiVthh ?? null,
          cloaiVthh: data.cloaiVthh ?? null,
          tenCloaiVthh: data.tenCloaiVthh ?? null,
          soLuong: data.soLuong ?? null,
          donGiaVat: data.children3[0].dgiaSauThue ?? null,
        })
      }
    }
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

  async getListGoiThau(canCu) {
    const body = {
      "denNgayQd": null,
      "loaiVthh": this.loaiVthh,
      "maDvi": null,
      "namKhoach": null,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": PAGE_SIZE_DEFAULT,
        "orderBy": null,
        "orderType": null,
        "page": 0
      },
      "soQd": null,
      "str": null,
      "trangThai": null,
      "tuNgayQd": null
    };
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      const goiThauSelected = data.find(item => item.canCu == canCu);
      if (!!goiThauSelected) {
        this.listGoiThau = goiThauSelected.children1;
      }
    }
  }

}
