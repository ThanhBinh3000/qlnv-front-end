import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
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
import {
  QuyetDinhGiaoNvNhapHangService
} from "../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service";
@Component({
  selector: 'app-themmoi-hopdong-phuluc',
  templateUrl: './themmoi-hopdong-phuluc.component.html',
  styleUrls: ['./themmoi-hopdong-phuluc.component.scss']
})

export class ThemmoiHopdongPhulucComponent extends Base2Component implements OnChanges {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idKqMtt: number;
  @Input() isQuanLy: boolean;
  @Input() idQdKh: number;

  @Output()
  showListEvent = new EventEmitter<any>();
  cacChiCucHopDong: ChiTietCacChiCucHopDong;
  listLoaiHopDong: any[] = [];
  listDviLquan: any[] = [];
  dataTablePhuLuc: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  idKqCgia: number;
  slChuaKy: number = 0;
  slDaKy: number = 0;
  loaiHd: any;

  maHopDongSuffix: string = '';
  objHopDongHdr: any = {};
  dviCungCap: any;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinPhuLucHopDongService: MttHopDongPhuLucHdService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
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
        soQdKq: [''],
        ngayKyQdKq: [''],
        ngayMkho: [''],
        soQd: [''],
        idDviBan: [''],


        soHd: [''],
        tenHd: [''],
        ngayHluc: [''],
        ghiChuNgayHluc: [null],

        loaiHdong: [''],
        ghiChuLoaiHdong: [],
        tgianThienHd: [''],
        thoiGianDuKien: [''],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        ghiChuTgianGnhan: [],
        noiDungHdong: [''],
        dkienHanTtoan: [''],

        maDvi: [],
        tenDvi: [''],
        diaChi: [''],
        mst: [''],
        tenNguoiDdien: [''],
        chucVu: [''],
        sdt: [''],
        fax: [''],
        stk: [''],
        moLai: [''],
        ttinGiayUyQuyen: [''],

        tenDviBan: [''],
        diaChiDviBan: [],
        mstDviBan: [''],
        tenNguoiDdienDviBan: [''],
        chucVuDviBan: [''],
        sdtDviBan: [''],
        faxDviBan: [''],
        stkDviBan: [''],
        moLaiDviBan: [''],

        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        dviTinh: [''],
        soLuong: [],
        thanhTien: [],
        ghiChu: [''],

