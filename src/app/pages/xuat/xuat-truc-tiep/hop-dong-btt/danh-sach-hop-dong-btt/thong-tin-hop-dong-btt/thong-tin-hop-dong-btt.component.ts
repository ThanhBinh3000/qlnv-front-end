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
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-thong-tin-hop-dong-btt',
  templateUrl: './thong-tin-hop-dong-btt.component.html',
  styleUrls: ['./thong-tin-hop-dong-btt.component.scss']
})
export class ThongTinHopDongBttComponent extends Base2Component implements OnInit {
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

  maHopDongSuffix: string = '';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongBttService);
    this.formData = this.fb.group(
      {
        id: [],
        namHd: [dayjs().get('year')],
        soQdKq: [null, [Validators.required]],
        ngayKyQdKq: [null,],
        ngayMkho: [],
        soQdPd: [null, [Validators.required]],
        maDviTsan: [],

        soHd: [null, [Validators.required]],
        tenHd: [null, [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        ghiChuNgayHluc: [null],

        loaiHdong: [],
        ghiChuLoaiHdong: [],

        tgianThienHd: [],
        thoiGianDuKien: [],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        ghiChuTgianGnhan: [],
        noiDungHdong: [],
        dkienHanTtoan: [],

        maDvi: [],
        tenDvi: [],
        diaChi: [],
        mst: [],
        tenNguoiDdien: [],
        chucVu: [],
        sdt: [],
        fix: [],
        stk: [],
        moLai: [],
        ttinGiayUyQuyen: [],

        tenDviMua: [''],
        diaChiDviMua: [],
        mstDviMua: [],
        tenNguoiDdienDviMua: [],
        chucVuDviMua: [''],
        sdtDviMua: [''],
        faxDviMua: [''],
        stkDviMua: [''],
        moLaiDviMua: [''],

        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        dviTinh: [''],
        soLuong: [''],
        tongTien: [''],
        ghiChu: [''],
        gtriHdSauVat: [''],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],



        thongBaoKh: []
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
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
      namKh: this.formData.value.namHd,
      maDvi: this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.qdPdKetQuaBttService.search(body)
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
        dataHeader: ['Số QĐ kết quả', 'Loại hàng hóa', 'Chủng loại hành hóa'],
        dataColumn: ['soQdKq', 'tenLoaiVthh', 'tenCloaiVthh'],
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
      await this.qdPdKetQuaBttService.getDetail(id)
        .then(async (resKq) => {
          const dataKq = resKq.data;
          let resTtin = await this.quyetDinhPdKhBanTrucTiepService.getDetail(dataKq.idHdr);
          if (resKq.data) {
            const dataThongTin = resTtin.data;
            this.dataTable = dataThongTin.children;
            console.log(dataThongTin.children, 7777)
            this.formData.patchValue({
              soQdKq: dataKq.soQdKq,
              ngayMkho: dataKq.ngayMkho,
              ngayKyQdKq: dataKq.ngayKy,
              soQdPd: dataThongTin.soQdPd,
              loaiVthh: dataThongTin.loaiVthh,
              tenLoaiVthh: dataThongTin.tenLoaiVthh,
              cloaiVthh: dataThongTin.cloaiVthh,
              tenCloaiVthh: dataThongTin.tenCloaiVthh,
              moTaHangHoa: dataThongTin.moTaHangHoa,
              dviTinh: "kg",
              soLuong: dataThongTin.tongSoLuong * 1000,
              donGiaVat: dataThongTin.donGia + (dataThongTin.donGia * dataThongTin.thueGtgt / 100),
            });
            this.listDviLquan = dataThongTin.xhTcTtinBttList;

          }
        })
    }
  }


  changeDviCungCap($event: any) {
    let dViCc = this.listDviLquan.find(s => s.id === $event);
    if (dViCc) {
      this.formData.patchValue({
        tenDviMua: dViCc.tochucCanhan,
        diaChiDviMua: dViCc.diaDiemChaoGia,
        mstDviMua: dViCc.mst,
        // nccTenNguoiDdien: nccData.canhanTochuc,
        sdtDviMua: dViCc.sdt,
        // nccSdt: nccData.sdt,
        // nccFax: nccData.canhanTochuc,
        // nccStk: nccData.canhanTochuc,
        // nccMoTai: nccData.canhanTochuc,
        // nccThongTinGiayUyQuyen: nccData.canhanTochuc,
      })
    }
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

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }
}

