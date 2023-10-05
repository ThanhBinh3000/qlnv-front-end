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
      maLoNganKho: `${item.maLoKho}${item.maNganKho}`,
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

    if (this.data.maChiCucNhan) await this.getListDiemKhoNhan(this.data.maChiCucNhan)
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
        tenDvi: chiCuc.tenDvi
      })
    }
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
                // this.dsDiemKhoNhan = this.dsDiemKho
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

  async getListDiemKhoNhan(maDvi) {
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
                this.dsDiemKhoNhan = [];
                this.dsDiemKhoNhan = [
                  ...this.dsDiemKhoNhan,
                  ...element.children.filter(item => item.type == 'MLK')
                ]
                // this.dsDiemKhoNhan = this.dsDiemKho
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
      const diemKhoNhan = this.dsDiemKhoNhan.find(f => f.maDvi === value)
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
              maThuKho: detailThuKho.id,
              thuKho: detailThuKho.fullName
            })
          }
          if (coLoKho)
            this.dsLoKho = this.dsNganKho.find(f => f.maDvi === value)?.children;
          else {
            this.formData.controls["maLoKho"].clearValidators();
            this.formData.controls["tenLoKho"].clearValidators();

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


          const detailThuKho = detail.data.object.detailThuKho
          if (detailThuKho) {
            this.formData.patchValue({
              maThuKhoNhan: detailThuKho.id,
              thuKhoNhan: detailThuKho.fullName
            })
          }
          if (coLoKho) {
            this.dsLoKhoNhan = this.dsNganKhoNhan.find(f => f.maDvi === value)?.children;
          } else {
            if (this.formData.value.cloaiVthh) {
              const tichLuongKd = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
              this.formData.patchValue({
                tichLuongKd
              })
            }
            this.formData.controls["maLoKhoNhan"].clearValidators();
            this.formData.controls["tenLoKhoNhan"].clearValidators();
            this.dsLoKhoNhan = []
            if (
              this.formData.value.maThuKho === this.formData.value.maThuKhoNhan
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
        let body = {
          maDvi: loKhoNhan.maDvi,
          capDvi: loKhoNhan.capDvi
        }
        const detail = await this.mangLuoiKhoService.getDetailByMa(body);
        if (detail.statusCode == 0) {
          if (this.formData.value.cloaiVthh) {
            const tichLuongKd = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
            this.formData.patchValue({
              tichLuongKd
            })
          }
        }


        if (
          this.formData.value.maThuKho === this.formData.value.maThuKhoNhan
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