        tongSoLuongQdKhChuakyHd: [],
        tongSoLuongQdKhDakyHd: [],
        donGia: [],
        donGiaGomThue: [],
        trangThai: STATUS.DU_THAO,
        tenTrangThai: ['Dự thảo'],
        fileName: [],
        dviCungCap: [''],
        tongSoLuongQdKh: [],
        idKqCgia: [''],
        idQdKh: [''],
        soQdKh: [''],
        idQdPdSldd: [''],
        idQdGiaoNvNh: [''],
        soQdGiaoNvNh: [''],
      }
    );
  }

  async ngOnChanges() {
    this.formData.value.namHd = dayjs().get('year');
    this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.idQdKh) {
      await this.onChangeQdKh(this.idQdKh);
    }
    if (this.id) {
      await this.loadChiTiet(this.id);
    } else {
      this.initForm();
    }
    if (this.idKqMtt) {
      await this.onChangeKqMTT(this.idKqMtt);
    }

  }

  // async ngOnInit() {
  //   this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
  //   await Promise.all([
  //     this.loadDataComboBox()
  //   ]);
  //   if (this.idKqMtt) {
  //     await this.onChangeKqMTT(this.idKqMtt);
  //   }
  //   if (this.id) {
  //     await this.loadChiTiet(this.id);
  //   } else {
  //     this.initForm();
  //   }
  // }
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
    let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soHd: data.soHd != null ? data.soHd.split('/')[0] : "",
      thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null,
      idDviBan: data.idKqCgia,
      dviCungCap: data.dviCungCap,
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChi: this.userInfo.DON_VI.diaChi ?? null,
      namHd: dayjs().get('year'),
      id: data.id,
      idKqCgia: data.idKqCgia,
      soQdKh: data?.hhQdPheduyetKhMttHdr?.soQd,
      idQdPdSldd: data.idQdPdSldd
    })
    this.idKqCgia = data.idKqCgia;
    this.dataTable = data.qdGiaoNvuDtlList.length > 0 ? data.qdGiaoNvuDtlList.filter(x => x.maDvi.includes(this.userInfo.MA_DVI)) : data.children;
    console.log(this.dataTable, 333)
    this.dataTablePhuLuc = data.phuLucDtl;
    this.objHopDongHdr = data;
    this.fileDinhKem = data.fileDinhKems;
  }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if(this.validateSlKyHd()){
      this.notification.error(MESSAGE.ERROR, 'Số lượng ký hợp đồng phải bằng số lượng nhập trực tiếp');
      return;
    }
    if(this.loaiHd == '02'){
      let dataQd = await this.quyetDinhGiaoNvNhapHangService.getDetail(this.formData.value.idQdGiaoNvNh)
      if(dataQd.data.trangThai != STATUS.BAN_HANH){
        this.notification.error(MESSAGE.ERROR, 'Quyết định giao nhiệm vụ nhập hàng chưa được ban hành!');
        return;
      }
    }
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
        // this.goBack()
      }
    }
  }

  validateSlKyHd(){
    console.log(this.dataTable, "this.dataTable")
    let sumSlKyHd = 0;
    let sumSlNhapTt = 0;
    this.dataTable.forEach(item =>{
      item.children.forEach(x =>{
        sumSlKyHd += Number.parseInt(x.soLuongHd)
        sumSlNhapTt += x.soLuong
      })
    })
    console.log(sumSlKyHd, "1")
    console.log(sumSlNhapTt, "2")
    if(sumSlKyHd > sumSlNhapTt || sumSlKyHd < sumSlNhapTt){
      return true;
    }
  }


  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.id);
  }

  async openDialogQdKh() {
    this.spinner.show()
    let listQdKh: any[] = [];
    let body = {
      pthucMuaTrucTiep: '02',
      trangThai: STATUS.HOAN_THANH_CAP_NHAT
    };
    let res = await this.chaogiaUyquyenMualeService.search(body)
    if (res.data) {
      listQdKh = res.data?.content;
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
        dataHeader: ['Số QĐ kế hoạch', 'Tên loại hàng hóa', 'Tên chủng loại vật tư hàng háo'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
        dataTable: listQdKh
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeQdKh(data.id);
      }
    });
  }

  async onChangeQdKh(id) {
    if (id > 0) {
      await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(id)
        .then(async (resKq) => {
          const dataKq = resKq.data;
          // let resTtin = await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(dataKq.idPdKhDtl);
          if (dataKq) {
            // const dataThongTin = resTtin.data;
            // this.dataTable = dataKq.danhSachCtiet;
            this.formData.patchValue({
              idQdKh: dataKq.idQdHdr,
              soQdKh: dataKq.soQd,
              idQdGiaoNvNh: dataKq.hhQdPheduyetKhMttHdr.idQdGnvu,
              soQdGiaoNvNh: dataKq.hhQdPheduyetKhMttHdr.soQdGnvu,
              soQd: dataKq.hhQdPheduyetKhMttHdr.soQdGnvu,
              ngayMkho: dataKq.ngayMkho,
              ngayKyQdKq: dataKq.ngayKy,
              loaiVthh: dataKq.loaiVthh,
              tenLoaiVthh: dataKq.tenLoaiVthh,
              cloaiVthh: dataKq.cloaiVthh,
              tenCloaiVthh: dataKq.tenCloaiVthh,
              moTaHangHoa: dataKq.moTaHangHoa,
              dviTinh: "tấn",
            });
            this.loaiHd = '02'
            this.dataTable = dataKq.children.filter(x => x.maDvi == this.userInfo.MA_DVI)
            // dataKq.danhSachCtiet.forEach((item) => {
            //   item.listChaoGia.forEach(res => {
            //     if (res.luaChon == true) {
            //       this.listDviLquan.push(res)
            //     }
            //   })
            // })
          }
        })
    }
  }

  async openDialogKqMTT() {
    this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namHd,
      maDvi: this.userInfo.MA_DVI
    };
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
        await this.onChangeKqMTT(data.id);
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
            this.slDaKy = 0;
            this.slChuaKy = 0;
            this.listDviLquan = [];
            dataKq.danhSachCtiet.forEach((item) => {
              item.listChaoGia.forEach(res =>{
                if (res.luaChon == true && res.signed != true) {
                  this.listDviLquan.push(res)
                  this.slChuaKy += res.soLuong
                }else if(res.luaChon == true && res.signed == true){
                  this.slDaKy += item.children.find(x => x.idDiaDiem == res.idQdPdKqSldd).soLuongHd
                }
              })
            })
            console.log(dataKq.danhSachCtiet, "hihihi")
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
              tongSoLuongQdKhChuakyHd: this.slChuaKy,
              tongSoLuongQdKhDakyHd: this.slDaKy,
              dviTinh: "tấn",
              tongSoLuongQdKh: dataThongTin.tongSoLuong
            });
            if(this.idKqCgia){
              this.changeDviCungCap(this.idKqCgia)
            }
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
    if (!this.isQuanLy && this.formData.value.trangThai == STATUS.DU_THAO) {
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
        // idDviMua: dViCc.id,
        tenDviBan: dViCc.canhanTochuc,
        diaChiDviBan: dViCc.diaChi,
        mstDviBan: dViCc.mst,
        soLuong: dViCc.soLuong,
        dviCungCap: dViCc.dviCungCap,
        donGia: dViCc.donGia,
        donGiaGomThue: dViCc.donGia + (dViCc.donGia * dViCc.thueGtgt / 100),
        sdtDviBan: dViCc.sdt,
        thanhTien: Math.round(dViCc.soLuong * dViCc.donGia * 1000),
      })
    }
  }

  onSoLuongHdChange(item: any, newValue: number) {
    console.log(item, "item")
    console.log(newValue, "newValue")
  }



}


