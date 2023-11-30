import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {
  HopDongThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HopDongThanhLy.service";
import {STATUS} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  QuyetDinhPheDuyetKetQuaService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {
  ToChucThucHienThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";
import {MESSAGE} from "../../../../../../constants/message";
import {chain, cloneDeep, isEmpty} from 'lodash';
import * as uuid from "uuid";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-thong-tin-hop-dong-thanh-ly',
  templateUrl: './thong-tin-hop-dong-thanh-ly.component.html',
  styleUrls: ['./thong-tin-hop-dong-thanh-ly.component.scss']
})
export class ThongTinHopDongThanhLyComponent extends Base3Component implements OnInit, OnChanges {
  @Input() id: number;
  @Input() isQuanLy: boolean;
  @Input() isView: boolean;

  listLoaiHopDong: any[] = [];
  maHopDongSuffix: string = '';
  listToChucTrungDg: any[] = [];
  listDviTsan: any[] = [];
  listThongTinBenMua: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: HopDongThanhLyService,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal,route,router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/hop-dong'
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: [''],
        tenDvi: [''],
        idQdKqTl: ['', [Validators.required]],
        soQdKqTl: ['', [Validators.required]],
        ngayKyQdkqTl: [''],
        soQdTl: [''],
        toChucCaNhan: [null, [Validators.required]],
        maDviTsan: [''],
        listMaDviTsan: [null, [Validators.required]],
        thoiHanXuatKho: [''],
        loaiHinhNx: [''],
        tenLoaiHinhNx: [''],
        kieuNx: [''],
        tenKieuNx: [''],
        soHd: ['',[Validators.required]],
        tenHd: ['',[Validators.required]],
        ngayHieuLuc: ['',[Validators.required]],
        ghiChuNgayHluc: ['',],
        loaiHdong: ['',[Validators.required]],
        ghiChuLoaiHdong: ['',],
        tgianThienHd: ['',[Validators.required]],
        tgianBhanh: [''],
        diaChiBenBan: [''],
        mstBenBan: [''],
        daiDienBenBan: [''],
        chucVuBenBan: [''],
        sdtBenBan: [''],
        faxBenBan: [''],
        stkBenBan: [''],
        moTaiBenBan: [''],
        thongTinUyQuyen: [''],
        tenDviBenMua: [''],
        diaChiBenMua: [''],
        mstBenMua: [''],
        daiDienBenMua: [''],
        chucVuBenMua: [''],
        sdtBenMua: [''],
        faxBenMua: [''],
        stkBenMua: [''],
        moTaiBenMua: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        soLuong: [],
        thanhTien: [],
        ghiChu: [''],
        trangThai: [''],
        tenTrangThai: [''],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
      this.getId();
      await Promise.all([
        this.loadDataComboBox(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    console.log(this.userInfo);
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChiBenBan: this.userInfo.DON_VI.diaChi ?? null,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!changes.id.isFirstChange()) {
      this.ngOnInit()
    }
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
      soHd: data?.soHd?.split('/')[0],
    });
    this.fileCanCu = data.fileCanCu;
    this.fileDinhKem = data.fileDinhKem;
    if(data.idQdKqTl){
      await this.onChangeKqBdg(data.idQdKqTl);
    }
    this.maDviTsan(data.toChucCaNhan);
    this.selectMaDviTsan(data.listMaDviTsan);
  }

  async save(isGuiDuyet?) {
    try {
      let body = this.formData.value;
      if (body.listMaDviTsan) {
        body.maDviTsan = body.listMaDviTsan.join(',');
      }
      if (body.soHd) {
        body.soHd = this.formData.value.soHd + this.maHopDongSuffix;
      }
      body.children = this.dataTable;
      body.fileDinhKemReq = this.fileDinhKem;
      body.fileCanCuReq = this.fileCanCu
      this.createUpdate(body).then((res) => {
        if (res) {
          if (isGuiDuyet) {
            this.id = res.id;
            this.approve(this.id,this.STATUS.DA_KY,"Xác nhận văn bản đã ký",null,"Hợp đồng đã ký")
          } else {
            this.goBack();
          }
        }
      })
    } catch (e) {
    }
  }

  async openDialogKqTlBdg() {
    await this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      nam: this.formData.value.nam,
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.quyetDinhPheDuyetKetQuaService.dsTaoHopDong(body)
    if (res.data) {
      listQdKq = res.data;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN QUYẾT ĐỊNH PHÊ DUYỆT KẾT QUẢ BÁN ĐẤU GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ PDKQ BĐG', 'Số biên bản', 'Mã thông báo'],
        dataColumn: ['soQd', 'soBienBan', 'maThongBao'],
        dataTable: listQdKq
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeKqBdg(data.id);
      }
    });
  }

  async onChangeKqBdg(id) {
    if (id > 0) {
      this.spinner.show()
      await this.quyetDinhPheDuyetKetQuaService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQdKq = res.data;
            let resttin = await this.toChucThucHienThanhLyService.getDetail(dataQdKq.idThongBao);
            if (resttin.msg == MESSAGE.SUCCESS) {
              this.formData.patchValue({
                idQdKqTl: dataQdKq.id,
                soQdKqTl: dataQdKq.soQd,
                ngayKyQdkqTl: dataQdKq.ngayKy,
                soQdTl: dataQdKq.xhTlQuyetDinhHdr.soQd,
                loaiHinhNx: dataQdKq.loaiHinhNhapXuat,
                tenLoaiHinhNx: dataQdKq.tenLoaiHinhNx,
                kieuNx: dataQdKq.kieuNhapXuat,
                tenKieuNx: dataQdKq.tenKieuNx,
              });
              const dataThongTin = resttin.data;
              this.listThongTinBenMua = dataThongTin.childrenNlq.filter(item => item.loai == 'NTG');
              this.listToChucTrungDg = [];
              // Loop data children để lấy ra các teen tổ chức và mã đơn vị tài sản
              // Chỉ lấy ra những Ds HDR có tổ chức cá nhân != null và có id Hợp dồng == null hoặc trùng với id hiện tại
              dataThongTin.children.filter(x => x.toChucCaNhan != null && (x.idHopDongTl == null || x.idHopDongTl == this.id)).forEach( item => {
                // Check nếu trùng tổ chức cá nhân sẽ thêm vào mã đơn vị tài sản
                let find = this.listToChucTrungDg.filter(x => x.key == item.toChucCaNhan);
                if(find.length > 0){
                  const index = this.listToChucTrungDg.indexOf(find[0]);
                  let data = find[0];
                  // Check trùng mã đơn vị tài sản
                  let dviTsan = data.value.filter(x => x.key == item.maDviTsan);
                  // Nếu trùng thì append thêm ds hdr vào
                  if(dviTsan.length > 0){
                    console.log(dviTsan);
                    dviTsan[0].dsHdr = [...dviTsan[0].dsHdr,item.xhTlDanhSachHdr];
                  }
                  // Không trùng thì thêm mới mã dvi tài sản
                  else{
                    data.value = [...data.value,{
                      key : item.maDviTsan,
                      dsHdr : [item.xhTlDanhSachHdr]
                    }];
                  }
                  this.listToChucTrungDg[index] = data;
                }else{
                  let body = {
                    key : item.toChucCaNhan,
                    value : [
                      {
                        key : item.maDviTsan,
                        dsHdr : [item.xhTlDanhSachHdr]
                      }
                    ]
                  }
                  this.listToChucTrungDg.push(body);
                }
              });
            }
          }
          this.spinner.hide()
        })
    }
  }

  maDviTsan(event) {
    let thongTin = this.listToChucTrungDg.find(f => f.key === event);
    let ttBenMua = this.listThongTinBenMua.find(f => f.hoVaTen === event);
    if (thongTin) {
      this.listDviTsan = thongTin.value;
    }
    if (ttBenMua) {
      console.log(ttBenMua)
      this.formData.patchValue({
        tenDviBenMua : ttBenMua.hoVaTen,
        diaChiBenMua : ttBenMua.diaChi,
        mstBenMua : ttBenMua.soCccd
      })
    }
  }

  goBack(){
    window.history.back();
  }

  async selectMaDviTsan(event) {
    this.dataTable = [];
    event?.forEach( item => {
      let maDviTsan = this.listDviTsan.find(f => f.key === item);
      if(maDviTsan){
        maDviTsan.dsHdr.forEach(ds => {
          ds.idDsHdr = ds.id;
          this.dataTable.push(ds);
        })
      }
    })
    this.dataTableAll = chain(this.dataTable).groupBy('tenChiCuc').map((value, key) => ({
        tenDonVi: key,
        children: value,
        expandSet : true
      })
    ).value()
  }

  async buildTableView(data?: any) {
    let dataView = await chain(data)
      .groupBy("tenChiCuc")
      .map(async (value, key) => {
        this.formData.patchValue({
          soLuong: value.reduce((prev, cur) => prev + cur.slDauGia, 0),
          thanhTien: value.reduce((prev, cur) => prev + cur.thanhTien, 0),
        })
        let tongThanhTien = value.reduce((prev, cur) => prev + cur.thanhTien, 0);
        let slDauGiaChiCuc = value.reduce((prev, cur) => prev + cur.slDauGia, 0);
        let tenChiCuc = value.find(f => f.tenChiCuc === key);
        return {
          idVirtual: uuid.v4(),
          tenChiCuc: key,
          maDvi: tenChiCuc?.maDiaDiem.substring(0, 6),
          children: value,
          slDauGiaChiCuc: slDauGiaChiCuc,
          tongThanhTien: tongThanhTien
        };
      }).value();
    dataView = await Promise.all(dataView);
    this.dataTable = dataView;
    await this.loadDiaDiemKho();
  }

  async loadDiaDiemKho() {
    for (const item of this.dataTable) {
      let body = {
        trangThai: "01",
        maDviCha: item.maDvi
      };
      const res = await this.donViService.getAll(body);
      const dataDk = res.data;
      if (dataDk) {
        item.children.forEach((child) => {
          let diaDiemXuat = dataDk.filter(item => item.maDvi == child.maDiaDiem.substring(0, 8));
          diaDiemXuat.forEach(s => {
            child.diaDiemXuat = s.diaChi;
          });
        });
      }
    }
  }

  redirectDefault() {
    window.history.back();
  }

  isDisabled() {
    return false;
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  calcTong(column) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }

  onChangeNgayHl($event){
    let day =  dayjs($event).add(15,'day')
    console.log(day)
      this.formData.patchValue({
        thoiHanXuatKho : day.format("YYYY-MM-DD")
      })
  }
}

