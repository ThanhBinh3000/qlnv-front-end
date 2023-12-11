import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { API_STATUS_CODE } from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { CanCuXacDinh, FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { DatePipe } from '@angular/common';
import {STATUS} from "../../../../../constants/status";
import {QuyetDinhPheDuyetKeHoachMTTService} from "../../../../../services/quyet-dinh-phe-duyet-ke-hoach-mtt.service";
import {ChaogiaUyquyenMualeService} from "../../../../../services/chaogia-uyquyen-muale.service";
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {
  DialogThemMoiBangKeThuMuaLeComponent
} from "../../../../../components/dialog/dialog-them-moi-bang-ke-thu-mua-le/dialog-them-moi-bang-ke-thu-mua-le.component";
import {
  QuyetDinhGiaoNvNhapHangService
} from "../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service";

@Component({
  selector: 'app-themmoi-qd-kh-uy-quyen-mua-le',
  templateUrl: './themmoi-qd-kh-uy-quyen-mua-le.component.html',
  styleUrls: ['./themmoi-qd-kh-uy-quyen-mua-le.component.scss']
})

export class ThemmoiQdKhUyQuyenMuaLeComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Input() isViewOnModal: boolean;
  @Input()
  isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  dataChiTieu: any;
  maTrinh: string = '';
  listNguonVon: any[] = [];

  canCuKhacList: CanCuXacDinh[] = [];
  listChiCuc: any[] = [];
  addModelCoSo: any = {
    moTa: '',
    taiLieu: [],
  };
  taiLieuDinhKemList: any[] = [];
  listDataGroup: any[] = [];
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
  isHopDong: boolean = false;
  idQdGnvu: any


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaogiaUyquyenMualeService);
    this.formData = this.fb.group({
      id: [],
      idQdDtl: [],
      namKh: ['',[Validators.required]],
      soQd: ['', [Validators.required]],
      maDvi: [''],
      tenDvi: ['', [Validators.required]],
      pthucMuaTrucTiep: [''],
      diaDiemChaoGia: [],
      ngayMkho: [null, [Validators.required]],
      ngayMua: [null, [Validators.required]],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: ['', [Validators.required]],
      tenCloaiVthh: ['', [Validators.required]],
      moTaHangHoa: [''],
      trangThai: [STATUS.CHUA_CAP_NHAT],
      tenTrangThai: ['Chưa cập nhật'],
      ghiChuChaoGia: [''],
      thoiGianDeXuatMtt: [],
      thoiGianPdMtt: [],
      donGiaThiTruong: [],
      ngayHluc: [],
      ngayPduyet: [],
      trichYeu: [],
      donGiaVat: [],
      giaMua: [],
      tchuanCluong: [],
      ptMua: [],
      tongMucDt: [],
      thueGtgt: [],
      ghiChu: [],
      donGia: [],
      tgianKthuc: [],
      tgianMkho: [],
      tenPthucMuaTrucTiep: [],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    if (this.idInput > 0) {
      console.log(this.idInput)
      await this.loadDetail(this.idInput);
    }
    await this.spinner.hide();
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(id)
        .then(async (res) => {
          const dataDtl = res.data;
          console.log(dataDtl, 123)
          // this.danhSachCtiet = dataDtl.children.length > 0 ? dataDtl.children : dataDtl.children2
          this.formData.patchValue({
            idQdDtl: id,
            soQd: dataDtl.hhQdPheduyetKhMttHdr.isChange ? dataDtl.hhQdPheduyetKhMttHdr.soQdDc : dataDtl.hhQdPheduyetKhMttHdr.soQd,
            trangThai: dataDtl.trangThai,
            tenTrangThai: dataDtl.tenTrangThai,
            tenCloaiVthh: dataDtl.hhQdPheduyetKhMttHdr.tenCloaiVthh,
            cloaiVthh: dataDtl.hhQdPheduyetKhMttHdr.cloaiVthh,
            tenLoaiVthh: dataDtl.hhQdPheduyetKhMttHdr.tenLoaiVthh,
            loaiVthh: dataDtl.hhQdPheduyetKhMttHdr.loaiVthh,
            moTaHangHoa: dataDtl.hhQdPheduyetKhMttHdr.moTaHangHoa,
            ngayPduyet: dataDtl.hhQdPheduyetKhMttHdr.ngayPduyet,
            ngayHluc: dataDtl.hhQdPheduyetKhMttHdr.ngayHluc,
            diaDiemChaoGia: dataDtl.diaDiemChaoGia,
            ngayMkho: dataDtl.ngayMkho,
            ngayMua: dataDtl.ngayMua,
            trichYeu: dataDtl.trichYeu,
            tenDvi: dataDtl.tenDvi,
            tenDuAn: dataDtl.tenDuAn,
            tongMucDt: dataDtl.tongMucDt,
            tenNguonVon: dataDtl.tenNguonVon,
            tenPthucMuaTrucTiep: dataDtl.tenPthucMuaTrucTiep,
            pthucMuaTrucTiep: dataDtl.pthucMuaTrucTiep,
            tchuanCluong: dataDtl.hhQdPheduyetKhMttHdr.tchuanCluong,
            donGiaVat: dataDtl.children.length > 0 ? dataDtl.children[0]?.donGia : dataDtl.children2[0]?.donGia,
            donGia: dataDtl.children.length > 0 ? Math.round(dataDtl.children[0]?.donGia - (dataDtl.children[0]?.donGia * dataDtl.thueGtgt / 100)) : Math.round(dataDtl.children2[0]?.donGia - (dataDtl.children2[0]?.donGia * dataDtl.thueGtgt / 100)),
            tgianMkho: dataDtl.tgianMkho,
            tgianKthuc: dataDtl.tgianKthuc,
            thueGtgt: dataDtl.thueGtgt,
            ghiChu: dataDtl.ghiChu,
            namKh: dataDtl.namKh
          })
          this.idQdGnvu = dataDtl.hhQdPheduyetKhMttHdr.idQdGnvu
          this.canCuKhacList = dataDtl.hhQdPheduyetKhMttHdr.fileDinhKems
          this.listChiCuc = dataDtl.children.length > 0 ? dataDtl.children : dataDtl.children2;
          this.dataTable = this.listChiCuc.filter(x => x.maDvi == this.userInfo.MA_DVI)
          // this.radioValue = dataDtl.pthucMuaTrucTiep ? dataDtl.pthucMuaTrucTiep : '01'
          // this.fileDinhKemUyQuyen = dataDtl.fileDinhKemUyQuyen;
          // this.fileDinhKemMuaLe = dataDtl.fileDinhKemMuaLe;
          // this.showDetail(event,this.danhSachCtiet[0]);
          console.log(this.dataTable)
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  convertTien(data: any){
    return convertTienTobangChu(data);
  }
  redirectHopDong(){
    let elem = document.getElementById('muatt');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[1];
    setActive.classList.add('ant-menu-item-selected');
    this.isHopDong = true
    this.idSelected = this.formData.value.idQdDtl
  }
  async themMoiBangKeMuaLe($event, data?: null, index?: number) {
    let res = await this.quyetDinhGiaoNvNhapHangService.getDetail(this.idQdGnvu);
    console.log(res.data, 5555);
    const modalGT = this.modal.create({
      nzTitle: 'THÊM BẢNG KÊ',
      nzContent: DialogThemMoiBangKeThuMuaLeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: { top: '200px' },
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data ? data : res.data,
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        this.dataTable.push(data);
      }
    });
  };

}
