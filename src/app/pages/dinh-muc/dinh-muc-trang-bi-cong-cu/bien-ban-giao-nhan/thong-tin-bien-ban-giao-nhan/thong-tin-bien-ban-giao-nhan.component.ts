import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { ChiTietBienBanChuanBiKho } from 'src/app/models/BienBanChuanBiKho';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanChuanBiKhoService } from 'src/app/services/quanLyBienBanChuanBiKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'app-thong-tin-bien-ban-giao-nhan',
  templateUrl: './thong-tin-bien-ban-giao-nhan.component.html',
  styleUrls: ['./thong-tin-bien-ban-giao-nhan.component.scss']
})
export class ThongTinBienBanGiaoNhanComponent implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  dsChiTietChuanBiKhoClone: Array<ChiTietBienBanChuanBiKho> = [];
  chiTietChuanBiKhoCreate: ChiTietBienBanChuanBiKho = new ChiTietBienBanChuanBiKho();
  formData: FormGroup;
  listHopDong: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listOfMapData: TreeNodeInterface[] = [
    // {
    //   key: `1`,
    //   name: 'John Brown sr.',
    //   age: 60,
    //   address: 'New York No. 1 Lake Park',
    //   children: [
    //     {
    //       key: `1-1`,
    //       name: 'John Brown',
    //       age: 42,
    //       address: 'New York No. 2 Lake Park'
    //     },
    //     {
    //       key: `1-2`,
    //       name: 'John Brown jr.',
    //       age: 30,
    //       address: 'New York No. 3 Lake Park',
    //       children: [
    //         {
    //           key: `1-2-1`,
    //           name: 'Jimmy Brown',
    //           age: 16,
    //           address: 'New York No. 3 Lake Park'
    //         }
    //       ]
    //     },
    //     {
    //       key: `1-3`,
    //       name: 'Jim Green sr.',
    //       age: 72,
    //       address: 'London No. 1 Lake Park',
    //       children: [
    //         {
    //           key: `1-3-1`,
    //           name: 'Jim Green',
    //           age: 42,
    //           address: 'London No. 2 Lake Park',
    //           children: [
    //             {
    //               key: `1-3-1-1`,
    //               name: 'Jim Green jr.',
    //               age: 25,
    //               address: 'London No. 3 Lake Park'
    //             },
    //             {
    //               key: `1-3-1-2`,
    //               name: 'Jimmy Green sr.',
    //               age: 18,
    //               address: 'London No. 4 Lake Park'
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   key: `2`,
    //   name: 'Joe Black',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park'
    // }
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  constructor(
    private spinner: NgxSpinnerService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private userService: UserService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private thongTinHopDongService: ThongTinHopDongService,
    private donViService: DonviService,
    private fb: FormBuilder,
    private bienBanChuanBiKhoService: QuanLyBienBanChuanBiKhoService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });
      this.typeVthh = '02';
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = 'Dự thảo';

      this.initForm();
      await Promise.all([
        this.loadDiemKho(),
        this.loadTieuChuan(),
        this.loadSoQuyetDinh(),
        this.loadLoaiKho(),
        this.loadPTBaoQuan(),
        this.loadDonViTinh(),
        this.loadHinhThucBaoQuan(),
      ]);
      await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loadHinhThucBaoQuan() {
    let body = {
      "maHthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenHthuc": null,
      "trangThai": null
    }
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  initForm() {
    this.formData = this.fb.group({
      soQD: [
        {
          value: this.detail
            ? this.detail.qdgnvnxId
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      donVi: [
        {
          value: this.detail.tenDvi, disabled: true
        },
        [],
      ],
      maQHNS: [
        {
          value: this.detail.maDvi, disabled: true
        },
        [],
      ],
      soBienBan: [
        {
          value: this.detail
            ? this.detail.soBienBan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      ngayNghiemThu: [
        {
          value: this.detail
            ? this.detail.ngayNghiemThu
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      thuTruongDonVi: [
        {
          value: this.detail
            ? this.detail.thuTruongDonVi
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      keToanDonVi: [
        {
          value: this.detail
            ? this.detail.keToanDonVi
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      kyThuatVienBaoQuan: [
        {
          value: this.detail
            ? this.detail.kyThuatVien
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      thuKho: [
        {
          value: this.detail
            ? this.detail.thuKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      tenVatTuCha: [
        {
          value: this.detail
            ? this.detail.tenVatTuCha
            : null, disabled: true
        },
        [],
      ],
      tenVatTu: [
        {
          value: this.detail
            ? this.detail.tenVatTu
            : null, disabled: true
        },
        [],
      ],
      loaiHinhKho: [
        {
          value: this.detail
            ? this.detail.loaiHinhKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      tichLuong: [
        {
          value: this.detail
            ? this.detail.tichLuong
            : null, disabled: true
        },
        [],
      ],
      diemKho: [
        {
          value: this.detail
            ? this.detail.maDiemKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      nhaKho: [
        {
          value: this.detail
            ? this.detail.maNhaKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      nganKho: [
        {
          value: this.detail
            ? this.detail.maNganKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      loKho: [
        {
          value: this.detail
            ? this.detail.maNganLo
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      phuongThucBaoQuan: [
        {
          value: this.detail
            ? this.detail.ptBaoQuan
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      thucNhap: [
        {
          value: this.detail
            ? this.detail.thucNhap
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      hinhThucBaoQuan: [
        {
          value: this.detail
            ? this.detail.htBaoQuan
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      dinhMucDuocGiao: [
        {
          value: this.detail
            ? this.detail.dinhMucDuocGiao
            : null, disabled: true
        },
        [],
      ],
      ketLuan: [
        {
          value: this.detail
            ? this.detail.ketLuan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      tongSo: [
        {
          value: this.detail
            ? null
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      soHopDong: [
        {
          value: this.detail
            ? this.detail.soHopDong
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      qdgnvnxId: [],
    });
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
    return ''
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoQuyetDinh(autoChange: boolean) {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.formData.get("soQD").value);
    this.formData.patchValue({
      qdgnvnxId: quyetDinh[0].id,
    })
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      this.listHopDong = [];
      this.detailGiaoNhap.children1.forEach(element => {
        if (element && element.hopDong) {
          if (element.hopDong.loaiVthh.startsWith('02')) {
            this.listHopDong.push(element);
          }
        }
      });
      if (!autoChange) {
        this.formData.patchValue({
          soHopDong: null,
          tenVatTuCha: null,
          tenVatTu: null,
        });
        this.detail.hopDongId = null;
        this.detail.maVatTu = null;
        this.detail.maVatTuCha = null;
      } else {
        await this.changeHopDong();
      }
    }
  }

  async changeHopDong() {
    if (this.formData.get("soHopDong").value) {
      let body = {
        "str": this.formData.get("soHopDong").value
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.formData.patchValue({
          tenVatTuCha: this.detailHopDong.tenVthh,
          tenVatTu: this.detailHopDong.tenCloaiVthh,
        });
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.maVatTu = this.detailHopDong.cloaiVthh;
        this.detail.maVatTuCha = this.detailHopDong.loaiVthh;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadTieuChuan() {
    let body = {
      "maHang": this.typeVthh,
      "namQchuan": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenQchuan": null,
      "trangThai": "01"
    }
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (res.data.content[0].children && res.data.content[0].children.length > 0) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => x.key == this.formData.get("diemKho").value);
    this.detail.maNhaKho = null;
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.key == this.formData.get("nhaKho").value);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.formData.get("nganKho").value);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.bienBanChuanBiKhoService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.dsChiTietChuanBiKhoClone = this.detail.chiTiets;
          this.initForm();
          this.changeDiemKho(true);
          await this.changeSoQuyetDinh(true);
        }
      }
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadLoaiKho() {
    let body = {
      "maLhKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenLhKho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listLoaiKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadPTBaoQuan() {
    let body = {
      "maPthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenPthuc": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucPhuongThucBaoQuanGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listPTBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNganLo() {
    let body = {
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeNganLo() {
    let nganLo = this.listNganLo.filter(x => x.maNganlo == this.detail.maNganlo);
    if (nganLo && nganLo.length > 0) {
      this.detail.tichLuong = nganLo[0].tichLuongChua ?? 0;
    }
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "chiTiets": this.detail.chiTiets,
        "htBaoQuan": this.formData.get("hinhThucBaoQuan").value,
        "id": this.detail.id,
        "keToanDonVi": this.formData.get("keToanDonVi").value,
        "ketLuan": this.formData.get("ketLuan").value,
        "kyThuatVien": this.formData.get("kyThuatVienBaoQuan").value,
        "loaiHinhKho": this.formData.get("loaiHinhKho").value,
        "maDiemKho": this.formData.get("diemKho").value,
        "maNganKho": this.formData.get("nganKho").value,
        "maNganLo": this.formData.get("loKho").value,
        "maNhaKho": this.formData.get("nhaKho").value,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "hopDongId": this.detail.hopDongId,
        "soHopDong": this.formData.get("soHopDong").value,
        "nam": null,
        "ngayNghiemThu": this.formData.get("ngayNghiemThu").value ? dayjs(this.formData.get("ngayNghiemThu").value).format("YYYY-MM-DD") : null,
        "ptBaoQuan": this.formData.get("phuongThucBaoQuan").value,
        "qdgnvnxId": this.formData.get("soQD").value,
        "so": null,
        "soBienBan": this.formData.get("soBienBan").value,
        "thuKho": this.formData.get("thuKho").value,
        "thuTruongDonVi": this.formData.get("thuTruongDonVi").value,
        "thucNhap": this.formData.get("thucNhap").value,
        "tongSo": this.formData.get("tongSo").value,
        "maDvi": this.detail.maDvi,
      };
      if (this.id > 0) {
        let res = await this.bienBanChuanBiKhoService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.bienBanChuanBiKhoService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.bienBanChuanBiKhoService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  pheDuyet() {
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.bienBanChuanBiKhoService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.bienBanChuanBiKhoService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  back() {
    this.showListEvent.emit();
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  print() {

  }
  newObjectChiTietChuanBiKho() {
    this.chiTietChuanBiKhoCreate = new ChiTietBienBanChuanBiKho();
  }
  addChiTiet() {
    if (!this.chiTietChuanBiKhoCreate.noiDung) {
      return;
    }
    const chiTietChuanBiKhoTemp = new ChiTietBienBanChuanBiKho();
    chiTietChuanBiKhoTemp.noiDung = this.chiTietChuanBiKhoCreate.noiDung;
    chiTietChuanBiKhoTemp.donViTinh = this.chiTietChuanBiKhoCreate.donViTinh;
    chiTietChuanBiKhoTemp.soLuongTrongNam = this.chiTietChuanBiKhoCreate.soLuongTrongNam;
    chiTietChuanBiKhoTemp.donGiaTrongNam = this.chiTietChuanBiKhoCreate.donGiaTrongNam;
    chiTietChuanBiKhoTemp.thanhTienTrongNam = this.chiTietChuanBiKhoCreate.thanhTienTrongNam;
    chiTietChuanBiKhoTemp.soLuongQt = this.chiTietChuanBiKhoCreate.soLuongQt;
    chiTietChuanBiKhoTemp.thanhTienQt = this.chiTietChuanBiKhoCreate.thanhTienQt;
    chiTietChuanBiKhoTemp.tongGiaTri = this.chiTietChuanBiKhoCreate.tongGiaTri;
    chiTietChuanBiKhoTemp.idVirtual = new Date().getTime();
    this.detail.chiTiets = [
      ...this.detail.chiTiets,
      chiTietChuanBiKhoTemp,
    ];
    this.newObjectChiTietChuanBiKho();
    this.dsChiTietChuanBiKhoClone = cloneDeep(this.detail.chiTiets);
  }
  deleteData(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.detail.chiTiets =
          this.detail?.chiTiets.filter(
            (cbKho) => cbKho.idVirtual !== id,
          );
        this.dsChiTietChuanBiKhoClone = cloneDeep(
          this.detail.chiTiets,
        );
      },
    });
  }
  startEdit(index: number) {
    this.dsChiTietChuanBiKhoClone[index].isEdit = true;
  }
  saveEdit(i: number) {
    this.dsChiTietChuanBiKhoClone[i].isEdit = false;
    Object.assign(
      this.detail.chiTiets[i],
      this.dsChiTietChuanBiKhoClone[i],
    );
  }
  cancelEdit(index: number) {
    this.dsChiTietChuanBiKhoClone = cloneDeep(this.detail.chiTiets);
    this.dsChiTietChuanBiKhoClone[index].isEdit = false;
  }
  calcChiPhiTrongNam(): string {
    this.chiTietChuanBiKhoCreate.thanhTienTrongNam = +this.chiTietChuanBiKhoCreate.soLuongTrongNam
      * +this.chiTietChuanBiKhoCreate.donGiaTrongNam;
    return this.chiTietChuanBiKhoCreate.thanhTienTrongNam
      ? Intl.NumberFormat('en-US').format(this.chiTietChuanBiKhoCreate.thanhTienTrongNam)
      : '0';
  }
  calcTongGiaTri(): string {
    if (!this.chiTietChuanBiKhoCreate.thanhTienQt) {
      this.chiTietChuanBiKhoCreate.thanhTienQt = 0;
    }

    this.chiTietChuanBiKhoCreate.tongGiaTri = +this.chiTietChuanBiKhoCreate.thanhTienTrongNam
      + this.chiTietChuanBiKhoCreate.thanhTienQt;
    return this.chiTietChuanBiKhoCreate.tongGiaTri
      ? Intl.NumberFormat('en-US').format(this.chiTietChuanBiKhoCreate.tongGiaTri)
      : '0';
  }

  calcTongCong(): string {
    const tong = this.dsChiTietChuanBiKhoClone.length > 0 ?
      this.dsChiTietChuanBiKhoClone.reduce((total, currentValue) =>
        total + currentValue.thanhTienTrongNam
        , 0) : 0
    this.formData.patchValue({
      tongSo: tong
    })
    return Intl.NumberFormat('en-US').format(tong);
  }

}
