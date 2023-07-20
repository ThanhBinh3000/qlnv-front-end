import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBanDauGiaService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import {STATUS} from 'src/app/constants/status';
import {MESSAGE} from 'src/app/constants/message';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';

import {Validators} from '@angular/forms';
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import dayjs from "dayjs";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  QuyetDinhPheDuyetKetQuaService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {chain, cloneDeep} from "lodash";
import {v4 as uuidv4} from "uuid";
import {
  ToChucThucHienThanhLyService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";

@Component({
  selector: 'app-chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly',
  templateUrl: './chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component.scss']
})
export class ChiTietQuyetDinhPheDuyetBdgThanhLyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output() showListEvent = new EventEmitter<any>();
  @Input() isViewOnModal: boolean;
  private flagInit = false;
  public dsToChucThanhLy: any;
  public dsNoiDung: any;
  public dsDonVi: any;
  listLoaiHangHoa: any[] = []
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  expandSetString = new Set<string>();
  noiDungCuuTroView = [];
  ndCtKhac = [];
  noiDungRow: any = {};
  isVisible = false;
  listNoiDung: any;
  listChungLoaiHangHoa: any[] = [];
  statusForm: any = [];
  chiTiet: any = [];
  soLuong: any;
  thanhTien: any;
  donViTinh: any;
  maHauTo: string = '/QĐ-' + this.userInfo.DON_VI.tenVietTat;
  quyetDinhDtlView: any;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get('year'), [Validators.required]],
      soQd: [],
      trichYeu: [],
      ngayKy: [],
      ngayHieuLuc: [],
      loaiHinhNhapXuat: [],
      kieuNhapXuat: [],
      idThongBao: [],
      maThongBao: [],
      loaiVthh: [],
      cloaiVthh: [],
      trangThai: [],
      lyDoTuChoi: [],
      nguoiKyQdId: [],
      ngayKyQd: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenTrangThai: ['Dự Thảo'],
      quyetDinhDtl: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsVthh(),
        this.loadDsToChucThanhLy(),
        // this.loadDsDonVi(),
        // this.loadDsDiemKho()
      ])
      await this.loadDetail(this.id)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.flagInit = true;
      await this.spinner.hide();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhPheDuyetKetQuaService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.soHoSo.split("/")[1];
            res.data.soQd = res.data.soHoSo.split("/")[0];
            //res.data.thoiGianTl = [res.data.thoiGianTlTu, res.data.thoiGianTlDen],
            this.formData.patchValue(res.data);
            this.formData.value.quyetDinhDtl.forEach(s => {
              s.idVirtual = uuidv4();
            });
            await this.buildTableView(this.formData.value.quyetDinhDtl);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async buildTableView(data?: any) {
    this.quyetDinhDtlView = chain(data)
      .groupBy("tenChiCuc")
      .map((v, k) => {
          let rowItem = v.find(s => s.tenChiCuc === k);
          let soLuong = v.reduce((prev, cur) => prev + cur.soLuong, 0);
          let idVirtual = uuidv4();
          return {
            idVirtual: idVirtual,
            tenChiCuc: k,
            soLuong: soLuong,
            childData: v
          }
        }
      ).value();
    console.log(this.quyetDinhDtlView, 'this.danhSachThanhLyView')
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
      let muoi = res.data?.find(s => s.ma == '04');
      if (muoi) {
        this.listLoaiHangHoa.push(muoi);
      }
    }
  }

  async loadDsToChucThanhLy() {
    this.toChucThucHienThanhLyService.search({
      // trangThai: STATUS.BAN_HANH,
      nam: this.formData.get('nam').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dsToChucThanhLy = data.content.filter(item => item.soQdPdKq == null);
          this.dsToChucThanhLy = [
            {
              "id": 0,
              "maDvi": "test_6c89c036d711",
              "lanDauGia": 65,
              "maThongBao": "test_0aeb93f15af5",
              "idQdTl": 15,
              "idQdTlDtl": 92,
              "soQdTl": "test_b8acb0dd40aa",
              "trichYeuTbao": "test_e550b8c36ef8",
              "tenToChuc": "test_fade449a1874",
              "sdtToChuc": "test_9b4d70bd77c5",
              "diaChiToChuc": "test_a0daaae85468",
              "taiKhoanToChuc": "test_e39f90e85c1f",
              "nganHangToChuc": "test_99ff20189220",
              "chiNhanhNhangToChuc": "test_667b05f44998",
              "soHd": "test_2db428ca2477",
              "ngayKyHd": "2015-11-24",
              "hthucTchuc": "test_d60807742401",
              "tgianDkyTu": "2019-06-20",
              "tgianDkyDen": "2014-08-16",
              "ghiChuTgianDky": "test_abc9dba78f40",
              "diaDiemDky": "test_b7467230ad01",
              "dieuKienDky": "test_9d3dc6b60ad3",
              "tienMuaHoSo": "test_419910ccedad",
              "buocGia": "test_3b4b19ab9725",
              "ghiChuBuocGia": "test_6445fe634db8",
              "khoanTienDatTruoc": 41.6,
              "tgianXemTu": "2029-03-26",
              "tgianXemDen": "2028-04-21",
              "ghiChuTgianXem": "test_5364ae6dc642",
              "diaDiemXem": "test_f48f510701c6",
              "tgianNopTienTu": "2015-04-10",
              "tgianNopTienDen": "2028-04-22",
              "pthucTtoan": "test_7501eacd15f7",
              "ghiChuTgianNopTien": "test_93758f2bd4de",
              "donViThuHuong": "test_112b489e2b63",
              "stkThuHuong": "test_5f508cfe7dd6",
              "nganHangThuHuong": "test_abc59d761212",
              "chiNhanhNganHang": "test_f6a97244829f",
              "tgianDauGiaTu": "2014-07-29",
              "tgianDauGiaDen": "2025-10-01",
              "diaDiemDauGia": "test_840b205ef474",
              "hthucDgia": "test_7e4ffa14f435",
              "pthucDgia": "test_2b3174a702cb",
              "dkienCthuc": "test_b8c46121004c",
              "ghiChu": "test_2364dc4a90d8",
              "ketQua": 51,
              "soBienBan": "test_85f9d763d9e9",
              "trichYeuBban": "test_e5a654ff52a2",
              "ngayKyBban": "2017-12-22",
              "ketQuaSl": "test_c9dcdd4213de",
              "soDviTsan": 74,
              "thongBaoKhongThanh": "test_468b9581d7d2",
              "trangThai": "test_952a8ce586db",
              "ngayPduyet": "2018-02-19",
              "nguoiPduyetId": 48,
              "ngayGduyet": "2031-04-27",
              "nguoiGduyetId": 27,
              "thoiHanThanhToan": "2026-12-14",
              "pthucThanhtoanKhac": "test_6ff3bbff6dc0",
              "thoiHanGiaoNhan": "2033-04-29",
              "pthucGnhan": "test_7c89ea25d990",
              "tenDvi": "test_a29729c69d7b",
              "tenTrangThai": "test_dd233eafbe05",
              "fileCanCu": [
                {
                  "id": 45,
                  "fileName": "test_e4c3f7658956",
                  "fileSize": "test_89299259a0aa",
                  "fileUrl": "test_f368f23c0bd2",
                  "fileType": "test_44129d669332",
                  "dataType": "test_ac27cb4b6a52",
                  "createDate": "2032-10-27 23:08:59",
                  "dataId": 55,
                  "noiDung": "test_365199fe9d8c"
                }
              ],
              "fileDinhKem": [
                {
                  "id": 11,
                  "fileName": "test_09fa2cb7030c",
                  "fileSize": "test_57f33c1cdee0",
                  "fileUrl": "test_e08c5679b56d",
                  "fileType": "test_96e192fab286",
                  "dataType": "test_e69809e6eafc",
                  "createDate": "2026-02-03 17:51:27",
                  "dataId": 15,
                  "noiDung": "test_065f7b803fe9"
                }
              ],
              "fileDinhKemDaKy": [
                {
                  "id": 29,
                  "fileName": "test_2a5e0b586ea7",
                  "fileSize": "test_a3a3d7e0318c",
                  "fileUrl": "test_22509d0f04b2",
                  "fileType": "test_6727f106e65a",
                  "dataType": "test_8ed86fb63fa8",
                  "createDate": "2023-12-10 19:09:47",
                  "dataId": 89,
                  "noiDung": "test_b63ee61bd2b3"
                }
              ],
              "toChucDtl": [
                {
                  "id": 6,
                  "maDiaDiem": "test_0445e9f289e3",
                  "loaiVthh": "test_2cf8a3332d27",
                  "cloaiVthh": "test_0c35d3140d8c",
                  "maDviTsan": "test_2ad78e9a1cbb",
                  "slDauGia": 88.81,
                  "donViTinh": "test_e146eaa7d11f",
                  "giaTlKhongVat": 97.63,
                  "giaKhoiDiem": 70.05,
                  "soTienDatTruoc": 65.71,
                  "soLanTraGia": 58,
                  "donGiaCaoNhat": 24.53,
                  "thanhTien": 38.58,
                  "toChucCaNhan": "test_769c0f977612",
                  "tenLoaiVthh": "test_c9751542201d",
                  "tenCloaiVthh": "test_8509efc80d39",
                  "tenCuc": "test_862fabdb97e5",
                  "tenChiCuc": "test_00ac7f66de20",
                  "tenDiemKho": "test_0ce53df11e62",
                  "tenNhaKho": "test_5c86c94f3044",
                  "tenNganKho": "test_e05f0036138c",
                  "tenLoKho": "test_73a1491e3762"
                }
              ],
              "toChucNlq": [
                {
                  "id": 41,
                  "hoVaTen": "test_5cb64896ffdd",
                  "soCccd": "test_074fc83c27d0",
                  "chucVu": "test_ca82166b1c2a",
                  "diaChi": "test_f91e1571d4d9",
                  "loai": "test_92a7e41ac1a8",
                  "idVirtual": 85.65
                }
              ],
              "ngayTao": "2023-06-05 10:44:38",
              "nguoiTaoId": 75,
              "ngaySua": "2031-08-10 20:05:17",
              "nguoiSuaId": 94
            }
          ]
        }
      } else {
        this.dsToChucThanhLy = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {...this.formData.value, soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : null}
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soQd: this.formData.value.soQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
}
