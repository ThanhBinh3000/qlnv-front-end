import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { FormArray, Validators } from "@angular/forms";
import { MESSAGE } from "../../../../../../../constants/message";
import * as dayjs from "dayjs";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { ThongtinDaugiaComponent } from './thongtin-daugia/thongtin-daugia.component';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia',
  templateUrl: './chi-tiet-thong-tin-dau-gia.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia.component.scss']
})
export class ChiTietThongTinDauGiaComponent extends Base2Component implements OnInit {
  //base init
  @Input() id: number;
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  fileDinhKem: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year"), [Validators.required]],
        soQdPd: [],
        maDvi: [],
        loaiVthh: [],
        tenLoaiVthh: [],
        cloaiVthh: [],
        tenCloaiVthh: [],

        idQdDcKh: [],
        soQdDcKh: [],
        idQdPdKq: [],
        soQdPdKq: [],
        idKhDx: [],
        soKhDx: [],
        ngayQdPdKqBdg: [],
        thoiHanGiaoNhan: [],
        thoiHanThanhToan: [],
        phuongThucThanhToan: [],
        phuongThucGiaoNhan: [],
        trangThai: [],
        maDviThucHien: [],
        tongTienGiaKhoiDiem: [],
        tongTienDatTruoc: [],
        tongTienDatTruocDuocDuyet: [],
        tongSoLuong: [],
        phanTramDatTruoc: [],
        thoiGianToChucTu: [],
        thoiGianToChucDen: [],
        tenDvi: [],
        tenDviThucHien: [],
        soDviTsan: [],
        soDviTsanThanhCong: [],
        soDviTsanKhongThanh: [],
        detail:
          new FormArray([this.fb.group({
            id: [],
            idTtinHdr: [],
            maDvi: [],
            soBb: [],
            ngayKy: [],
            trichYeuKetQua: [],
            ketQua: [],
            soTb: [],
            trichYeuThongBao: [],
            toChucTen: [],
            toChucDiaChi: [],
            toChucSdt: [],
            toChucStk: [],
            soHopDong: [],
            ngayKyHopDong: [],
            hinhThucToChuc: [],
            thoiHanDkTu: [],
            thoiHanDkDen: [],
            thoiHanDk: [],
            ghiChuThoiGianDk: [],
            ghiChuThoiGianXem: [],
            diaDiemNopHoSo: [],
            diaDiemXemTaiSan: [],
            dieuKienDk: [],
            buocGia: [],
            thoiHanXemTaiSanTu: [],
            thoiHanXemTaiSanDen: [],
            thoiHanNopTienTu: [],
            thoiHanNopTienDen: [],
            phuongThucThanhToan: [],
            huongThuTen: [],
            huongThuStk: [],
            huongThuNganHang: [],
            huongThuChiNhanh: [],
            thoiGianToChucTu: [],
            thoiGianToChucDen: [],
            diaDiemToChuc: [],
            hinhThucDauGia: [],
            phuongThucDauGia: [],
            ghiChu: [],
            tenDvi: [],
            fileDinhKem: [],
            canCu: [],
            listNguoiLienQuan: [this.fb.group({
              id: [],
              idTtinHdr: [],
              idTtinDtl: [],
              maDvi: [],
              hoVaTen: [],
              chucVu: [],
              diaChi: [],
              giayTo: [],
              loai: [],
            })],
            listTaiSan: [this.fb.group({
              id: [],
              idTtinHdr: [],
              idTtinDtl: [],
              maDvi: [],
              maDiaDiem: [],
              soLuong: [],
              donGia: [],
              donGiaCaoNhat: [],
              cloaiVthh: [],
              maDvTaiSan: [],
              tonKho: [],
              donViTinh: [],
              giaKhoiDiem: [],
              soTienDatTruoc: [],
              soLanTraGia: [],
              nguoiTraGiaCaoNhat: [],
              tenDvi: [],
              tenChiCuc: [],
              tenDiemKho: [],
              tenNhaKho: [],
              tenNganKho: [],
              tenLoKho: [],
              tenLoaiVthh: [],
              tenCloaiVthh: [],
            })]
          })]),
      }
    );
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDetail(this.idInput),
      ])
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPdKhBdgService.getDtlDetail(id)
        .then(async (res) => {
          console.log(res);
          const data = res.data;
          if (data) {
            await this.quyetDinhPdKhBdgService.getDetail(data.idQdHdr).then(async (hdr) => {
              const dataHdr = hdr.data;
              this.formData.patchValue({
                soQdPd: dataHdr.soQdPd,
                nam: dataHdr.nam,
              })
              console.log(hdr);
            })
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  hoanThanhCapNhat() {

  }

  selectRow(i) {
    console.log(i);
  }

  themMoiPhienDauGia(data: any) {
    const modalQD = this.modal.create({
      nzTitle: 'Cập nhật thông tin đấu giá',
      nzContent: ThongtinDaugiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        isModal: true
      },
    });
    modalQD.afterClose.subscribe((data) => {
      // if (hopDongs) {
      //   let canCuHd = '';
      //   this.qdGiaoNhiemVuXuatHang.hopDongIds = [];
      //   if (hopDongs.length > 0) {
      //     this.hopDongList = [];
      //     this.hopDongListShow = [];
      //     this.totalRecord = 0;
      //     hopDongs.forEach((hd, i) => {
      //       if (hd && hd.bhDdiemNhapKhoList && hd.bhDdiemNhapKhoList.length > 0) {
      //         hd.bhDdiemNhapKhoList.forEach((itemDiemKho: any) => {
      //           let item = {
      //             "donGiaKhongThue": itemDiemKho.donGia ?? 0,
      //             "donViTinh": itemDiemKho.dviTinh,
      //             "id": 0,
      //             "maDiemKho": itemDiemKho.maDiemKho,
      //             "maDvi": itemDiemKho.maDvi,
      //             "maNganKho": itemDiemKho.maNganKho,
      //             "maNganLo": itemDiemKho.maNganLo,
      //             "maNhaKho": itemDiemKho.maNhaKho,
      //             "maVatTu": hd.cloaiVthh,
      //             "maVatTuCha": hd.loaiVthh,
      //             "qdgnvxId": 0,
      //             "soLuong": itemDiemKho.soLuong ?? 0,
      //             "stt": 0,
      //             "thanhTien": ((itemDiemKho.donGia ?? 0) * (itemDiemKho.soLuong ?? 0)) ?? 0,
      //             "thoiHanXuatBan": null,
      //             "tenDvi": itemDiemKho.tenDvi,
      //             "tenDiemKho": itemDiemKho.tenDiemKho,
      //             "tenNhaKho": itemDiemKho.tenNhaKho,
      //             "tenNganKho": itemDiemKho.tenNganKho,
      //             "tenLoKho": itemDiemKho.tenLoKho,
      //             "tenVatTuCha": itemDiemKho.tenLoaiHangHoa,
      //             "tenVatTu": itemDiemKho.tenChungLoaiHH,
      //           }
      //           this.hopDongList.push(item);
      //         });
      //       }
      //       canCuHd += hd.soHd
      //       if (i < hopDongs.length - 1) {
      //         canCuHd += ' - '
      //       };
      //       this.qdGiaoNhiemVuXuatHang.hopDongIds.push(hd.id);
      //     });
      //     if (this.hopDongList && this.hopDongList.length > 0) {
      //       this.totalRecord = this.hopDongList.length;
      //       this.hopDongListShow = this.hopDongList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
      //     }
      //   }
      //   this.formData.patchValue({
      //     soHopDong: canCuHd,
      //   });
      // }
    });
  }

}
