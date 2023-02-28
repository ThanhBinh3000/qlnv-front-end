import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
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
  @Input() idKqBtt: number;
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
  objHopDongHdr: any = {};
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
        idQdKq: [],
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

        idDviMua: [],
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
        donGiaGomThue: [''],
        donGia: [''],
        ghiChu: [''],
        soLuongQdChuaKy: [''],
        trangThai: STATUS.DU_THAO,
        tenTrangThai: ['Dự thảo'],
        thongBaoKh: [],
        tongTien: []
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.id) {
      await this.loadChiTiet(this.id);
    } else {
      this.initForm();
      if (this.idKqBtt) {
        this.onChangeKqBdg(this.idKqBtt);
      }
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChi: this.userInfo.DON_VI.diaChi ?? null,
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
      soHd: data.soHd.split('/')[0],
      thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
    })
    this.dataTable = data.children;
    this.dataTablePhuLuc = data.phuLuc;
    this.objHopDongHdr = data;
  }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soHd = this.formData.value.soHd + this.maHopDongSuffix;
    if (this.formData.get('thoiGianDuKien').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
    }
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
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.qdPdKetQuaBttService.search(body)
    if (res.data) {
      listQdKq = res.data?.content;
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Kết quả chào giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ kết quả chào giá', 'Tên loại hàng hóa', 'Tên chủng loại vật tư hàng háo'],
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
          let resTtin = await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(dataKq.idPdKhDtl);
          if (resKq.data) {
            const dataThongTin = resTtin.data;
            let hdr = await this.quyetDinhPdKhBanTrucTiepService.getDetail(dataThongTin.idQdHdr);
            if (hdr.data) {
              const dataHdr = hdr.data;
              this.dataTable = dataHdr.children;
              this.formData.patchValue({
                idQdKq: dataKq.id,
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
                donGiaVat: dataThongTin.donGia + (dataThongTin.donGia * dataThongTin.thueGtgt / 100),
              });
              this.listDviLquan = dataThongTin.xhTcTtinBttList;
            }

          }
        })
    }
  }

  changeDviCungCap($event: any) {
    let dViCc = this.listDviLquan.find(s => s.id === $event);
    if (dViCc) {
      this.formData.patchValue({
        idDviMua: dViCc.id,
        tenDviMua: dViCc.tochucCanhan,
        diaChiDviMua: dViCc.diaDiemChaoGia,
        mstDviMua: dViCc.mst,
        soLuong: dViCc.soLuong,
        donGia: dViCc.donGia,
        donGiaGomThue: dViCc.donGia + (dViCc.donGia * dViCc.thueGtgt / 100),
        sdtDviMua: dViCc.sdt,
        tongTien: dViCc.soLuong * dViCc.donGia
      })
    }
  }

  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  async deletePhuLuc(data) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: data.id
          };
          this.hopDongBttService.delete(body).then(async () => {
            this.loadChiTiet(this.id);
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
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


  async redirectHopDong() {
  }



}

