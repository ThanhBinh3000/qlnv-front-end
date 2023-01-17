import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogThongTinPhuLucBangGiaHopDongComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { saveAs } from 'file-saver';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HopDongXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import { QuyetDinhPheDuyetKQBanDauGiaService } from "../../../../../../services/quyetDinhPheDuyetKQBanDauGia.service";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { chain } from 'lodash';

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
  listDviTsan: any[] = [];
  listDviLquan: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;

  maHopDongSuffix: string = '';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviLienQuanService: DonviLienQuanService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private quyetDinhPheDuyetKQBanDauGiaService: QuyetDinhPheDuyetKQBanDauGiaService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
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

        canCu: [''],
        gtriHdSauVat: [''],
        maHdong: [''],
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
        gtraHdSauVat: [''],
        tenCloaiVthh: [''],
        tenVthh: [''],
        stk: [''],
        sdt: [''],
        chucVu: [''],
        tenNguoiDdien: [''],
        mst: [''],
        diaChi: [''],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],

        listMaDviTsan: []
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

  async openDialogKqBdg() {
    this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    };
    let res = await this.qdPdKetQuaBanDauGiaService.search(body)
    if (res.data) {
      listQdKq = res.data?.content;
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Kết quả lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ kết quả', 'Số biên bản', 'Mã thông báo'],
        dataColumn: ['soQdKq', 'soBienBan', 'maThongBao'],
        dataTable: listQdKq
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeKqBdg(data.id);
      }
    });
  }

  async onChangeKqBdg(id) {
    if (id > 0) {
      await this.qdPdKetQuaBanDauGiaService.getDetail(id)
        .then(async (resKq) => {
          const dataKq = resKq.data;
          let resTtin = await this.thongTinDauGiaService.getDetail(dataKq.maThongBao?.split('/')[0])
          this.dataTable = resTtin.data?.children
          this.setListDviTsan();
          this.formData.patchValue({
            soQdKq: dataKq.soQdKq,
            ngayKyQdKq: dataKq.ngayKy,
            soQdPd: dataKq.soQdPd,
          })
          // const dataDtl = res.data;
          // this.dataTable = dataDtl.listTtinDg
          // if (dataDtl) {
          //   await this.thongTinDauGiaService.getDetail(dataDtl.idQdHdr).then(async (hdr) => {
          //     const dataHdr = hdr.data;
          //     this.formData.patchValue({
          //       soQdPd: dataHdr.soQdPd,
          //       nam: dataHdr.nam,
          //       trangThai: dataDtl.trangThai,
          //       tenTrangThai: dataDtl.tenTrangThai,
          //       tenDvi: dataDtl.tenDvi,
          //       tenCloaiVthh: dataHdr.tenCloaiVthh,
          //       tenLoaiVthh: dataHdr.tenLoaiVthh,
          //     })
          //   })
          // }
        })
    }
    // if (data) {
    //   let res = await this.thongTinDauGiaService.getDetail(data);
    //   console.log("🚀 ~ onChangeKqBdg ~ res", res)
    // }
  }


  setListDviTsan() {
    this.listDviTsan = [];
    this.dataTable.forEach((item) => {
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({ maDviTsan: key, children: value })).value();
      item.dataDviTsan = dataGroup;
      item.dataDviTsan.forEach(x => {
        x.soLanTraGia = x.children[0].soLanTraGia
        x.donGiaTraGia = x.children[0].donGiaTraGia
        x.toChucCaNhan = x.children[0].toChucCaNhan
        if (x.soLanTraGia) {
          this.listDviTsan = [...this.listDviTsan, x];
        }
      })
    })

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


  isDisabled() {
    return false;
  }

  getNameFile($event) {

  }

  filterDataDviTsan(item) {
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      let maDviFirst = this.formData.value.listMaDviTsan[0];
      const data = this.listDviTsan.filter(x => {
        return x.maDviTsan == maDviFirst
      })[0];
      if (data.toChucCaNhan == item.toChucCaNhan) {
        return false
      } else {
        return true
      }
    }
    return false
  }
}

