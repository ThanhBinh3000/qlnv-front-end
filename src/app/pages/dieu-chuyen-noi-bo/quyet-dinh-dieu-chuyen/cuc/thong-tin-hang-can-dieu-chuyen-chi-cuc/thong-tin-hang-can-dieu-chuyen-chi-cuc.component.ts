import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { AMOUNT_NO_DECIMAL } from "src/app/Utility/utils";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: 'app-thong-tin-hang-can-dieu-chuyen-chi-cuc',
  templateUrl: './thong-tin-hang-can-dieu-chuyen-chi-cuc.component.html',
  styleUrls: ['./thong-tin-hang-can-dieu-chuyen-chi-cuc.component.scss']
})
export class ThongTinHangCanDieuChuyenChiCucComponent extends Base2Component implements OnInit {
  AMOUNT = AMOUNT_NO_DECIMAL;
  formData: FormGroup
  fb: FormBuilder = new FormBuilder();

  dsChiCuc: any[] = [];
  data: any

  dsDiemKho: any[] = [];

  dsNhaKho: any[] = [];
  dsNganKho: any[] = [];
  dsLoKho: any[] = [];

  dsDiemKhoNhan: any[] = [];

  dsNhaKhoNhan: any[] = [];
  dsNganKhoNhan: any[] = [];
  dsLoKhoNhan: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyHangTrongKhoService);
    this.formData = this.fb.group({
      maDvi: [],
      tenDvi: [],
      maChiCucNhan: [],
      tenChiCucNhan: [],
      maDiemKho: [],
      tenDiemKho: [],
      maNhaKho: [],
      tenNhaKho: [],
      maNganKho: [],
      tenNganKho: [],
      maLoKho: [],
      tenLoKho: [],
      thuKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      tonKho: [],
      tenDonViTinh: [],
      soLuongDc: [],
      duToanKphi: [],
      thoiGianDkDc: [],
      maDiemKhoNhan: [],
      tenDiemKhoNhan: [],
      maNhaKhoNhan: [],
      tenNhaKhoNhan: [],
      maNganKhoNhan: [],
      tenNganKhoNhan: [],
      maLoKhoNhan: [],
      tenLoKhoNhan: [],
      thuKhoNhan: [],
      thayDoiThuDo: [],
      tonKhoNhan: [],
      tenDonViTinhNhan: [],
      slDcConLai: [],
      tichLuongKd: [],
      soLuongPhanBo: [],
    }
    );
  }

  ngOnInit(): void {
    this.handleData()
  }

  handleOk(item: any) {
    this._modalRef.close({
      ...item,
      isUpdate: !!this.data.maDvi
    });
  }

  onCancel() {
    this._modalRef.close();
  }

  async handleData() {
    await this.spinner.show()
    if (this.data.maDvi) await this.getListDiemKho(this.data.maDvi)
    if (this.data.maDiemKho) await this.getListNhaKho(this.data.maDiemKho)
    if (this.data.maNhaKho) await this.getListNganKho(this.data.maNhaKho)
    if (this.data.maNganKho) await this.getListLoKho(this.data.maNganKho)

    if (this.data.maDiemKhoNhan) await this.getListNhaKhoNhan(this.data.maDiemKhoNhan)
    if (this.data.maNhaKhoNhan) await this.getListNganKhoNhan(this.data.maNhaKhoNhan)
    if (this.data.maNganKhoNhan) await this.getListLoKhoNhan(this.data.maNganKhoNhan)

    this.formData.patchValue(this.data)
    await this.spinner.hide();
  }

  async onChangeChiCucDC(value) {
    const chiCuc = this.dsChiCuc.find(item => item.key == value)
    console.log('chiCuc', chiCuc)
    this.getListDiemKho(value)
    if (chiCuc) {
      this.formData.patchValue({
        tenDvi: chiCuc.tenDvi
      })
    }
  }

  async getListDiemKho(maDvi) {
    if (maDvi) {
      try {
        let body = {
          maDviCha: maDvi,
          trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {

          if (res.data && res.data.length > 0) {
            res.data.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.dsDiemKho = [];
                this.dsDiemKho = [
                  ...this.dsDiemKho,
                  ...element.children.filter(item => item.type == 'MLK')
                ]
                this.dsDiemKhoNhan = this.dsDiemKho
                console.log('getListDiemKho', this.dsDiemKho)
              }
            });
          }
        }

      } catch (error) {
        // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        // this.spinner.hide();
      }
    }
  }



  getListNhaKho(value) {
    if (value) {
      const diemKho = this.dsDiemKho.find(f => f.maDvi === value)
      if (diemKho) {
        console.log('diemKho', diemKho, value, this.dsDiemKho)
        this.formData.patchValue({
          maNhaKho: "",
          tenDiemKho: diemKho.tenDvi
        })
        this.dsNhaKho = this.dsDiemKho.find(f => f.maDvi === value)?.children;
        console.log('getListNhaKho', value, this.dsNhaKho)
      }

    }
  }

  getListNhaKhoNhan(value) {
    if (value) {
      const diemKhoNhan = this.dsDiemKho.find(f => f.maDvi === value)
      if (diemKhoNhan) {
        console.log('diemKhoNhan', diemKhoNhan, value)
        this.formData.patchValue({
          maNhaKhoNhan: "",
          tenDiemKhoNhan: diemKhoNhan.tenDvi
        })
        this.dsNhaKhoNhan = this.dsDiemKhoNhan.find(f => f.maDvi === value)?.children;
        console.log('getListNhaKhoNhan', value, this.dsNhaKhoNhan)
      }

    }
  }

  getListNganKho(value) {
    if (value) {
      const nhaKho = this.dsNhaKho.find(f => f.maDvi === value)
      if (nhaKho) {
        console.log('nhaKho', nhaKho, this.dsNhaKho, value)
        this.formData.patchValue({
          maNganKho: "",
          tenNhaKho: nhaKho.tenDvi
        })
        this.dsNganKho = this.dsNhaKho.find(f => f.maDvi === value)?.children;
        console.log('getListNganKho', value, this.dsNganKho)
      }

    }
  }

  getListNganKhoNhan(value) {
    if (value) {
      const nhaKhoNhan = this.dsNhaKhoNhan.find(f => f.maDvi === value)
      if (nhaKhoNhan) {
        console.log('nhaKhoNhan', nhaKhoNhan)
        this.formData.patchValue({
          maNganKhoNhan: "",
          tenNhaKhoNhan: nhaKhoNhan.tenDvi
        })
        this.dsNganKhoNhan = this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children;
        console.log('getListNganKhoNhan', value, this.dsNganKhoNhan)
      }

    }
  }

  async getListLoKho(value) {
    if (value) {
      const nganKho = this.dsNganKho.find(f => f.maDvi === value)
      console.log('nganKho', nganKho)
      if (nganKho) {
        this.formData.patchValue({
          maLoKho: "",
          tenNganKho: nganKho.tenDvi
        })
        let body = {
          maDvi: nganKho.maDvi,
          capDvi: nganKho.capDvi
        }
        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {
          const coLoKho = detail.data.object.coLoKho
          const detailThuKho = detail.data.object.detailThuKho
          if (detailThuKho) {
            this.formData.patchValue({
              maThuKho: detailThuKho.maThuKho,
              thuKho: detailThuKho.hoTen
            })
          }
          if (coLoKho)
            this.dsLoKho = this.dsNganKho.find(f => f.maDvi === value)?.children;
          else {
            this.dsLoKho = []
            const body = {
              maDvi: value,
              tenLoKho: nganKho.tenDvi
            }
            const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
            if (res.statusCode == 0) {
              if (res.data.length > 0) {
                this.formData.patchValue({
                  loaiVthh: res.data[0].loaiVthh,
                  tenLoaiVthh: res.data[0].tenLoaiVthh,
                  cloaiVthh: res.data[0].cloaiVthh,
                  tenCloaiVthh: res.data[0].tenCloaiVthh,
                  tonKho: res.data[0].slHienThoi,
                  tenDonViTinh: res.data[0].tenDonViTinh,
                })
              }
            }
          }
        }

      }

    }
  }

  async onChangeLoKho(value) {
    if (value) {
      const loKho = this.dsLoKho.find(f => f.maDvi === value)
      if (loKho) {
        this.formData.patchValue({
          tenLoKho: loKho.tenDvi
        })
        console.log('onChangeLoKho', loKho)
        // return
        const body = {
          maDvi: value,
          tenLoKho: loKho.tenDvi
        }
        const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
        if (res.statusCode == 0) {
          if (res.data.length > 0) {
            this.formData.patchValue({
              loaiVthh: res.data[0].loaiVthh,
              tenLoaiVthh: res.data[0].tenLoaiVthh,
              cloaiVthh: res.data[0].cloaiVthh,
              tenCloaiVthh: res.data[0].tenCloaiVthh,
              tonKho: res.data[0].slHienThoi,
              tenDonViTinh: res.data[0].tenDonViTinh,
            })
          }
        }
        console.log('getTrangThaiHt', res)
      }

    }

  }

  async getListLoKhoNhan(value) {
    if (value) {
      const nganKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)
      console.log('nganKhoNhan', nganKhoNhan)
      if (nganKhoNhan) {
        this.formData.patchValue({
          maLoKhoNhan: "",
          tenNganKhoNhan: nganKhoNhan.tenDvi
        })
        let body = {
          maDvi: nganKhoNhan.maDvi,
          capDvi: nganKhoNhan.capDvi
        }
        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {
          const coLoKho = detail.data.object.coLoKho
          const tichLuongKdVt = detail.data.object.tichLuongKdVt
          this.formData.patchValue({
            tichLuongKd: tichLuongKdVt
          })
          const detailThuKho = detail.data.object.detailThuKho
          if (detailThuKho) {
            this.formData.patchValue({
              maThuKhoNhan: detailThuKho.maThuKho,
              thuKhoNhan: detailThuKho.hoTen
            })
          }
          if (coLoKho)
            this.dsLoKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)?.children;
          else {
            this.dsLoKhoNhan = []
            const body = {
              maDvi: value,
              tenLoKho: nganKhoNhan.tenDvi
            }
            const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
            if (res.statusCode == 0 && res.data.length > 0) {
              this.formData.patchValue({
                tonKhoNhan: res.data[0].slHienThoi,
                tenDonViTinhNhan: res.data[0].tenDonViTinh
              })
            } else {
              this.formData.patchValue({
                tonKhoNhan: "",
                tenDonViTinhNhan: ""
              })
            }
          }
        }

        console.log('getListLoKhoNhan', value, this.dsLoKhoNhan)
      }

    }
  }

  async onChangeLoKhoNhan(value) {
    if (value) {
      const loKhoNhan = this.dsLoKhoNhan.find(f => f.maDvi === value)
      if (loKhoNhan) {
        this.formData.patchValue({
          tenLoKhoNhan: loKhoNhan.tenDvi
        })
        const body = {
          maDvi: value,
          tenLoKho: this.formData.value.tenLoKhoNhan
        }
        const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
        if (res.statusCode == 0 && res.data.length > 0) {
          this.formData.patchValue({
            tonKhoNhan: res.data[0].slHienThoi,
            tenDonViTinhNhan: res.data[0].tenDonViTinh
          })
        } else {
          this.formData.patchValue({
            tonKhoNhan: "",
            tenDonViTinhNhan: ""
          })
        }
      }
    }


  }

  onChangeSLNhapDc(value) {
    console.log('onChangeSLNhapDc', value)
    if (value && value <= this.data.soLuongDc) {
      this.formData.patchValue({
        slDcConLai: Number(this.data.soLuongDc) - (value)
      })
    }
  }


}
