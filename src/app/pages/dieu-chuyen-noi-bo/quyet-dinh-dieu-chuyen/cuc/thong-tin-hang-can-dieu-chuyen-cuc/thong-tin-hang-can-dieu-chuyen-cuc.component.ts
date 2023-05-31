import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Base2Component } from "src/app/components/base2/base2.component";

@Component({
  selector: 'app-thong-tin-hang-can-dieu-chuyen-cuc',
  templateUrl: './thong-tin-hang-can-dieu-chuyen-cuc.component.html',
  styleUrls: ['./thong-tin-hang-can-dieu-chuyen-cuc.component.scss']
})
export class ThongTinHangCanDieuChuyenCucComponent extends Base2Component implements OnInit {

  formData: FormGroup
  fb: FormBuilder = new FormBuilder();

  danhSachKeHoach: any[] = [];
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
      thayDoiThuKho: [],
      slDcConLai: [],
      tichLuongKd: [],
      soLuongPhanBo: [],
    }
    );
  }

  ngOnInit(): void {
    const dis = this.danhSachKeHoach.find(item => item.maChiCucNhan === this.data.maChiCucNhan)
    console.log('dis', !!dis, this.danhSachKeHoach, this.data)
    this.handleData()
  }

  handleOk(item: any) {
    this._modalRef.close({
      ...item,
      isUpdate: !!this.data
    });
  }

  onCancel() {
    this._modalRef.close();
  }

  async handleData() {
    if (!this.data) return
    await this.spinner.show()

    if (this.data.maChiCucNhan) await this.getListDiemKho(this.data.maChiCucNhan)
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

    this.getListDiemKho(value)
    if (chiCuc) {
      this.formData.patchValue({
        tenChiCucNhan: chiCuc.tenDvi
      })
    }
  }

  checkDisabledOption(value, key): boolean {
    const check = this.danhSachKeHoach.find(item => item[key] === value)
    return !!check
  }

  checkDisabledDiemKho(value): boolean {
    const check = this.danhSachKeHoach.find(item => (item.maChiCucNhan === this.formData.value.maChiCucNhan) && (item.maDiemKho === value))
    return !!check
  }

  checkDisabledNganKho(value): boolean {
    const dsLoKh = this.dsNganKho.find(f => f.maDvi === value)?.children;
    if (dsLoKh.length == 0) {
      const check = this.danhSachKeHoach.find(item => (item.maChiCucNhan === this.formData.value.maChiCucNhan) && (item.maDiemKho === this.formData.value.maDiemKho) && (item.maNhaKho === this.formData.value.maNhaKho) && (item.maNganKho === value))
      return !!check
    }
    return false
  }

  checkDisabledLoKho(value): boolean {
    const check = this.danhSachKeHoach.find(item => (item.maChiCucNhan === this.formData.value.maChiCucNhan) && (item.maDiemKho === this.formData.value.maDiemKho) && (item.maNhaKho === this.formData.value.maNhaKho) && (item.maNganKho === this.formData.value.maNganKho) && (item.maLoKho === value))
    return !!check
  }

  checkDisabledNganKhoNhan(value): boolean {
    const dsLoKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)?.children;
    if (dsLoKhoNhan.length == 0) {
      const check = this.danhSachKeHoach.find(item =>
        (item.maChiCucNhan === this.formData.value.maChiCucNhan) &&
        (item.maDiemKho === this.formData.value.maDiemKho) &&
        (item.maNhaKho === this.formData.value.maNhaKho) &&
        (item.maNganKho === this.formData.value.maNganKho) &&
        (item.maLoKho === this.formData.value.maLoKho) &&
        (item.maDiemKhoNhan === this.formData.value.maDiemKhoNhan) &&
        (item.maNhaKhoNhan === this.formData.value.maNhaKhoNhan) &&
        (item.maNganKhoNhan === value)
      )
      return !!check
    }
    return false
  }

  checkDisabledLoKhoNhan(value): boolean {
    const check = this.danhSachKeHoach.find(item =>
      (item.maChiCucNhan === this.formData.value.maChiCucNhan) &&
      (item.maDiemKho === this.formData.value.maDiemKho) &&
      (item.maNhaKho === this.formData.value.maNhaKho) &&
      (item.maNganKho === this.formData.value.maNganKho) &&
      (item.maLoKho === this.formData.value.maLoKho) &&
      (item.maDiemKhoNhan === this.formData.value.maDiemKhoNhan) &&
      (item.maNhaKhoNhan === this.formData.value.maNhaKhoNhan) &&
      (item.maNganKhoNhan === this.formData.value.maNganKhoNhan) &&
      (item.maLoKhoNhan === value)
    )

    return !!check
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

        this.formData.patchValue({
          maNhaKho: "",
          tenDiemKho: diemKho.tenDvi
        })
        this.dsNhaKho = this.dsDiemKho.find(f => f.maDvi === value)?.children;

      }

    }
  }

  getListNhaKhoNhan(value) {
    if (value) {
      const diemKhoNhan = this.dsDiemKho.find(f => f.maDvi === value)
      if (diemKhoNhan) {
        this.formData.patchValue({
          maNhaKhoNhan: "",
          tenDiemKhoNhan: diemKhoNhan.tenDvi
        })
        this.dsNhaKhoNhan = this.dsDiemKhoNhan.find(f => f.maDvi === value)?.children;
      }

    }
  }

  getListNganKho(value) {
    if (value) {
      const nhaKho = this.dsNhaKho.find(f => f.maDvi === value)
      if (nhaKho) {
        this.formData.patchValue({
          maNganKho: "",
          maLoKho: "",
          tenNhaKho: nhaKho.tenDvi
        })
        this.dsNganKho = this.dsNhaKho.find(f => f.maDvi === value)?.children;
      }

    }
  }

  getListNganKhoNhan(value) {
    if (value) {
      const nhaKhoNhan = this.dsNhaKhoNhan.find(f => f.maDvi === value)
      if (nhaKhoNhan) {
        this.formData.patchValue({
          maNganKhoNhan: "",
          maLoKhoNhan: "",
          thayDoiThuKho: "",
          slDcConLai: "",
          tichLuongKd: "",
          tenNhaKhoNhan: nhaKhoNhan.tenDvi
        })
        this.dsNganKhoNhan = this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children;
      }

    }
  }

  async getListLoKho(value) {
    if (value) {
      const nganKho = this.dsNganKho.find(f => f.maDvi === value)
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
        const body = {
          maDvi: value,
          tenLoKho: loKho.tenDvi
        }
        const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
        if (res.statusCode == 0 && res.data.length > 0) {
          this.formData.patchValue({
            loaiVthh: res.data[0].loaiVthh,
            tenLoaiVthh: res.data[0].tenLoaiVthh,
            cloaiVthh: res.data[0].cloaiVthh,
            tenCloaiVthh: res.data[0].tenCloaiVthh,
            tonKho: res.data[0].slHienThoi,
            tenDonViTinh: res.data[0].tenDonViTinh,
          })
        } else {
          this.formData.patchValue({
            loaiVthh: "",
            tenLoaiVthh: "",
            cloaiVthh: "",
            tenCloaiVthh: "",
            tonKho: "",
            tenDonViTinh: "",
          })
        }

      }

    }

  }

  async getListLoKhoNhan(value) {
    if (value) {
      const nganKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)

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
          if (coLoKho) {
            this.dsLoKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)?.children;
          } else {
            this.dsLoKhoNhan = []
            if (this.formData.value.maDiemKho === this.formData.value.maDiemKhoNhan &&
              this.formData.value.maNhaKho === this.formData.value.maNhaKhoNhan &&
              this.formData.value.maNganKho === this.formData.value.maNganKhoNhan) {
              this.formData.patchValue({
                thayDoiThuKho: "Không"
              })
            } else {
              this.formData.patchValue({
                thayDoiThuKho: "Có"
              })
            }
          }

        }

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
        if (this.formData.value.maDiemKho === this.formData.value.maDiemKhoNhan &&
          this.formData.value.maNhaKho === this.formData.value.maNhaKhoNhan &&
          this.formData.value.maNganKho === this.formData.value.maNganKhoNhan &&
          this.formData.value.maLoKho === this.formData.value.maLoKhoNhan) {
          this.formData.patchValue({
            thayDoiThuKho: "Không"
          })
        } else {
          this.formData.patchValue({
            thayDoiThuKho: "Có"
          })
        }
      }
    }


  }

  onChangeSLNhapDc(value) {
    const slDcConLai = Number(this.formData.value.soLuongDc) - Number(value)
    if (slDcConLai >= 0) {
      this.formData.patchValue({
        slDcConLai: slDcConLai
      })
    }
  }


}
