import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Base2Component } from "src/app/components/base2/base2.component";
import { CurrencyMaskInputMode } from "ngx-currency";

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

  max: number = 0

  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

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
      maChiCucNhan: [, [Validators.required]],
      tenChiCucNhan: [, [Validators.required]],
      maDiemKho: [, [Validators.required]],
      tenDiemKho: [, [Validators.required]],
      maNhaKho: [, [Validators.required]],
      tenNhaKho: [, [Validators.required]],
      maNganKho: [, [Validators.required]],
      tenNganKho: [, [Validators.required]],
      maLoKho: [, [Validators.required]],
      tenLoKho: [, [Validators.required]],
      maThuKho: [, [Validators.required]],
      thuKho: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [, [Validators.required]],
      tonKho: [, [Validators.required]],
      donViTinh: [, [Validators.required]],
      donViTinhNhap: [, [Validators.required]],
      soLuongDc: [, [Validators.required]],
      duToanKphi: [0],
      thoiGianDkDc: [, [Validators.required]],
      maDiemKhoNhan: [, [Validators.required]],
      tenDiemKhoNhan: [, [Validators.required]],
      maNhaKhoNhan: [, [Validators.required]],
      tenNhaKhoNhan: [, [Validators.required]],
      maNganKhoNhan: [, [Validators.required]],
      tenNganKhoNhan: [, [Validators.required]],
      maLoKhoNhan: [, [Validators.required]],
      tenLoKhoNhan: [, [Validators.required]],
      maThuKhoNhan: [, [Validators.required]],
      thuKhoNhan: [, [Validators.required]],
      thayDoiThuKho: [, [Validators.required]],
      slDcConLai: [, [Validators.required]],
      tichLuongKd: [, [Validators.required]],
      soLuongPhanBo: [, [Validators.required]],
    }
    );
  }

  ngOnInit(): void {
    this.handleData()
  }

  handleOk(item: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
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
    console.log('handleData', this.data)

    if (this.data.maChiCucNhan) await this.getListDiemKho(this.data.maChiCucNhan)
    if (this.data.maDiemKho) await this.getListNhaKho(this.data.maDiemKho)
    if (this.data.maNhaKho) await this.getListNganKho(this.data.maNhaKho)
    if (this.data.maNganKho) await this.getListLoKho(this.data.maNganKho)

    if (this.data.maDiemKhoNhan) await this.getListNhaKhoNhan(this.data.maDiemKhoNhan)
    if (this.data.maNhaKhoNhan) await this.getListNganKhoNhan(this.data.maNhaKhoNhan)
    if (this.data.maNganKhoNhan) await this.getListLoKhoNhan(this.data.maNganKhoNhan)

    await this.formData.patchValue(this.data)

    setTimeout(() => {
      if (this.data.maLoKhoNhan) this.onChangeLoKhoNhan(this.data.maLoKhoNhan)
    }, 1000);



    await this.spinner.hide();
  }

  async onChangeChiCucDC(value) {
    const chiCuc = this.dsChiCuc.find(item => item.key == value)

    this.getListDiemKho(value)
    if (chiCuc) {
      this.formData.patchValue({
        tenChiCucNhan: chiCuc.tenDvi,
        maDiemKho: "",
        tenDiemKho: "",
        maNhaKho: "",
        tenNhaKho: "",
        maNganKho: "",
        tenNganKho: "",
        maLoKho: "",
        tenLoKho: "",
        maThuKho: "",
        thuKho: "",
        loaiVthh: "",
        tenLoaiVthh: "",
        cloaiVthh: "",
        tenCloaiVthh: "",
        tonKho: "",
        donViTinh: "",
        soLuongDc: "",
        duToanKphi: "",
        thoiGianDkDc: "",
        maDiemKhoNhan: "",
        tenDiemKhoNhan: "",
        maNhaKhoNhan: "",
        tenNhaKhoNhan: "",
        maNganKhoNhan: "",
        tenNganKhoNhan: "",
        maLoKhoNhan: "",
        tenLoKhoNhan: "",
        maThuKhoNhan: "",
        thuKhoNhan: "",
        thayDoiThuKho: "",
        // slDcConLai: "",
        tichLuongKd: "",
        soLuongPhanBo: "",
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
      if ((this.formData.value.maDiemKho === this.formData.value.maDiemKhoNhan) &&
        (this.formData.value.maNhaKho === this.formData.value.maNhaKhoNhan) &&
        (this.formData.value.maNganKho === value)) {
        return true
      }
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

    if ((this.formData.value.maDiemKho === this.formData.value.maDiemKhoNhan) &&
      (this.formData.value.maNhaKho === this.formData.value.maNhaKhoNhan) &&
      (this.formData.value.maNganKho === this.formData.value.maNganKhoNhan) &&
      (this.formData.value.maLoKho === value)) {
      return true
    }

    return !!check
  }

  getMax() {
    let max = this.formData.value.soLuongDc
    if (this.formData.value.soLuongDc > this.formData.value.tichLuongKd) max = this.formData.value.tichLuongKd
    if (this.data.slDcConLai) {
      if (max > this.data.slDcConLai) max = this.data.slDcConLai
    }
    return max
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
          tenNganKho: nganKho.tenDvi,
          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tonKho: "",
          donViTinh: "",
        })
        let body = {
          maDvi: nganKho.maDvi,
          capDvi: nganKho.capDvi
        }
        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {
          const coLoKho = detail.data.object.coLoKho


          if (coLoKho)
            this.dsLoKho = this.dsNganKho.find(f => f.maDvi === value)?.children;
          else {
            this.dsLoKho = []
            this.formData.controls["maLoKho"].clearValidators();
            this.formData.controls["tenLoKho"].clearValidators();

            const detailThuKho = detail.data.object.detailThuKho
            if (detailThuKho) {
              this.formData.patchValue({
                maThuKho: detailThuKho.id,
                thuKho: detailThuKho.fullName
              })
            }

            if (detail.data.object.loaiVthh && detail.data.object.tenLoaiVthh && detail.data.object.cloaiVthh && detail.data.object.tenCloaiVthh && detail.data.object.dviTinh) {
              this.formData.patchValue({
                loaiVthh: detail.data.object.loaiVthh,
                tenLoaiVthh: detail.data.object.tenLoaiVthh,
                cloaiVthh: detail.data.object.cloaiVthh,
                tenCloaiVthh: detail.data.object.tenCloaiVthh,
                tonKho: detail.data.object.slTon,
                donViTinh: detail.data.object.dviTinh,
              })
            } else {
              this.notification.error(MESSAGE.ERROR, "Bạn chưa tạo dữ liệu đầu kỳ của " + nganKho.tenDvi);
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

        let body = {
          maDvi: loKho.maDvi,
          capDvi: loKho.capDvi
        }
        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {
          const detailThuKho = detail.data.object.detailThuKho
          if (detailThuKho) {
            this.formData.patchValue({
              maThuKho: detailThuKho.id,
              thuKho: detailThuKho.fullName
            })
          }
          if (detail.data.object.loaiVthh && detail.data.object.tenLoaiVthh && detail.data.object.cloaiVthh && detail.data.object.tenCloaiVthh && detail.data.object.dviTinh) {
            this.formData.patchValue({
              loaiVthh: detail.data.object.loaiVthh,
              tenLoaiVthh: detail.data.object.tenLoaiVthh,
              cloaiVthh: detail.data.object.cloaiVthh,
              tenCloaiVthh: detail.data.object.tenCloaiVthh,
              tonKho: detail.data.object.slTon,
              donViTinh: detail.data.object.dviTinh,
            })
          } else {
            this.notification.error(MESSAGE.ERROR, "Bạn chưa tạo dữ liệu đầu kỳ của " + loKho.tenDvi);
          }
        } else {
          this.formData.patchValue({
            loaiVthh: "",
            tenLoaiVthh: "",
            cloaiVthh: "",
            tenCloaiVthh: "",
            tonKho: "",
            donViTinh: "",
          })
        }

      }

    }

  }

  async getListLoKhoNhan(value) {
    if (value) {
      this.dsLoKhoNhan = []
      const nganKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)

      if (nganKhoNhan) {
        this.formData.patchValue({
          maLoKhoNhan: "",
          tenLoKhoNhan: "",
          thayDoiThuKho: "",
          tichLuongKd: 0,
          soLuongPhanBo: 0,
          tenNganKhoNhan: nganKhoNhan.tenDvi
        })
        let body = {
          maDvi: nganKhoNhan.maDvi,
          capDvi: nganKhoNhan.capDvi
        }
        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {
          const coLoKho = detail.data.object.coLoKho

          if (coLoKho) {
            this.dsLoKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)?.children;
          } else {
            this.formData.controls["maLoKhoNhan"].clearValidators();
            this.formData.controls["tenLoKhoNhan"].clearValidators();
            this.dsLoKhoNhan = []

            const detailThuKho = detail.data.object.detailThuKho
            if (detailThuKho) {
              this.formData.patchValue({
                maThuKhoNhan: detailThuKho.id,
                thuKhoNhan: detailThuKho.fullName
              })

              if (
                this.formData.value.maThuKho === detailThuKho.id
              ) {
                this.formData.patchValue({
                  thayDoiThuKho: false
                })
              } else {
                this.formData.patchValue({
                  thayDoiThuKho: true
                })
              }
            }



            if (!this.formData.value.cloaiVthh) return
            const tichLuongKd = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
            this.formData.patchValue({
              tichLuongKd,
              donViTinhNhap: detail.data.object.dviTinh
            })

            this.max = this.formData.value.soLuongDc
            if (this.formData.value.soLuongDc > tichLuongKd) this.max = tichLuongKd

            if (this.formData.value.slDcConLai) {
              if (this.max > this.formData.value.slDcConLai) this.max = this.formData.value.slDcConLai
            }


          }

        }

      }

    }

    return this.dsLoKhoNhan
  }

  async onChangeLoKhoNhan(value) {

    if (value) {
      const loKhoNhan = this.dsLoKhoNhan.find(f => f.maDvi === value)
      if (loKhoNhan) {
        this.formData.patchValue({
          tenLoKhoNhan: loKhoNhan.tenDvi
        })
        let body = {
          maDvi: loKhoNhan.maDvi,
          capDvi: loKhoNhan.capDvi
        }

        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {

          const detailThuKho = detail.data.object.detailThuKho
          if (detailThuKho) {
            this.formData.patchValue({
              maThuKhoNhan: detailThuKho.id,
              thuKhoNhan: detailThuKho.fullName
            })
            if (
              this.formData.value.maThuKho === detailThuKho.id
            ) {
              this.formData.patchValue({
                thayDoiThuKho: false
              })
            } else {
              this.formData.patchValue({
                thayDoiThuKho: true
              })
            }
          }


          if (!this.formData.value.cloaiVthh) return
          const tichLuongKd = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
          this.formData.patchValue({
            tichLuongKd,
            donViTinhNhap: detail.data.object.dviTinh
          })
          this.max = this.formData.value.soLuongDc
          if (this.formData.value.soLuongDc > tichLuongKd) this.max = tichLuongKd

          if (this.formData.value.slDcConLai) {
            if (this.max > this.formData.value.slDcConLai) this.max = this.formData.value.slDcConLai
          }

        }



      }
    }


  }

  onChangSLDC(value) {
    this.formData.patchValue({
      soLuongPhanBo: "",
      // slDcConLai: ""
    })
    this.max = value
    if (value > this.formData.value.tichLuongKd) this.max = this.formData.value.tichLuongKd

    if (this.formData.value.slDcConLai) {
      if (this.max > this.formData.value.slDcConLai) this.max = this.formData.value.slDcConLai
    }
  }

  onChangeSLNhapDc(value) {
    console.log('onChangeSLNhapDc', value, this.max, this.formData.value.soLuongDc, this.formData.value.tichLuongKd, this.formData.value.slDcConLai)
    if (value > 0) {
      const slDcConLai = Number(this.formData.value.soLuongDc) - Number(value)
      console.log('slDcConLai', slDcConLai)
      if (slDcConLai >= 0) {
        this.formData.patchValue({
          slDcConLai
        })
      }

    }
    // else {
    //   this.formData.patchValue({
    //     slDcConLai: (this.data.slDcConLai || 0)

    //   })
    // }

  }


}
