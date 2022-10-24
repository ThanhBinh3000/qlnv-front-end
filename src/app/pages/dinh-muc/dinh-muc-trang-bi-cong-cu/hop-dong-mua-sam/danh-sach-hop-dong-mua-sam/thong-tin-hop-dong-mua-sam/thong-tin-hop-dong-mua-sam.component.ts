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
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import { TreeTableService } from 'src/app/services/tree-table.service';

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
  selector: 'app-thong-tin-hop-dong-mua-sam',
  templateUrl: './thong-tin-hop-dong-mua-sam.component.html',
  styleUrls: ['./thong-tin-hop-dong-mua-sam.component.scss']
})
export class ThongTinHopDongMuaSamComponent implements OnInit {
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

  isVatTu: boolean = false;

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
  diaDiemNhapListCuc = [];
  donGiaCore: number = 0;

  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  dataTable: any[] = [];
  itemRow: any = {};

  dataDiemDiemNhapHang: any[] = [];
  mapOfExpandedData: { [key: string]: any[] } = {};

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
    private _modalService: NzModalService,
    public treeTableService: TreeTableService<any>,
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
        tgianNkho: [null],
        tenVthh: [null],
        loaiVthh: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        soLuong: [null],
        dviTinh: [null],
        donGiaVat: [null],
        gtriHdSauVat: [null],
        tgianBhanh: [null],
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
        this.donGiaCore = value;
        const gtriHdSauVat = this.formDetailHopDong.controls.donGiaVat.value * this.formDetailHopDong.controls.soLuong.value;
        this.formDetailHopDong.controls['gtriHdSauVat'].setValue(gtriHdSauVat);
      } else {
        this.donGiaCore = 0;
        this.formDetailHopDong.controls['gtriHdSauVat'].setValue(0);
      }
    });
  }

  calculateGiaSauThue(soLuong, donGia) {
    return soLuong * donGia;
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
            tgianNkho: this.detail.tgianNkho ?? null,
            soLuong: this.detail.soLuong ?? null,
            donGiaVat: this.detail.donGiaVat ?? null,
            tgianBhanh: this.detail.tgianBhanh ?? null,
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
          this.dvLQuan = this.listDviLquan.find(item => item.id == this.detail.idNthau);
          await this.getListGoiThau(this.detail.id);
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
    let body = this.formDetailHopDong.value;
    console.log("🚀 ~ file: thong-tin.component.ts ~ line 288 ~ ThongTinComponent ~ save ~ body", body)
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

        body.idNthau = `${this.dvLQuan.id}`;
        body.diaDiemNhapKhoReq = this.diaDiemNhapListCuc;
        if (this.id > 0) {
          body.id = this.id;
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
    modalQD.afterClose.subscribe(async (data) => {
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
        await this.getListGoiThau(data.id);
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
          donGiaVat: data.donGiaTrcVat && data.vat ? (data.donGiaTrcVat + (data.donGiaTrcVat * data.vat / 100)) : null,
        })
        this.onChangeDvlq(data.idNhaThau);
        this.diaDiemNhapListCuc = data.diaDiemNhapList;
        this.diaDiemNhapListCuc.forEach(element => {
          delete element.id;
          this.mapOfExpandedData[element.id] = this.treeTableService.convertTreeToList(element, 'id');
        });
        if (this.userService.isTongCuc()) {
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

  async getListGoiThau(idCanCu) {
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(idCanCu);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      if (data.loaiVthh.startsWith("02")) {
        this.isVatTu = true;
      } else {
        this.isVatTu = false;
      }
      this.listGoiThau = data.hhQdPduyetKqlcntDtlList;
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

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        this.editCache[item.stt] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  cancelEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    this.editCache[stt] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    Object.assign(this.dataTable[index], this.editCache[stt].data);
    this.editCache[stt].edit = false;
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.itemRow);
    item.stt = this.dataTable.length + 1;
    item.thanhTien = (item.soLuong ?? 0) * (item.donGia ?? 0);
    this.dataTable = [
      ...this.dataTable,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
  }

  deleteRow(data: any) {
    this.dataTable = this.dataTable.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editCache[stt].edit = true;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
}
