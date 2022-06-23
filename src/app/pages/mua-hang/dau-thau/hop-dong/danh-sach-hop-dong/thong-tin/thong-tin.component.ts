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
  @Input() isView: boolean = true;
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
  titleStatus: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
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
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private _modalService: NzModalService
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
        dviTinh: [null],
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
    this.detail.trangThai = "00";
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
    await this.setTitle();

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
          this.detail = res.data;
          this.formDetailHopDong.patchValue({
            canCu: this.detail.canCu ?? null,
            idGoiThau: this.detail.idGoiThau ?? null,
            maHdong: this.detail.soHd ? this.detail.soHd.split('/')[0] : null,
            tenHd: this.detail.tenHd ?? null,
            ngayKy: this.detail.ngayKy ?? null,
            namKh: this.detail.namKh ?? null,
            ngayHieuLuc: this.detail.tuNgayHluc && this.detail.denNgayHluc ? [this.detail.tuNgayHluc, this.detail.denNgayHluc] : null,
            soNgayThien: this.detail.soNgayThien ?? null,
            tenVthh: this.detail.tenVthh ?? null,
            loaiVthh: this.detail.loaiVthh ?? null,
            cloaiVthh: this.detail.cloaiVthh ?? null,
            tenCloaiVthh: this.detail.tenCloaiVthh ?? null,
            soLuong: this.detail.soLuong ?? null,
            donGiaVat: this.detail.donGiaVat ?? null,
            gtriHdSauVat: this.detail.gtriHdSauVat ?? null,
            maDvi: this.detail.maDvi ?? null,
            tenDvi: this.detail.tenDvi ?? null,
            diaChi: this.detail.diaChi ?? null,
            mst: this.detail.mst ?? null,
            sdt: this.detail.sdt ?? null,
            stk: this.detail.stk ?? null,
            tenNguoiDdien: this.detail.stk ?? null,
            chucVu: this.detail.stk ?? null,
            ghiChu: this.detail.ghiChu ?? null
          })
          if (this.userService.isTongCuc) {
            this.formDetailHopDong.patchValue({
              dviTinh: this.detail.dviTinh ?? null
            })
          }
          const dvlq = this.detail.idNthau;
          if (dvlq) {
            this.dvLQuan = this.listDviLquan.find(item => item.id == dvlq.split('/')[0] && item.version == dvlq.split('/')[1])
          }
          await this.getListGoiThau(this.detail.canCu)
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

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      if (!this.formDetailHopDong.value.ghiChu && this.formDetailHopDong.value.ghiChu == '') {
        this.errorGhiChu = true;
      }
      else {
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

  async setTitle() {
    let trangThai = this.detail.trangThai ?? '00'
    switch (trangThai) {
      case '00': {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case '02': {
        this.titleStatus = 'Đã ký';
        this.styleStatus = 'da-ban-hanh'
        break
      }
    }
  }

  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.tabSelected = 'thong-tin-chung';
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
        if (this.userService.isTongCuc) {
          this.formDetailHopDong.patchValue({
            dviTinh: data.dviTinh ?? null
          })
        }
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

  approve() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: `Bạn có chắc chắn muốn ký hợp đồng này không?`,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 365,
      nzOnOk: async () => {
        const body = {
          id: this.detail.id,
          trangThai: '02',
        }
        let res = await this.thongTinHopDong.approve(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          this.isView = true;
          this.detail.trangThai = "02";
          this.setTitle();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      },
    });
  }

}
