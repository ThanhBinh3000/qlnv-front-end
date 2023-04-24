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
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { STATUS } from 'src/app/constants/status';
import { chain, cloneDeep } from 'lodash';
@Component({
  selector: 'app-thong-tin-hop-dong-btt',
  templateUrl: './thong-tin-hop-dong-btt.component.html',
  styleUrls: ['./thong-tin-hop-dong-btt.component.scss']
})
export class ThongTinHopDongBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idKqBtt: number;
  @Input() idQdPdKh: number;
  @Input() isQuanLy: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();
  listLoaiHopDong: any[] = [];
  dataTablePhuLuc: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  maHopDongSuffix: string = '';
  objHopDongHdr: any = {};
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];

  ListTccnChaoGia: any[] = [];

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
        idQdKq: [],
        soQdKq: [''],
        ngayKyQdKq: [''],
        ngayMkho: [''],
        ngayKyQdPd: [''],
        soQdPd: [''],
        maDviTsan: [''],
        loaiHinhNx: [''],
        kieuNx: [''],
        soHd: [''],
        tenHd: [''],
        ngayHluc: [''],
        ghiChuNgayHluc: [''],
        loaiHdong: [''],
        tenLoaiHdong: [''],
        ghiChuLoaiHdong: [''],
        tgianThienHd: [],
        thoiGianDuKien: [''],
        tgianGnhanTu: [''],
        tgianGnhanDen: [''],
        ghiChuTgianGnhan: [''],
        noiDungHdong: [''],
        dkienHanTtoan: [''],
        maDvi: [''],
        tenDvi: [''],
        diaChiDvi: [''],
        mst: [''],
        tenNguoiDdien: [''],
        chucVu: [''],
        sdt: [''],
        fax: [''],
        stk: [''],
        moTai: [''],
        ttinGiayUyQuyen: [''],
        idDviMua: [],
        tenDviMua: [''],
        diaChiDviMua: [''],
        mstDviMua: [''],
        tenNguoiDdienDviMua: [''],
        chucVuDviMua: [''],
        sdtDviMua: [''],
        faxDviMua: [''],
        stkDviMua: [''],
        moTaiDviMua: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        soLuongBanTrucTiep: [],
        thanhTien: [],
        ghiChu: [''],
        tongSlXuatBanQdKh: [],
        tongSlBanttQdkhDakyHd: [],
        tongSlBanttQdkhChuakyHd: [],
        trangThai: STATUS.DU_THAO,
        tenTrangThai: ['Dự thảo'],
        listMaDviTsan: [],
      }
    );
  }


  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox(),
      this.loadDsVthh(),
    ]);
    if (this.id) {
      await this.loadChiTiet(this.id);
    } else {
      this.initForm();
    }
    if (this.idKqBtt) {
      this.onChangeKqBTT(this.idKqBtt);
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
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
    // loại hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.spinner.hide();
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  // async loadDsHd() {
  //   let body = {
  //     soQdKq: this.formData.value.soQdKq,
  //     trangThai: STATUS.DA_KY,
  //     loaiVthh: this.loaiVthh,
  //   }
  //   let res = await this.hopDongBttService.search(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     let data = res.data;
  //     this.listHdDaKy = data.content;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soHd: data.soHd.split('/')[0],
      thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
    })
    this.dataTable = cloneDeep(data.children);
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

  async openDialogKqBTT() {
    this.spinner.show()
    let listQdKq: any[] = [];
    if (this.userService.isCuc()) {
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
        nzTitle: 'THÔNG TIN QUYẾT ĐỊNH PHÊ DUYỆT KẾT QUẢ CHÀO GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataHeader: ['Số QĐ PD KQ chào giá', ' Loại hàng hóa', 'Chủng loại hàng hóa'],
          dataColumn: ['soQdKq', 'tenLoaiVthh', 'tenCloaiVthh'],
          dataTable: listQdKq
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.onChangeKqBTT(data.id);
        }
      });
    }
  }

  async onChangeKqBTT(id) {
    if (id > 0) {
      await this.qdPdKetQuaBttService.getDetail(id)
        .then(async (resKq) => {
          const dataKq = resKq.data;
          if (resKq.data) {
            this.ListTccnChaoGia.push(dataKq.children)
            this.formData.patchValue({
              idQdKq: dataKq.id,
              soQdKq: dataKq.soQdKq,
              ngayMkho: dataKq.ngayMkho,
              ngayKyQdKq: dataKq.ngayKy,
              soQdPd: dataKq.soQdPd,
              loaiHinhNx: dataKq.loaiHinhNx,
              kieuNx: dataKq.kieuNx,
              loaiVthh: dataKq.loaiVthh,
              tenLoaiVthh: dataKq.tenLoaiVthh,
              cloaiVthh: dataKq.cloaiVthh,
              tenCloaiVthh: dataKq.tenCloaiVthh,
              moTaHangHoa: dataKq.moTaHangHoa,
              trichYeu: dataKq.trichYeu,
            });
            this.formData.patchValue({
              dviTinh: this.listHangHoaAll.find(s => s.ma == dataKq.loaiVthh,)?.maDviTinh
            })
          }
        })
    }
  }

  setListTccnChaoGia() {
    let listCntc: any[] = [];
    this.ListTccnChaoGia.forEach((item) => {
      item.children.forEach((child) => {
        listCntc = child.children
      })
    })
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN QUYẾT ĐỊNH PHÊ DUYỆT KẾT QUẢ CHÀO GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ PD KQ chào giá', ' Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['tochucCanhan', 'tenLoaiVthh', 'tenCloaiVthh'],
        dataTable: listCntc
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeKqBTT(data.id);
      }
    });

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

  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.id);
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


  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }


  // setListDviTsan(inputTable) {
  //   this.listDviTsan = [];
  //   inputTable.forEach((item) => {
  //     let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({ maDviTsan: key, children: value })).value();
  //     item.dataDviTsan = dataGroup;
  //     item.dataDviTsan.forEach(x => {
  //       if (x.maDviTsan) {
  //         x.tenDvi = item.tenDvi
  //         x.maDvi = item.maDvi
  //         x.diaChi = item.diaChi
  //         x.donGiaVat = item.donGiaVat
  //         x.children.forEach(s => {
  //           x.soLuongChiCuc = s.soLuong;
  //         })
  //         this.listDviTsan = [...this.listDviTsan, x];
  //       }
  //     })
  //   })
  // }

  // selectMaDviTsan() {
  //   if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
  //     this.listDviLquan = []
  //     this.dataTable = [];
  //     let listAll = this.listDviTsan.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
  //     let as = [];
  //     listAll.forEach(s => {
  //       if (this.dataTable && this.dataTable.length > 0) {
  //         this.dataTable.forEach(y => {
  //           /// Check nếu cùng 1 mã đơn vị thì sẽ push chung vào 1 children của mã đơn vị ấy
  //           if (y.maDvi == s.maDvi) {
  //             y.children = [...y.children, ...s.children]
  //           } else {
  //             this.dataTable = [...this.dataTable, s]
  //           }
  //         })
  //       } else {
  //         this.dataTable = [...this.dataTable, s]
  //       }
  //       s.children.forEach(s1 => as = [...as, s1])
  //     });
  //     as.forEach(s => {
  //       s.children.forEach(s1 => {
  //         if (s1.luaChon == true) {
  //           this.listDviLquan.push(s1);
  //         }
  //       })
  //     })
  //   }
  // }

  // changeDviCungCap($event: any) {
  //   let dViCc = this.listDviLquan.find(s => s.id === $event);
  //   if (dViCc) {
  //     this.formData.patchValue({
  //       idDviMua: dViCc.id,
  //       tenDviMua: dViCc.tochucCanhan,
  //       diaChiDviMua: dViCc.diaDiemChaoGia,
  //       mstDviMua: dViCc.mst,
  //       soLuong: dViCc.soLuong,
  //       donGia: dViCc.donGia,
  //       donGiaGomThue: dViCc.donGia + (dViCc.donGia * dViCc.thueGtgt / 100),
  //       sdtDviMua: dViCc.sdt,
  //       thanhTien: dViCc.soLuong * dViCc.donGia,
  //       tongSoLuongQdKhChuaky: this.formData.value.tongSoLuongQdKh - dViCc.soLuong
  //     })
  //   }
  // }

}


