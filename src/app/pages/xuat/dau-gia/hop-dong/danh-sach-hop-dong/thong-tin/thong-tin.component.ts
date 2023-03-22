import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { saveAs } from 'file-saver';
import { HopDongXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { chain } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-thong-tin',
  templateUrl: './thong-tin.component.html',
  styleUrls: ['./thong-tin.component.scss']
})

export class ThongTinComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idKqBdg: number;
  @Input() isQuanLy: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  listLoaiHopDong: any[] = [];
  listDviTsan: any[] = [];
  listDviLquan: any[] = [];
  dataTablePhuLuc: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  objHopDongHdr: any = {};
  maHopDongSuffix: string = '';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private danhMucService: DanhMucService
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
        tgianNkho: [],

        soHd: [null, [Validators.required]],
        tenHd: [null, [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        ghiChuNgayHluc: [null],

        loaiHdong: [],
        ghiChuLoaiHdong: [],

        tgianThienHd: [],
        tgianBhanh: [],

        maDvi: [],
        tenDvi: [],
        diaChi: [],
        mst: [],
        tenNguoiDdien: [],
        chucVu: [],
        sdt: [],
        stk: [],
        fax: [],
        moTai: [],

        tenNhaThau: [''],
        diaChiNhaThau: [],
        mstNhaThau: [],
        tenNguoiDdienNhaThau: [],
        chucVuNhaThau: [''],
        sdtNhaThau: [''],
        stkNhaThau: [''],

        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        dviTinh: [''],
        soLuong: [''],
        tongTien: [''],
        ghiChu: [''],
        gtriHdSauVat: [''],
        tenCloaiVthh: [''],
        tenLoaiVthh: [''],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],
        listMaDviTsan: []
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.idKqBdg) {
      this.onChangeKqBdg(this.idKqBdg);
    }
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

  async loadDataComboBox() {
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soHd: data.soHd.split('/')[0]
    })
    console.log(data);
    this.dataTable = data.children;

    // if (id > 0) {
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

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soHd = this.formData.value.soHd + this.maHopDongSuffix;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, this.STATUS.DA_KY, "Bạn có muốn ký hợp đồng ?")
      } else {
        this.goBack()
      }
    }
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
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.qdPdKetQuaBanDauGiaService.search(body)
    if (res.data) {
      listQdKq = res.data?.content;
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Quyết định phê duyệt kết quả bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ PDKQ BĐG', 'Số biên bản', 'Mã thông báo'],
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
          let resTtin = await this.thongTinDauGiaService.getDetail(dataKq.maThongBao?.split('/')[0]);
          if (resKq.data) {
            const dataThongTin = resTtin.data;
            this.setListDviTsan(dataThongTin.children);
            this.formData.patchValue({
              soQdKq: dataKq.soQdKq,
              ngayKyQdKq: dataKq.ngayKy,
              soQdPd: dataThongTin.soQdPd,
              loaiVthh: dataThongTin.loaiVthh,
              tenLoaiVthh: dataThongTin.tenLoaiVthh,
              cloaiVthh: dataThongTin.cloaiVthh,
              tenCloaiVthh: dataThongTin.tenCloaiVthh,
              moTaHangHoa: dataThongTin.moTaHangHoa
            });
            this.listDviLquan = dataThongTin.listNguoiTgia;
          }
        })
    }
  }

  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      item.children.forEach(element => {
        element.maChiCuc = item.maDvi
        element.tenChiCuc = item.tenDvi
        element.diaChi = item.diaChi
        element.donGiaVat = element.donGiaTraGia
      });
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({ maDviTsan: key, children: value })).value();
      item.dataDviTsan = dataGroup;
      item.dataDviTsan.forEach(x => {
        x.soLanTraGia = x.children[0].soLanTraGia
        x.donGiaTraGia = x.children[0].donGiaTraGia
        x.toChucCaNhan = x.children[0].toChucCaNhan
        x.tenDvi = item.tenDvi
        x.maDvi = item.maDvi
        if (x.soLanTraGia) {
          this.listDviTsan = [...this.listDviTsan, x];
        }
      })
      console.log(this.listDviTsan);
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

  selectMaDviTsan() {
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      this.dataTable = [];
      let ttDauThau
      let soLuong = 0;
      let tongTien = 0;
      this.formData.value.listMaDviTsan.forEach(x => {
        console.log(x);
        let item = this.listDviTsan.filter(item => item.maDviTsan == x)[0];
        console.log(item);
        item.children.forEach(element => {
          soLuong = soLuong + element.soLuong
          tongTien = tongTien + (element.soLuong * element.donGiaVat)
        });
        let tenNhaThau = item.toChucCaNhan;
        ttDauThau = this.listDviLquan.filter(item => item.hoVaTen == tenNhaThau);
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach(y => {
            /// Check nếu cùng 1 mã đơn vị thì sẽ push chung vào 1 children của mã đơn vị ý
            if (y.maDvi == item.maDvi) {
              y.children = [...y.children, ...item.children]
            } else {
              this.dataTable = [...this.dataTable, item]
            }
          })
        } else {
          this.dataTable = [...this.dataTable, item]
        }
      })
      this.formData.patchValue({
        soLuong: soLuong,
        tongTien: tongTien
      })
      if (ttDauThau && ttDauThau.length > 0) {
        this.formData.patchValue({
          tenNhaThau: ttDauThau[0].hoVaTen,
          diaChiNhaThau: ttDauThau[0].diaChi,
          mstNhaThau: ttDauThau[0].soCccd,

        })
      }
    }
  }
  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

}

