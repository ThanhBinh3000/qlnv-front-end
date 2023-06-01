import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { DonviService } from "src/app/services/donvi.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import * as uuidv4 from "uuid";
import { chain, cloneDeep, sortBy } from 'lodash';
import { STATUS } from "src/app/constants/status";
import { ThongTinHangCanDieuChuyenCucComponent } from "../thong-tin-hang-can-dieu-chuyen-cuc/thong-tin-hang-can-dieu-chuyen-cuc.component";
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { AMOUNT_NO_DECIMAL } from "src/app/Utility/utils";
import { ThongTinHangCanDieuChuyenChiCucComponent } from "../thong-tin-hang-can-dieu-chuyen-chi-cuc/thong-tin-hang-can-dieu-chuyen-chi-cuc.component";

export class QuyetDinhPdDtl {
  idVirtual: number;
  id: number;
  idHdr: number;
  idDx: number;
  soDx: string;
  maDviDx: string;
  ngayPduyetDx: Date;
  trichYeuDx: string;
  tongSoLuongDx: number;
  soLuongXuatCap: number;
  thanhTienDx: number;
  ngayKetThucDx: Date;
  tenDviDx: string;
  quyetDinhPdDx: Array<any> = [];
}

@Component({
  selector: 'app-thong-tin-quyet-dinh-dieu-chuyen-cuc',
  templateUrl: './thong-tin-quyet-dinh-dieu-chuyen-cuc.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-dieu-chuyen-cuc.component.scss']
})
export class ThongTinQuyetDinhDieuChuyenCucComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  canCu: any[] = [];
  quyetDinh: any[] = [];

  listQuyetDinh: any[] = [];

  maQd: string = null;
  listChiCucNhan: any[] = [];

  listLoaiQD: any[] = [
    {
      value: "00",
      text: "Nhập điều chuyển"
    },
    {
      value: "01",
      text: "Xuất điều chuyển"
    }
  ];

  listLoaiDC: any[] = [
    {
      value: "DCNB",
      text: "Trong nội bộ Chi cục"
    },
    {
      value: "CHI_CUC",
      text: "Giữa 2 chi cục trong cùng 1 cục"
    },
    {
      value: "CUC",
      text: "Giữa 2 cục DTNN KV"
    }
  ];

  danhSachKeHoach: any[] = []
  typeKeHoach: string = "ADD"
  danhSachQuyetDinh: any[] = []
  dataTableView: any[] = [
    // { "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "00222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "idVirtual": "7cc45619-d7a4-4d05-8c41-1510e80fa301", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "0222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "idVirtual": "561c3c8a-40eb-40d3-b474-2b4125f862f4", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "0222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "idVirtual": "a0ab431c-0b28-4db4-8ca9-e14f5d515e4b", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333" }] }] }], "expand": true }], "expand": true }
  ]
  AMOUNT = AMOUNT_NO_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenCucService);
    this.formData = this.fb.group({
      loaiDc: ['DCNB', [Validators.required]],
      tenLoaiDc: ['Trong nội bộ Chi cục'],
      nam: [dayjs().get("year"), [Validators.required]],
      soQdinh: [, [Validators.required]],
      loaiQdinh: [],
      tenLoaiQdinh: [],
      ngayKyQdinh: [],
      ngayPduyet: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      canCuQdTc: [],
      soCanCuQdTc: [],
      ngayTrinhDuyetTc: [],
      tongDuToanKp: [],
      loaiHinhNX: ["Nhập ĐC nội bộ Chi cục"],
      kieuNX: ["Nhập không chi tiền"],
      danhSachQuyetDinh: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {
    await this.spinner.show();

    this.loadDsChiCuc()

    try {
      this.maQd = 'DCNB'//this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {

  }

  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.danhSachKeHoach = []
      this.formData.patchValue(data);

      data.danhSachQuyetDinh.map(async (item, i) => {
        if (item.dcnbKeHoachDcHdr) {
          let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

          dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            this.danhSachKeHoach.push({
              ...element,
              maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
            })
          });
        }
      })

      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;

      if (data.loaiDc !== "DCNB") this.loadDsQuyetDinh(data.loaiDc, data.loaiQdinh)

      if (data.loaiDc === "DCNB") {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
      }
      if (data.loaiDc === "CHI_CUC") {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      }
      if (data.loaiDc === "CUC" && !(this.isChiCuc() && data.loaiQdinh == '01')) {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      }
      if (data.loaiDc === "CUC" && this.isChiCuc() && data.loaiQdinh == '01') {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")

      }
    }
    console.log('loadChiTietdanhSachKeHoach', this.danhSachKeHoach)
    console.log('loadChiTietdataTableView', JSON.stringify(this.dataTableView))
    await this.spinner.hide();
  }

  collapse(array: any[], data: any, $event: boolean): void {
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

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  async loadDsQuyetDinh(loaiDc, loaiQdinh?) {
    let body = {
      loaiDc,
      loaiQdinh
    };
    let res = await this.quyetDinhDieuChuyenTCService.dsQuyetDinh(body);

    if (res.msg == MESSAGE.SUCCESS) {
      this.listQuyetDinh = Array.isArray(res.data) ? res.data.filter(f => {
        return (f.maDvi !== this.userInfo.MA_DVI) && f.trangThai == STATUS.BAN_HANH
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

  }

  async loadDsChiCuc(value?) {
    let body = {
      trangThai: "01",
      maDviCha: value ? value.maCucNhan ? value.maCucNhan : this.userInfo.MA_DVI.substring(0, 6) : this.userInfo.MA_DVI.substring(0, 6),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCucNhan = Array.isArray(res.data) ? res.data.filter(f => {
        return f.maDvi !== this.userInfo.MA_DVI
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }



  async onChangeLoaiDc(value) {
    if (value) {
      const loaiDC = this.listLoaiDC.find(item => item.value == value)
      this.formData.patchValue({
        canCuQdTc: "",
        soCanCuQdTc: "",
        ngayTrinhDuyetTc: "",
        tongDuToanKp: ""
      })

      if (loaiDC) {
        this.formData.patchValue({
          tenLoaiDc: loaiDC.text,
        })
      }
      if (value === "CHI_CUC") this.loadDsQuyetDinh(value)


      this.dataTableView = []
    }
  }

  async onChangeLoaiQdinh(value) {
    if (value) {
      const loaiQD = this.listLoaiQD.find(item => item.value == value)
      this.loadDsQuyetDinh(this.formData.value.loaiDC, value)
      if (loaiQD) {
        this.formData.patchValue({
          tenLoaiQdinh: loaiQD.text,
        })
      }

    }
  }

  async onChangeCanCuQdTc(value) {
    if (value) {
      const qdTC = this.listQuyetDinh.find(item => item.id == value)

      if (qdTC) {
        this.formData.patchValue({
          soCanCuQdTc: qdTC.soQdinh,
          ngayTrinhDuyetTc: qdTC.ngayPduyet
        })
      }
      let tong = 0
      this.danhSachKeHoach = []
      this.danhSachQuyetDinh = []
      let dsHH = []
      const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)

      detail.data.danhSachQuyetDinh.map((qd) => {
        if (qd.dcnbKeHoachDcHdr) {
          const item = qd.dcnbKeHoachDcHdr

          this.danhSachQuyetDinh.push({
            danhSachKeHoach: item.danhSachHangHoa
          })
          item.danhSachHangHoa.map(itemHH => {
            dsHH.push({
              ...itemHH,
              maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
              maDvi: item.maDvi,
              tenDvi: item.tenDvi
            })
            tong = tong + itemHH.duToanKphi
          })
        }

      })

      this.dataTableView = this.formData.value.loaiDc === "CHI_CUC" ? this.buildTableViewChiCUC(dsHH, "maDvi") : this.buildTableViewChiCUC(dsHH, "maDvi")

      this.formData.patchValue({
        tongDuToanKp: tong,
        danhSachQuyetDinh: this.danhSachQuyetDinh
      })


    }
  }

  // buildTableViewNB(data: any[] = [], groupBy: string = "maDvi") {
  //   let dataView = chain(data)
  //     .groupBy(groupBy)
  //     ?.map((value, key) => {
  //       console.log('maDvi', key, value)
  //       let rs = chain(value)
  //         .groupBy("maDiemKho")
  //         ?.map((v, k) => {
  //           console.log('maDiemKho', k, v)
  //           let rss = chain(v)
  //             .groupBy("maLoKho")
  //             ?.map((vs, ks) => {
  //               console.log('maLoKho', ks, vs)
  //               const maLoKho = vs.find(s => s?.maLoKho == ks);

  //               const rssx = chain(vs).groupBy("maDiemKhoNhan")?.map((n, inx) => {
  //                 console.log('maDiemKhoNhan', inx, n)
  //                 const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
  //                 return {
  //                   ...maDiemKhoNhan,
  //                   children: n
  //                 }
  //               }).value()
  //               let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //               return {
  //                 ...maLoKho,
  //                 idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //                 children: rssx,
  //                 duToanKphi
  //               }
  //             }
  //             ).value();

  //           let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //           let rowDiemKho = v?.find(s => s.maDiemKho === k);

  //           return {
  //             ...rowDiemKho,
  //             idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //             duToanKphi: duToanKphi,
  //             children: rss,
  //             expand: true
  //           }
  //         }
  //         ).value();

  //       let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //       let rowChiCuc = value?.find(s => s[`${groupBy}`] === key);
  //       return {
  //         ...rowChiCuc,
  //         idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //         duToanKphi: duToanKphi,
  //         children: rs,
  //         expand: true
  //       };
  //     }).value();


  //   if (data?.length !== 0) {
  //     const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //     this.formData.patchValue({
  //       tongDuToanKp: tongDuToanChiPhi,
  //     })
  //   };
  //   return dataView
  // }

  buildTableViewChiCUC(data: any[] = [], groupBy: string = "maDvi") {
    let dataView = chain(data)
      .groupBy(groupBy)
      ?.map((value, key) => {

        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {

            let rss = chain(v)
              .groupBy("maLoNganKho")
              ?.map((vs, ks) => {

                const maLoKho = vs.find(s => s?.maLoNganKho == ks);
                // const rsss = chain(vs).groupBy("id").map((x, ix) => {
                //   console.log('id', ix, x)
                //   const ids = x.find(f => f.id == ix);

                //   const hasmaChiCucNhan = x.some(f => f.maChiCucNhan);
                //   if (!hasmaChiCucNhan) return {
                //     ...ids
                //   }

                // }).value()


                const rsxx = (groupBy === "maChiCucNhan") ? chain(vs).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                  const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                  return {
                    ...maDiemKhoNhan,
                    children: n
                  }
                }).value() : chain(vs).groupBy("maChiCucNhan")?.map((m, im) => {

                  const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                  const hasMaDiemKhoNhan = m.some(f => f.maDiemKhoNhan);
                  if (!hasMaDiemKhoNhan) return {
                    ...maChiCucNhan
                  }

                  const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                    const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                    return {
                      ...maDiemKhoNhan,
                      children: n
                    }
                  }).value()
                  return {
                    ...maChiCucNhan,
                    children: rssx
                  }
                }).value()




                // return {
                //   ...maLoKho,
                //   children: rsxx
                // }
                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                return {
                  ...maLoKho,
                  idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: rsxx,
                  duToanKphi
                }
              }
              ).value();

            let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
            let rowDiemKho = v?.find(s => s.maDiemKho === k);

            return {
              ...rowDiemKho,
              idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
              duToanKphi: duToanKphi,
              children: rss,
              expand: true
            }
          }
          ).value();

        let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let rowChiCuc = value?.find(s => s[groupBy] === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
          duToanKphi: duToanKphi,
          children: rs,
          expand: true
        };
      }).value();


    if (data?.length !== 0) {
      const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
      this.formData.patchValue({
        tongDuToanKp: tongDuToanChiPhi,
      })
    };
    return dataView
  }

  // buildTableViewCUC(data: any[] = [], groupBy: string = "maDvi") {
  //   let dataView = chain(data)
  //     .groupBy(groupBy)
  //     ?.map((value, key) => {
  //       console.log('maDvi', key, value)
  //       let rs = chain(value)
  //         .groupBy("maDiemKho")
  //         ?.map((v, k) => {
  //           console.log('maDiemKho', k, v)
  //           let rss = chain(v)
  //             .groupBy("maLoKho")
  //             ?.map((vs, ks) => {
  //               console.log('maLoKho', ks, vs)
  //               const maLoKho = vs.find(s => s?.maLoKho == ks);

  //               let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //               return {
  //                 ...maLoKho,
  //                 idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //                 children: vs,
  //                 duToanKphi
  //               }
  //             }
  //             ).value();

  //           let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //           let rowDiemKho = v?.find(s => s.maDiemKho === k);

  //           return {
  //             ...rowDiemKho,
  //             idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //             duToanKphi: duToanKphi,
  //             children: rss,
  //             expand: true
  //           }
  //         }
  //         ).value();

  //       let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //       let rowChiCuc = value?.find(s => s.maDvi === key);
  //       return {
  //         ...rowChiCuc,
  //         idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //         duToanKphi: duToanKphi,
  //         children: rs,
  //         expand: true
  //       };
  //     }).value();


  //   if (data?.length !== 0) {
  //     const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //     this.formData.patchValue({
  //       tongDuToanKp: tongDuToanChiPhi,
  //     })
  //   };
  //   return dataView
  // }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }


  async add(row?: any) {
    await this.spinner.show();

    await this.spinner.hide();
    if (!row) this.typeKeHoach = "ADD"

    const keHoachDcHdrId = row ? row.hdrId : undefined

    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangCanDieuChuyenCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        danhSachKeHoach: this.danhSachKeHoach,
        dsChiCuc: this.listChiCucNhan,
        data: row ? row : undefined,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        if (data.isUpdate) {
          if (this.typeKeHoach === "LO_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== data.maLoKhoNhan)
          // if (this.typeKeHoach === "DIEM_KHO_NHAN")
          //   this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== data.maDiemKhoNhan)
          this.danhSachKeHoach.push({
            ...data,
            maLoNganKho: data.maLoKho ? `${data.maLoKho}${data.maNganKho}` : data.maNganKho,
            hdrId: row.hdrId,
            id: this.typeKeHoach === "LO_KHO_NHAN" ? row.id : undefined
          })

        } else this.danhSachKeHoach.push({
          ...data,
          maLoNganKho: data.maLoKho ? `${data.maLoKho}${data.maNganKho}` : data.maNganKho,
        })

        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")

        if (this.idInput) {
          if (keHoachDcHdrId) {
            const qdinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId == keHoachDcHdrId)

            if (qdinh) {
              const dsHH = this.typeKeHoach === "LO_KHO_NHAN" ? qdinh.danhSachKeHoach.filter(item => item.id !== row.id) : qdinh.danhSachKeHoach
              dsHH.push({
                ...data,
                id: this.typeKeHoach === "LO_KHO_NHAN" ? row.id : undefined,
                hdrId: qdinh.keHoachDcHdrId
              })

              qdinh.danhSachKeHoach = dsHH
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== keHoachDcHdrId)
              dsQuyetDinh.push(qdinh)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
          } else {
            if (this.typeKeHoach === "ADD") {
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                danhSachKeHoach: [data]
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "THEM_LO_KHO") {
              const dsHH = this.danhSachKeHoach.filter(kh => kh.maDiemKho === data.maDiemKho)
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                danhSachKeHoach: dsHH
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "THEM_DIEM_KHO_NHAN") {
              const dsHH = this.danhSachKeHoach.filter(kh => kh.maNganKho === data.maNganKho)
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                danhSachKeHoach: dsHH
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "THEM_LO_KHO_NHAN") {
              const dsHH = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan === data.maDiemKhoNhan)
              dsHH.push(data)
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                danhSachKeHoach: dsHH
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "LO_KHO_NHAN") {
              const qd = this.formData.value.danhSachQuyetDinh.find(item => item.maChiCucNhan === data.maChiCucNhan)
              if (!qd) return
              const dsHH = qd.danhSachKeHoach.filter(item => item.maNganKhoNhan !== data.maNganKhoNhan)
              dsHH.push(data)
              qd.danhSachKeHoach = dsHH
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }

          }

        } else {
          const groupChiCuc = this.groupBy(this.danhSachKeHoach, "maChiCucNhan")
          const dsQD = []
          Object.keys(groupChiCuc).forEach(element => {
            dsQD.push({
              danhSachKeHoach: groupChiCuc[`${element}`]
            })
          });

          this.formData.patchValue({
            danhSachQuyetDinh: dsQD
          })
        }

      }
    });
  }

  async addCC(row?: any) {
    await this.spinner.show();

    await this.spinner.hide();
    const keHoachDcHdrId = row.hdrId
    const param = {
      dsChiCuc: [{ key: row.maDvi, title: row.tenDvi }],
      data: row
    }
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangCanDieuChuyenChiCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: param,
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.danhSachKeHoach = this.danhSachKeHoach.filter(item => !!item.maDiemKhoNhan)

      if (data) {
        if (data.isUpdate) {
          if (this.typeKeHoach === "LO_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== data.maLoKhoNhan)
          if (this.typeKeHoach === "DIEM_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== data.maDiemKhoNhan)
          this.danhSachKeHoach.push({
            ...data,
            maLoNganKho: data.maLoKho ? `${data.maLoKho}${data.maNganKho}` : data.maNganKho,
            hdrId: keHoachDcHdrId
          })

        } else
          this.danhSachKeHoach.push({
            ...data,
            maLoNganKho: data.maLoKho ? `${data.maLoKho}${data.maNganKho}` : data.maNganKho,
            hdrId: keHoachDcHdrId
          })

        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")

        const qdinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId == keHoachDcHdrId)
        console.log('row', row)
        if (qdinh) {
          const dsHH = qdinh.danhSachKeHoach.filter(item => !!item.maDiemKhoNhan)
          dsHH.push({
            ...data,
            id: row.maDiemKhoNhan ? undefined : row.id,
            hdrId: qdinh.keHoachDcHdrId
          })

          qdinh.danhSachKeHoach = dsHH
          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== keHoachDcHdrId)
          dsQuyetDinh.push(qdinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })
        }





      }
    });
  }

  xoaChiCuc(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maChiCucNhan !== row.maChiCucNhan)
    this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = qDinh.danhSachKeHoach.filter(item => item.maChiCucNhan !== row.maChiCucNhan)
      qDinh.danhSachKeHoach = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }
  }

  xoaDiemKho(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKho !== row.maDiemKho)
    this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")

    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = qDinh.danhSachKeHoach.filter(item => item.maDiemKho !== row.maDiemKho)
      qDinh.danhSachKeHoach = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }
  }

  themDiemKho(row) {
    this.typeKeHoach = "THEM_DIEM_KHO"
    const data = {
      hdrId: row ? row.hdrId : '',
      maDvi: row ? row.maDvi : '',
      tenDvi: row ? row.tenDvi : '',
      maChiCucNhan: row ? row.maChiCucNhan : '',
      tenChiCucNhan: row ? row.tenChiCucNhan : '',
      // maDiemKho: row ? row.maDiemKho : '',
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }

  themLoKho(row) {
    this.typeKeHoach = "THEM_LO_KHO"
    const data = {
      hdrId: row ? row.hdrId : '',
      maDvi: row ? row.maDvi : '',
      tenDvi: row ? row.tenDvi : '',
      maChiCucNhan: row ? row.maChiCucNhan : '',
      tenChiCucNhan: row ? row.tenChiCucNhan : '',
      maDiemKho: row ? row.maDiemKho : '',
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }

  xoaLoKho(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
      !(kh.maChiCucNhan === row.maChiCucNhan &&
        kh.maDiemKho === row.maDiemKho &&
        kh.maNhaKho === row.maNhaKho &&
        kh.maNganKho === row.maNganKho &&
        (row.maLoKho ? kh.maLoKho === row.maLoKho : true))
    )

    this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")

    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = row.maLoKho ? qDinh.danhSachKeHoach.filter(item => item.maLoKho !== row.maLoKho) : qDinh.danhSachKeHoach.filter(item => item.maNganKho !== row.maNganKho)
      qDinh.danhSachKeHoach = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }
  }

  themDiemKhoNhan(row) {
    this.typeKeHoach = "THEM_DIEM_KHO_NHAN"
    console.log('themLoKho', row)
    const data = {
      ...row,
      maDiemKhoNhan: "",
      tenDiemKhoNhan: "",
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      thuKhoNhan: "",
      thayDoiThuKho: "",
      slDcConLai: "",
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(data)
  }

  xoaDiemKhoNhan(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
      !(kh.maChiCucNhan === row.maChiCucNhan &&
        kh.maDiemKho === row.maDiemKho &&
        kh.maNhaKho === row.maNhaKho &&
        kh.maNganKho === row.maNganKho &&
        (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
        kh.maDiemKhoNhan === row.maDiemKhoNhan)
    )
    if (this.isCuc()) {
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
    }

    if (this.isChiCuc()) {
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
    }

    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = qDinh.danhSachKeHoach.filter(item => item.maDiemKhoNhan !== row.maDiemKhoNhan)
      qDinh.danhSachKeHoach = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }
  }

  suaDiemKhoNhan(row) {
    this.typeKeHoach = "DIEM_KHO_NHAN"
    const data = {
      ...row,
      // maDiemKhoNhan: "",
      // tenDiemKhoNhan: "",
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      thuKhoNhan: "",
      thayDoiThuKho: "",
      slDcConLai: "",
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }


  themLoKhoNhan(row) {
    this.typeKeHoach = "THEM_LO_KHO_NHAN"
    console.log('themLoKho', row)
    const data = {
      ...row,
      // maDiemKhoNhan: "",
      // tenDiemKhoNhan: "",
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      thuKhoNhan: "",
      thayDoiThuKho: "",
      slDcConLai: "",
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(data)
  }


  xoaLoKhoNhan(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
      !(kh.maChiCucNhan === row.maChiCucNhan &&
        kh.maDiemKho === row.maDiemKho &&
        kh.maNhaKho === row.maNhaKho &&
        kh.maNganKho === row.maNganKho &&
        (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
        kh.maDiemKhoNhan === row.maDiemKhoNhan &&
        kh.maNhaKhoNhan === row.maNhaKhoNhan &&
        kh.maNganKhoNhan === row.maNganKhoNhan &&
        (row.maLoKhoNhan ? kh.maLoKhoNhan === row.maLoKhoNhan : true))
    )
    if (this.isCuc())
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
    if (this.isChiCuc())
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")

    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = row.maLoKhoNhan ? qDinh.danhSachKeHoach.filter(item => item.maLoKhoNhan !== row.maLoKhoNhan) : qDinh.danhSachKeHoach.filter(item => item.maNganKhoNhan !== row.maNganKhoNhan)
      qDinh.danhSachKeHoach = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }


  }

  suaLoKhoNhan(row) {
    this.typeKeHoach = "LO_KHO_NHAN"
    if (this.isCuc())
      this.add(row)
    if (this.isChiCuc())
      this.addCC(row)
  }

  isLuuVaGD() {
    return !this.isYCXDDiemNhap() && (!this.isView && this.formData.value.trangThai == STATUS.DU_THAO && this.isCuc()) || (this.isChiCuc() && this.formData.value.loaiQdinh == '01')
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    if (this.idInput) body.id = this.idInput

    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        this.quayLai();
      }
    }
    await this.spinner.hide();
  }

  isYCXDDiemNhap() {
    return this.formData.value.trangThai == STATUS.DU_THAO && this.formData.value.loaiQdinh == '01'
  }

  async ycXDDiemNhap() {
    await this.spinner.show();
    let body = this.formData.value;
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    if (this.idInput) body.id = this.idInput

    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      let trangThai = STATUS.YC_CHICUC_PHANBO_DC;
      let mesg = 'Bạn muốn yêu cầu xác định điểm nhập?'
      this.approve(this.idInput, trangThai, mesg);
    }
    await this.spinner.hide();

  }

  async guiDuyet() {
    if (this.isCuc()) {
      let trangThai = STATUS.CHO_DUYET_TP;
      let mesg = 'Bạn muốn gửi duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }
    if (this.isChiCuc()) {
      let trangThai = STATUS.CHODUYET_TBP_TVQT;
      let mesg = 'Bạn muốn gửi duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }
  }

  isTuChoi() {
    if (this.isCuc()) {
      return this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_LDC
    }
    return false
  }

  async tuChoi() {
    if (this.isCuc()) {
      let trangThai = () => {
        if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
          return STATUS.TU_CHOI_TP
        if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
          return STATUS.TU_CHOI_LDC
        return STATUS.CHO_DUYET_TP;
      };
      this.reject(this.idInput, trangThai());
    }
    if (this.isChiCuc()) {
      let trangThai = () => {
        if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
          return STATUS.TUCHOI_TBP_TVQT
        if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
          return STATUS.TU_CHOI_LDCC
        return STATUS.CHODUYET_TBP_TVQT;
      };
      this.reject(this.idInput, trangThai());
    }
  }

  isPheDuyet() {
    if (this.isCuc()) {
      return this.formData.value.trangThai == STATUS.CHO_DUYET_TP
    }
    if (this.isChiCuc()) {
      return this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
    }
    return false
  }

  async pheDuyet() {
    if (this.isCuc()) {
      let trangThai = this.formData.value.trangThai == STATUS.CHO_DUYET_TP ? STATUS.CHO_DUYET_LDC : STATUS.BAN_HANH;
      let mesg = 'Bạn muốn phê duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }
    if (this.isChiCuc()) {
      let trangThai = this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT ? STATUS.CHO_DUYET_LDCC : STATUS.DA_DUYET_LDCC;
      let mesg = 'Bạn muốn phê duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }

  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async banHanh() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Bạn muốn ban hành văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

}
