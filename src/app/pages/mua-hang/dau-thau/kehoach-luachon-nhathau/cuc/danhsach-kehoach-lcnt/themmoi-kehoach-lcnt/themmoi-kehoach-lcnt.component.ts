import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { CanCuXacDinh, DanhSachGoiThau, FileDinhKem, ThongTinChung, ThongTinDeXuatKeHoachLuaChonNhaThau, ThongTinDeXuatKeHoachLuaChonNhaThauInput } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { Globals } from 'src/app/shared/globals';
import { LEVEL, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { convertVthhToId } from 'src/app/shared/commonFunction';

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
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss']
})
export class ThemmoiKehoachLcntComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  listOfData: DanhSachGoiThau[] = [];
  cacheData : DanhSachGoiThau[] = [];

  id: number;
  formData: FormGroup;
  formThongTinChung : FormGroup;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  i = 0;
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listVthh: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  chiTietThongTinDXKHLCNT: ThongTinDeXuatKeHoachLuaChonNhaThau =  new ThongTinDeXuatKeHoachLuaChonNhaThau();
  thongTinChungDXKHLCNT: ThongTinChung = new ThongTinChung();
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  thongTinDXKHLCNTInput: ThongTinDeXuatKeHoachLuaChonNhaThauInput = new ThongTinDeXuatKeHoachLuaChonNhaThauInput();

  // editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau }; } = {};

  dsGoiThauClone: Array<DanhSachGoiThau>;
  baoGiaThiTruongList: Array<CanCuXacDinh> = [];
  canCuKhacList: Array<CanCuXacDinh> = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;
  vatTuIdDefault: string = LOAI_HANG_DTQG.VAT_TU;


  // muoiIdDefault: number = 78;
  tongGiaTriCacGoiThau: number = 0;
  tenTaiLieuDinhKem: string;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'tong-hop';

  constructor(
    private modal: NzModalService,
    private routerActive: ActivatedRoute,
    private router: Router,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
  ) { }

  startEdit(index: number): void {
    this.editCache[index].edit = true;
  }

  cancelEdit(index: number): void {
    this.editCache[index].edit = false;
  }

  saveEdit(index: number): void {
    Object.assign(
      this.listOfData[index],
      this.editCache[index].data,
    );

    this.editCache[index].edit = false;
    // this.dsGoiThauClone?.forEach((goiThau) => {
    //   goiThau.thanhTien = (goiThau.donGia * goiThau.soLuong * 1000).toString();
    //   this.tongGiaTriCacGoiThau += +goiThau.thanhTien;
    // });
    // if (this.tongGiaTriCacGoiThau > 10000000000) {
    //   this.thongTinChungDXKHLCNT.blanhDthau = '3%';
    // } else {
    //   this.thongTinChungDXKHLCNT.blanhDthau = '1%';
    // }
  }

  deleteRow(idVirtual: number): void {
      this.listOfData = this.listOfData.filter(d => d.idVirtual !== idVirtual);
    // this.chiTietThongTinDXKHLCNT.children2 =
    //   this.chiTietThongTinDXKHLCNT.children2.filter(
    //     (d) => d.idVirtual !== idVirtual,
    //   );
    // Object.assign(this.dsGoiThauClone, this.chiTietThongTinDXKHLCNT.children2);
  }

  ngOnInit(): void {
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    this.initForm();
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

  initForm() {
    let vthh = this.router.url.split('/')[4];
    this.formData = this.fb.group(
      {
        soQd: [ null, [Validators.required] ],
        soDxuat: [ null,[Validators.required]],
        maHangHoa: [null,],
        trichYeu: [  'Trich yeu', ],
        ghiChu: [  'Ghi chu' ,  [Validators.required]],
        namKhoach : [ dayjs().get('year') ,[Validators.required]],
        loaiVthh : [ convertVthhToId(vthh) , [Validators.required] ],
        ngayKy : [,[Validators.required]],
      }
    );
    this.formThongTinChung = this.fb.group(
      {
        tenDuAn : ['tenDuAn',[Validators.required]],
        chuDauTu : ['abcc',[Validators.required]],
        tongMucDt : [1000,[Validators.required]],
        nguonVon : ['NGV01',[Validators.required]],
        tchuanCluong : ['Tieu chuan chat luong',[Validators.required]],
        loaiHdong : [null,[Validators.required]],
        hthucLcnt : [null,[Validators.required]],
        pthucLcnt : [null,[Validators.required]],
        donGiaTtinh : [null,[Validators.required]],
        tgianTbao : [null,[Validators.required]],
        tgianMoiThau : [null,[Validators.required]],
        tgianMoThau : [null,[Validators.required]],
        tgianDongThau : [null,[Validators.required]],
        tgianThHienHd : [null,[Validators.required]],
        tgianNhapHang : [null,[Validators.required]],
      }
    )
  }

  editCanCuTaiLieuDinhKem(data: CanCuXacDinh, type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Chỉnh sửa căn cứ xác định giá',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataCanCuXacDinh: data,
        type: type,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            switch (type) {
              case 'bao-gia-thi-truong':
                this.baoGiaThiTruongList.forEach((baoGia) => {
                  if (baoGia.idVirtual == data.idVirtual) {
                    baoGia.children[0].fileName = resUpload.filename;
                    baoGia.children[0].fileSize = resUpload.size;
                    baoGia.children[0].fileUrl = resUpload.url;
                  }
                });
                break;
              case 'can-cu-khac':
                this.canCuKhacList.forEach((canCu) => {
                  if (canCu.idVirtual == data.idVirtual) {
                    canCu.children[0].fileName = resUpload.filename;
                    canCu.children[0].fileSize = resUpload.size;
                    canCu.children[0].fileUrl = resUpload.url;
                  }
                });
                break;
              default:
                break;
            }
          });
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
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            switch (type) {
              case 'tai-lieu-dinh-kem':
                this.tenTaiLieuDinhKem = resUpload.filename;
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
                taiLieuBaoGiaThiTruong.idVirtual = new Date().getTime();
                taiLieuBaoGiaThiTruong.children = [];
                taiLieuBaoGiaThiTruong.children = [
                  ...taiLieuBaoGiaThiTruong.children,
                  fileDinhKem,
                ];
                this.chiTietThongTinDXKHLCNT?.children3.push(
                  taiLieuBaoGiaThiTruong,
                );
                this.baoGiaThiTruongList = [
                  ...this.baoGiaThiTruongList,
                  taiLieuBaoGiaThiTruong,
                ];
                break;
              case 'can-cu-khac':
                const taiLieuCanCuKhac = new CanCuXacDinh();
                taiLieuCanCuKhac.loaiCanCu = '01';
                taiLieuCanCuKhac.tenTlieu = res.tenTaiLieu;
                taiLieuCanCuKhac.idVirtual = new Date().getTime();
                taiLieuCanCuKhac.children = [];
                taiLieuCanCuKhac.children = [
                  ...taiLieuCanCuKhac.children,
                  fileDinhKem,
                ];
                this.chiTietThongTinDXKHLCNT?.children3.push(taiLieuCanCuKhac);
                this.canCuKhacList = [...this.canCuKhacList, taiLieuCanCuKhac];
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
      dsGoiThauDialog.maDvi = res.value.maDvi;
      dsGoiThauDialog.maDiemKho = res.value.maDiemKho;
      dsGoiThauDialog.donGia = +res.value.donGia;
      dsGoiThauDialog.goiThau = res.value.goiThau;
      // dsGoiThauDialog.id = +res.value.id;
      dsGoiThauDialog.soLuong = +res.value.soLuong;
      dsGoiThauDialog.thanhTien = res.value.thanhTien;
      dsGoiThauDialog.idVirtual = new Date().getTime();

      // this.chiTietThongTinDXKHLCNT.children2 = [
      //   ...this.chiTietThongTinDXKHLCNT.children2,
      //   dsGoiThauDialog,
      // ];

      this.listOfData = [
        ...this.listOfData,
        dsGoiThauDialog
      ]

      this.listOfData.forEach((value, index) => {
        this.editCache[index] = {
          edit: false,
          data: { ...value }
        };
      })
      // this.cacheData = this.listOfData;
      // this.dsGoiThauClone = this.chiTietThongTinDXKHLCNT.children2;
      this.dsGoiThauClone?.forEach((goiThau) => {
        this.tongGiaTriCacGoiThau += +goiThau.thanhTien;
      });
      if (this.tongGiaTriCacGoiThau > 10000000000) {
        this.thongTinChungDXKHLCNT.blanhDthau = '3%';
      } else {
        this.thongTinChungDXKHLCNT.blanhDthau = '1%';
      }
    });
  }

  async themMoi(){
    // console.log(this.formData.value);
    let body = this.formData.value;
    body.detail1 = this.formThongTinChung.value;
    body.detail2 = this.listOfData
    // this.dauThauService.create()
    let res = await this.dauThauService.create(body);
    console.log(res);
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
        // this.chiTietThongTinDXKHLCNT.qdCanCu = data.soQuyetDinh;
        this.formData.patchValue({
          canCu: data.soQuyetDinh,
        });
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
          this.tenTaiLieuDinhKem =
            this.chiTietThongTinDXKHLCNT.children[0]?.fileName;
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
          this.initForm();
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
    this.formData.patchValue({
      hangHoa: vatTu.ten,
      maHangHoa: vatTu.ma,
    });
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

  saveThongTinDeXuatKeHoachLCNT(isGuiDuyet?: boolean) {
    this.chiTietThongTinDXKHLCNT.qdCanCu = this.formData.get('canCu').value;
    this.chiTietThongTinDXKHLCNT.soDxuat = this.formData.get('soDeXuat').value;
    this.chiTietThongTinDXKHLCNT.loaiVthh = this.formData.get('hangHoa').value;
    this.chiTietThongTinDXKHLCNT.trichYeu = this.formData.get('trichYeu').value;
    this.chiTietThongTinDXKHLCNT.ghiChu = this.formData.get('ghiChu').value;
    this.thongTinDXKHLCNTInput = cloneDeep(this.chiTietThongTinDXKHLCNT);

    this.thongTinChungDXKHLCNT.tuNgayThHien = this.thongTinChungDXKHLCNT
      .tuNgayThHien
      ? dayjs(this.thongTinChungDXKHLCNT.tuNgayThHien).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.denNgayThHien = this.thongTinChungDXKHLCNT
      .denNgayThHien
      ? dayjs(this.thongTinChungDXKHLCNT.denNgayThHien).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.tgianTbao = this.thongTinChungDXKHLCNT.tgianTbao
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

    this.chiTietThongTinDXKHLCNT.children1 = [];
    this.chiTietThongTinDXKHLCNT.children1[0] = this.thongTinChungDXKHLCNT;

    this.thongTinDXKHLCNTInput.fileDinhKems =
      this.chiTietThongTinDXKHLCNT.children;
    this.thongTinDXKHLCNTInput.detail1 = this.chiTietThongTinDXKHLCNT.children1;
    this.thongTinDXKHLCNTInput.detail2 = this.chiTietThongTinDXKHLCNT.children2;
    this.thongTinDXKHLCNTInput.detail3 = this.chiTietThongTinDXKHLCNT.children3;
    if (this.thongTinDXKHLCNTInput?.detail3?.length > 0) {
      this.thongTinDXKHLCNTInput.detail3.forEach((thongTin) => {
        thongTin.fileDinhKems = thongTin.children;
        delete thongTin.children;
      });
    }
    delete this.thongTinDXKHLCNTInput.children;
    delete this.thongTinDXKHLCNTInput.children1;
    delete this.thongTinDXKHLCNTInput.children2;
    delete this.thongTinDXKHLCNTInput.children3;

    this.thongTinDXKHLCNTInput?.detail2?.forEach((thongTin) => {
      delete thongTin.idVirtual;
    });

    if (this.id > 0) {
      this.spinner.show();
      this.dauThauService
        .suaThongTinKeHoachLCNT(this.thongTinDXKHLCNTInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDoTuChoi: null,
                trangThai: '01',
              };
              this.dauThauService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.redirectChiTieuKeHoachNam();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectChiTieuKeHoachNam();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.redirectChiTieuKeHoachNam();
        })
        .catch((err) => { })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.spinner.show();
      this.dauThauService
        .themThongTinKeHoachLCNT(this.thongTinDXKHLCNTInput)
        .then((res) => {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDoTuChoi: null,
              trangThai: '01',
            };
            this.dauThauService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectChiTieuKeHoachNam();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectChiTieuKeHoachNam();
          }
        })
        .catch((err) => { })
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
  deleteTaiLieu(idVirtual: number) {
    this.chiTietThongTinDXKHLCNT.children3 =
      this.chiTietThongTinDXKHLCNT.children3.filter(
        (chiTiet) => chiTiet.idVirtual !== idVirtual,
      );

    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (cc1) => cc1.idVirtual !== idVirtual,
    );
    this.canCuKhacList = this.canCuKhacList.filter(
      (cc2) => cc2.idVirtual !== idVirtual,
    );
  }
  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/nhap/dau-thau/danh-sach-dau-thau']);
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
          this.saveThongTinDeXuatKeHoachLCNT(true);
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
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          const res = await this.dauThauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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
            trangThai: '03',
          };
          const res = await this.dauThauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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
        this.redirectChiTieuKeHoachNam();
      },
    });
  }
  export() {
    const workbook = XLSX.utils.book_new();
    if (this.tabSelected == 'dsGoiThau') {
      const tableDanhSachGoiThau = document
        .getElementById('table-danh-sach-goi-thau')
        .getElementsByTagName('table');
      if (tableDanhSachGoiThau && tableDanhSachGoiThau.length > 0) {
        let sheetLuongThuc = XLSX.utils.table_to_sheet(tableDanhSachGoiThau[0]);
        sheetLuongThuc['!cols'] = [];
        sheetLuongThuc['!cols'][7] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheetLuongThuc,
          'Danh sách đấu thầu',
        );
        XLSX.writeFile(workbook, 'danh-sach-dau-thau.xlsx');
      }
    } else if (this.tabSelected == 'ccXacDinh') {
      const tableBaoGiaThiTruong = document
        .getElementById('table-bao-gia-thi-truong')
        .getElementsByTagName('table');
      if (tableBaoGiaThiTruong && tableBaoGiaThiTruong.length > 0) {
        let sheetLuongThuc = XLSX.utils.table_to_sheet(tableBaoGiaThiTruong[0]);
        sheetLuongThuc['!cols'] = [];
        sheetLuongThuc['!cols'][2] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheetLuongThuc,
          'Báo giá thị trường',
        );
      }
      const tableCanCuXacDinh = document
        .getElementById('table-can-cu-khac')
        .getElementsByTagName('table');
      if (tableCanCuXacDinh && tableCanCuXacDinh.length > 0) {
        let sheetLuongThuc = XLSX.utils.table_to_sheet(tableCanCuXacDinh[0]);
        sheetLuongThuc['!cols'] = [];
        sheetLuongThuc['!cols'][2] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheetLuongThuc,
          'Căn cứ xác định',
        );
      }
      XLSX.writeFile(workbook, 'can-cu-xac-dinh.xlsx');
    }
  }
  selectTabMenu(tab) {
    if (tab == this.selectedTab) {
      return;
    }
    if (tab == 'tong-hop') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    } else if (tab == 'phuong-an') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    } else if (tab == 'phe-duyet') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    }
  }
}
