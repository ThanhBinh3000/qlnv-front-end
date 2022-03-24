import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DialogTuChoiComponent } from './../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinDeXuatKeHoachLuaChonNhaThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import { DialogQuyetDinhGiaoChiTieuComponent } from './../../../../../components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { VatTu } from './../../../../../components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from './../../../../../components/dialog/dialog-upload/upload.component';
import {
  CanCuXacDinh,
  DanhSachGoiThau,
  FileDinhKem,
  ThongTinChung,
  ThongTinDeXuatKeHoachLuaChonNhaThauInput,
} from './../../../../../models/DeXuatKeHoachuaChonNhaThau';
import * as dayjs from 'dayjs';

interface ItemData {
  id: string;
  stt: string;
  goiThau: string;
  soLuong: string;
  diaDiem: string;
  donGia: string;
  thanhTien: string;
  bangChu: string;
}
@Component({
  selector: 'them-moi-de-xuat-ke-hoach-lua-chon-nha-thau',
  templateUrl: './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component.html',
  styleUrls: ['./them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component.scss'],
})
export class ThemMoiDeXuatKeHoachLuaChonNhaThauComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };
  id: number;
  formData: FormGroup;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  i = 0;
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  chiTietThongTinDXKHLCNT: ThongTinDeXuatKeHoachLuaChonNhaThau =
    new ThongTinDeXuatKeHoachLuaChonNhaThau();
  thongTinChungDXKHLCNT: ThongTinChung = new ThongTinChung();
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = null;
  thongTinDXKHLCNTInput: ThongTinDeXuatKeHoachLuaChonNhaThauInput =
    new ThongTinDeXuatKeHoachLuaChonNhaThauInput();

  editCache: {
    [key: string]: { edit: boolean; data: DanhSachGoiThau };
  } = {};

  dsGoiThauClone: Array<DanhSachGoiThau>;
  baoGiaThiTruongList: Array<CanCuXacDinh> = [];
  canCuKhacList: Array<CanCuXacDinh> = [];

  constructor(
    private modal: NzModalService,
    private routerActive: ActivatedRoute,
    private router: Router,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
  ) {}

  startEdit(index: number): void {
    this.dsGoiThauClone[index].isEdit = true;
  }

  cancelEdit(index: number): void {
    this.dsGoiThauClone[index].isEdit = false;
  }

  saveEdit(index: number): void {
    Object.assign(
      this.chiTietThongTinDXKHLCNT.children2[index],
      this.dsGoiThauClone[index],
    );
    this.dsGoiThauClone[index].isEdit = false;
  }
  deleteRow(idVirtual: number): void {
    this.chiTietThongTinDXKHLCNT.children2 =
      this.chiTietThongTinDXKHLCNT.children2.filter(
        (d) => d.idVirtual !== idVirtual,
      );
    Object.assign(this.dsGoiThauClone, this.chiTietThongTinDXKHLCNT.children2);
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    if (this.id > 0) {
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(this.id);
    }
    this.loadDanhMucHang();
    Promise.all([
      this.nguonVonGetAll(),
      this.phuongThucDauThauGetAll(),
      this.hinhThucDauThauGetAll(),
      this.loaiHopDongGetAll(),
    ]);
  }
  editCanCuTaiLieuDinhKem(data: CanCuXacDinh, type?: string) {
    console.log(data);
    const modal = this.modal.create({
      nzTitle: 'Chỉnh sửa căn cứ xác định giá',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataCanCuXacDinh: data,
      },
    });
    modal.afterClose.subscribe((res) => {
      console.log(res);
      if (res) {
      }
    });
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới căn cứ xác định giá',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => {
      console.log(res);
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            console.log(
              'this.chiTietThongTinDXKHLCNT',
              this.chiTietThongTinDXKHLCNT,
            );

            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            switch (type) {
              case 'tai-lieu-dinh-kem':
                this.chiTietThongTinDXKHLCNT.children = [];
                this.chiTietThongTinDXKHLCNT.children = [
                  ...this.chiTietThongTinDXKHLCNT.children,
                  fileDinhKem,
                ];
                break;
              case 'bao-gia-thi-truong':
                const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
                taiLieuBaoGiaThiTruong.loaiCanCu = '00';
                taiLieuBaoGiaThiTruong.tenTlieu = res.tenTaiLieu;
                taiLieuBaoGiaThiTruong.children = [];
                taiLieuBaoGiaThiTruong.children = [
                  ...taiLieuBaoGiaThiTruong.children,
                  fileDinhKem,
                ];
                this.chiTietThongTinDXKHLCNT?.children3.push(
                  taiLieuBaoGiaThiTruong,
                );
                this.baoGiaThiTruongList.push(taiLieuBaoGiaThiTruong);
                this.baoGiaThiTruongList = [
                  ...this.canCuKhacList,
                  taiLieuBaoGiaThiTruong,
                ];

                console.log(
                  'this.baoGiaThiTruongList: ',
                  this.baoGiaThiTruongList,
                );

                break;
              case 'can-cu-khac':
                const taiLieuCanCuKhac = new CanCuXacDinh();
                taiLieuCanCuKhac.loaiCanCu = '01';
                taiLieuCanCuKhac.tenTlieu = res.tenTaiLieu;
                taiLieuCanCuKhac.children = [];
                taiLieuCanCuKhac.children = [
                  ...taiLieuCanCuKhac.children,
                  fileDinhKem,
                ];
                this.chiTietThongTinDXKHLCNT?.children3.push(taiLieuCanCuKhac);
                this.canCuKhacList = [...this.canCuKhacList, taiLieuCanCuKhac];
                console.log('this.canCuKhacList: ', this.canCuKhacList);
                break;
              default:
                break;
            }
          });
      }
    });
  }

  themMoiGoiThau(data?: DanhSachGoiThau) {
    const modalGT = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        thongtinDauThau: data,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      const dsGoiThauDialog = new DanhSachGoiThau();
      dsGoiThauDialog.bangChu = res.value.bangChu;
      dsGoiThauDialog.diaDiemNhap = res.value.diaDiemNhap;
      dsGoiThauDialog.donGia = +res.value.donGia;
      dsGoiThauDialog.goiThau = res.value.goiThau;
      dsGoiThauDialog.id = +res.value.id;
      dsGoiThauDialog.soLuong = +res.value.soLuong;
      dsGoiThauDialog.thanhTien = res.value.thanhTien;
      dsGoiThauDialog.idVirtual = new Date().getTime();
      this.chiTietThongTinDXKHLCNT.children2 = [
        ...this.chiTietThongTinDXKHLCNT.children2,
        dsGoiThauDialog,
      ];
      this.dsGoiThauClone = this.chiTietThongTinDXKHLCNT.children2;
    });
  }

  redirectToDanhSachDauThau() {
    this.router.navigate(['nhap/dau-thau/danh-sach-dau-thau']);
  }

  openDialogQuyetDinhGiaoChiTieu() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.controls['canCu'].setValue(data.soQuyetDinh);
      }
    });
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  loadThongTinDeXuatKeHoachLuaChonNhaThau(id: number) {
    this.dauThauService
      .getChiTietDeXuatKeHoachLuaChonNhaThau(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.chiTietThongTinDXKHLCNT.children1 = [];
          this.chiTietThongTinDXKHLCNT.children2 = [];
          this.chiTietThongTinDXKHLCNT.children3 = [];
          this.chiTietThongTinDXKHLCNT.children = [];
          this.chiTietThongTinDXKHLCNT = res.data;
          this.chiTietThongTinDXKHLCNT.soDxuat =
            this.chiTietThongTinDXKHLCNT.soDxuat.split('/')[0];
          this.thongTinChungDXKHLCNT =
            this.chiTietThongTinDXKHLCNT.children1[0];
          this.chiTietThongTinDXKHLCNT.children2.forEach((item) => {
            item.idVirtual = new Date().getTime();
          });
          this.dsGoiThauClone = this.chiTietThongTinDXKHLCNT.children2;
          this.baoGiaThiTruongList = [];
          this.canCuKhacList = [];
          this.convertDataCanCuXacDinh();
        }
      })
      .catch(() => {
        //TODO
      });
  }
  convertDataCanCuXacDinh() {
    this.chiTietThongTinDXKHLCNT.children3.forEach((chiTiet) => {
      if (chiTiet.loaiCanCu == '00') {
        this.baoGiaThiTruongList.push(chiTiet);
      } else if (chiTiet.loaiCanCu == '01') {
        this.canCuKhacList.push(chiTiet);
      }
    });
  }
  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: VatTu,
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  searchHangHoa(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectHangHoa(vatTu: any) {
    this.chiTietThongTinDXKHLCNT.loaiVthh = vatTu.ten;
  }
  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.listOfMapData = hangHoa.data;
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
    });
  }
  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }
  saveThongTinDeXuatKeHoachLCNT() {
    if (this.id > 0) {
      this.thongTinDXKHLCNTInput = this.chiTietThongTinDXKHLCNT;

      this.thongTinDXKHLCNTInput.fileDinhKems =
        this.chiTietThongTinDXKHLCNT.children;
      this.thongTinDXKHLCNTInput.detail1 =
        this.chiTietThongTinDXKHLCNT.children1;
      this.thongTinDXKHLCNTInput.detail2 =
        this.chiTietThongTinDXKHLCNT.children2;
      this.thongTinDXKHLCNTInput.detail3 =
        this.chiTietThongTinDXKHLCNT.children3;
      if (this.thongTinDXKHLCNTInput?.detail3.length > 0) {
        this.thongTinDXKHLCNTInput.detail3.forEach((thongTin) => {
          thongTin.fileDinhKems = thongTin.children;
          delete thongTin.children;
        });
      }
      delete this.thongTinDXKHLCNTInput.children;
      delete this.thongTinDXKHLCNTInput.children1;
      delete this.thongTinDXKHLCNTInput.children2;
      delete this.thongTinDXKHLCNTInput.children3;

      this.spinner.show();
      this.dauThauService
        .suaThongTinKeHoachLCNT(this.thongTinDXKHLCNTInput)
        .then((res) => {})
        .catch((err) => {})
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.chiTietThongTinDXKHLCNT.trangThai = '00';
      this.chiTietThongTinDXKHLCNT.loaiVthh = '00';
      this.chiTietThongTinDXKHLCNT.children1 = [];
      this.thongTinChungDXKHLCNT.tuNgayThHien = this.thongTinChungDXKHLCNT
        .tuNgayThHien
        ? dayjs(this.thongTinChungDXKHLCNT.tuNgayThHien).format('YYYY-MM-DD')
        : null;
      this.thongTinChungDXKHLCNT.denNgayThHien = this.thongTinChungDXKHLCNT
        .denNgayThHien
        ? dayjs(this.thongTinChungDXKHLCNT.denNgayThHien).format('YYYY-MM-DD')
        : null;
      this.thongTinChungDXKHLCNT.tgianTbao = this.thongTinChungDXKHLCNT
        .tgianTbao
        ? dayjs(this.thongTinChungDXKHLCNT.tgianTbao).format('YYYY-MM-DD')
        : null;
      this.thongTinChungDXKHLCNT.tgianDongThau = this.thongTinChungDXKHLCNT
        .tgianDongThau
        ? dayjs(this.thongTinChungDXKHLCNT.tgianDongThau).format('YYYY-MM-DD')
        : null;
      this.thongTinChungDXKHLCNT.tgianMoThau = this.thongTinChungDXKHLCNT
        .tgianMoThau
        ? dayjs(this.thongTinChungDXKHLCNT.tgianMoThau).format('YYYY-MM-DD')
        : null;
      this.thongTinChungDXKHLCNT.tgianThHienHd = this.thongTinChungDXKHLCNT
        .tgianThHienHd
        ? dayjs(this.thongTinChungDXKHLCNT.tgianThHienHd).format('YYYY-MM-DD')
        : null;
      this.thongTinChungDXKHLCNT.tgianNhapHang = this.thongTinChungDXKHLCNT
        .tgianNhapHang
        ? dayjs(this.thongTinChungDXKHLCNT.tgianNhapHang).format('YYYY-MM-DD')
        : null;

      this.chiTietThongTinDXKHLCNT.children1[0] = this.thongTinChungDXKHLCNT;
      this.thongTinDXKHLCNTInput = this.chiTietThongTinDXKHLCNT;
      this.thongTinDXKHLCNTInput.detail1 = [];
      this.thongTinDXKHLCNTInput.detail2 = [];
      this.thongTinDXKHLCNTInput.detail3 = [];
      this.thongTinDXKHLCNTInput.fileDinhKems = [];
      this.thongTinDXKHLCNTInput.fileDinhKems =
        this.chiTietThongTinDXKHLCNT.children;
      this.thongTinDXKHLCNTInput.detail1 =
        this.chiTietThongTinDXKHLCNT.children1;
      this.thongTinDXKHLCNTInput.detail2 =
        this.chiTietThongTinDXKHLCNT.children2;
      this.thongTinDXKHLCNTInput.detail3 =
        this.chiTietThongTinDXKHLCNT.children3;
      if (this.thongTinDXKHLCNTInput?.detail3.length > 0) {
        this.thongTinDXKHLCNTInput.detail3.forEach((thongTin) => {
          thongTin.fileDinhKems = thongTin.children;
          delete thongTin.children;
        });
      }
      this.thongTinDXKHLCNTInput.detail2.forEach((thongTin) => {
        delete thongTin.idVirtual;
      });
      delete this.thongTinDXKHLCNTInput.children;
      delete this.thongTinDXKHLCNTInput.children1;
      delete this.thongTinDXKHLCNTInput.children2;
      delete this.thongTinDXKHLCNTInput.children3;

      console.log('123: ', this.thongTinDXKHLCNTInput);

      this.spinner.show();
      this.dauThauService
        .themThongTinKeHoachLCNT(this.thongTinDXKHLCNTInput)
        .then((res) => {})
        .catch((err) => {})
        .finally(() => {
          this.spinner.hide();
        });
    }
  }
  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }
  calclatorThanhTien() {
    // this.editCache[data.id].data.soLuong
  }
  deleteTaiLieu(id: number) {
    this.chiTietThongTinDXKHLCNT.children3 =
      this.chiTietThongTinDXKHLCNT.children3.filter(
        (chiTiet) => chiTiet.id !== id,
      );

    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (cc1) => cc1.id !== id,
    );
    this.canCuKhacList = this.canCuKhacList.filter((cc2) => cc2.id !== id);
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
          let body = {
            id: 0,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          await this.dauThauService.updateStatus(body);
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
            id: 0,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          await this.dauThauService.updateStatus(body);
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
            id: 0,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          await this.dauThauService.updateStatus(body);
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.router.navigate(['nhap/dau-thau/danh-sach-dau-thau']);
      },
    });
  }
}
