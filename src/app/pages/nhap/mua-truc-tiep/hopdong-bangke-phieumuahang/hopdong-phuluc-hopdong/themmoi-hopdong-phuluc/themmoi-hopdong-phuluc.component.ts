import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { STATUS } from 'src/app/constants/status';
import { ChiTietCacChiCucHopDong } from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import { MttHopDongPhuLucHdService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/MttHopDongPhuLucHdService.service';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
@Component({
  selector: 'app-themmoi-hopdong-phuluc',
  templateUrl: './themmoi-hopdong-phuluc.component.html',
  styleUrls: ['./themmoi-hopdong-phuluc.component.scss']
})

export class ThemmoiHopdongPhulucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idKqMtt: number;
  @Input() isQuanLy: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();
  cacChiCucHopDong: ChiTietCacChiCucHopDong;
  listLoaiHopDong: any[] = [];
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
    private thongTinPhuLucHopDongService: MttHopDongPhuLucHdService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinPhuLucHopDongService);
    this.formData = this.fb.group(
      {
        id: [],
        idQdKq: [],
        namHd: [dayjs().get('year')],
        soQdKq: ['', [Validators.required]],
        ngayKyQdKq: [''],
        ngayMkho: [''],
        soQd: [''],
        idDviMua: [null, [Validators.required]],


        soHd: ['', [Validators.required]],
        tenHd: ['', [Validators.required]],
        ngayHluc: ['', [Validators.required]],
        ghiChuNgayHluc: [null],

        loaiHdong: ['', [Validators.required]],
        ghiChuLoaiHdong: [],
        tgianThienHd: ['', [Validators.required]],
        thoiGianDuKien: ['', [Validators.required]],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        ghiChuTgianGnhan: [],
        noiDungHdong: ['', [Validators.required]],
        dkienHanTtoan: ['', [Validators.required]],

        maDvi: [],
        tenDvi: ['', [Validators.required]],
        diaChi: ['', [Validators.required]],
        mst: ['', [Validators.required]],
        tenNguoiDdien: ['', [Validators.required]],
        chucVu: ['', [Validators.required]],
        sdt: ['', [Validators.required]],
        fax: ['', [Validators.required]],
        stk: ['', [Validators.required]],
        moLai: ['', [Validators.required]],
        ttinGiayUyQuyen: ['', [Validators.required]],

        tenDviMua: [''],
        diaChiDviMua: [],
        mstDviMua: ['', [Validators.required]],
        tenNguoiDdienDviMua: ['', [Validators.required]],
        chucVuDviMua: ['', [Validators.required]],
        sdtDviMua: [''],
        faxDviMua: ['', [Validators.required]],
        stkDviMua: ['', [Validators.required]],
        moLaiDviMua: ['', [Validators.required]],

        loaiVthh: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        moTaHangHoa: [''],
        dviTinh: [''],
        soLuong: [],
        thanhTien: [],
        ghiChu: [''],

        tongSoLuongQdKhChuakyHd: [],
        donGia: [],
        donGiaGomThue: [],
        trangThai: STATUS.DU_THAO,
        tenTrangThai: ['Dự thảo'],
        fileName: [],
        tongSoLuongQdKh: []
      }
    );
  }


  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.idKqMtt) {
      this.onChangeKqMTT(this.idKqMtt);
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
    this.fileDinhKem = data.fileDinhKems;
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
    body.fileDinhKems = this.fileDinhKem;
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

  async openDialogKqMTT() {
    this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namHd,
      maDvi: this.userInfo.MA_DVI
    };
  console.log(body)
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.search(body)
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
        this.onChangeKqMTT(data.id);
      }
    });
  }

  async onChangeKqMTT(id) {
    if (id > 0) {
      await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(id)
        .then(async (resKq) => {
          const dataKq = resKq.data;
          let resTtin = await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(dataKq.idPdKhDtl);
          if (resKq.data) {
            const dataThongTin = resTtin.data;
            this.dataTable = dataThongTin.children;

            this.formData.patchValue({
              idQdKq: dataKq.id,
              soQdKq: dataKq.soQdKq,
              ngayMkho: dataKq.ngayMkho,
              ngayKyQdKq: dataKq.ngayKy,
              soQd: dataKq.soQd,
              loaiVthh: dataKq.loaiVthh,
              tenLoaiVthh: dataKq.tenLoaiVthh,
              cloaiVthh: dataKq.cloaiVthh,
              tenCloaiVthh: dataKq.tenCloaiVthh,
              moTaHangHoa: dataKq.moTaHangHoa,
              dviTinh: "kg",
              tongSoLuongQdKh: dataThongTin.tongSoLuong * 1000
            });
            dataThongTin.listChaoGia.forEach((item) => {
              if (item.luaChon == true) {
                this.listDviLquan.push(item)
              }
            })
          }
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
          this.thongTinPhuLucHopDongService.delete(body).then(async () => {
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

  deleteRow(i: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable = this.dataTable.filter((item, index) => index != i);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }


  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  getNameFileQD($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }


  changeDviCungCap($event: any) {
    let dViCc = this.listDviLquan.find(s => s.id === $event);
    if (dViCc) {
      this.formData.patchValue({
        idDviMua: dViCc.id,
        tenDviMua: dViCc.canhanTochuc,
        diaChiDviMua: dViCc.diaChi,
        mstDviMua: dViCc.mst,
        soLuong: dViCc.soLuong,
        donGia: dViCc.donGia,
        donGiaGomThue: dViCc.donGia + (dViCc.donGia * dViCc.thueGtgt / 100),
        sdtDviMua: dViCc.sdt,
        thanhTien: dViCc.soLuong * dViCc.donGia,
        tongSoLuongQdKhChuakyHd: this.formData.value.tongSoLuongQdKh - dViCc.soLuong
      })
    }
  }

}


