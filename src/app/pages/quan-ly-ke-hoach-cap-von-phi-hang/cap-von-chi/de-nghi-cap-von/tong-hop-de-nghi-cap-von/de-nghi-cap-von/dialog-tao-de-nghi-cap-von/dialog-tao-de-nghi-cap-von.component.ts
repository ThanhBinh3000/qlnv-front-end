
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { divNumber, mulNumber, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { BaoCao, ItemContract, TABS } from '../../../de-nghi-cap-von.constant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-tao-de-nghi-cap-von',
  templateUrl: './dialog-tao-de-nghi-cap-von.component.html',
  styleUrls: ['./dialog-tao-de-nghi-cap-von.component.scss']
})

export class DialogTaoDeNghiCapVonComponent implements OnInit {
  @Input() obj: any;

  userInfo: any;
  response: BaoCao;
  loaiDns: any[] = LOAI_DE_NGHI;
  canCuGias: any[] = CAN_CU_GIA;
  isRequestExist: number;
  isContractExist: boolean;
  idRequest!: string;
  searchFilter = {
    loaiTimKiem: '0',
    maDvi: null,
    ngayTaoDen: null,
    ngayTaoTu: null,
    soQdChiTieu: null,
    canCuVeGia: null,
    loaiDnghi: null,
    maDnghi: null,
    namBcao: null,
    paggingReq: {
      limit: 10,
      page: 1,
    },
    trangThai: null,
    maLoai: null,
  };
  dataTable: any[] = [];
  maDonVi: any;
  firstRecord: any;
  isFirstRecord = true;
  idCallChitiet!: string;
  idCallChitietCapVon!: string;
  idCallChitietDnghiCapVon!: string;
  selectedIndex = 0;
  tabs: any[] = TABS;

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private userService: UserService,
    private capVonNguonChiService: CapVonNguonChiService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
  ) { }

  async ngOnInit() {
    this.response = new BaoCao();
    this.userInfo = this.userService.getUserLogin();
    this.maDonVi = this.userInfo.MA_DVI;
    if (this.userService.isChiCuc()) {
      this.canCuGias = this.canCuGias.filter(e => e.id == Utils.QD_DON_GIA);
    }
    if (!this.userService.isTongCuc()) {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
    }
    this.response.lstCtiets = [];
  }

  changeDnghi() {
    this.loaiDns = LOAI_DE_NGHI;
    if (this.userService.isTongCuc()) {
      if (this.response.canCuVeGia == Utils.QD_DON_GIA) {
        this.loaiDns = LOAI_DE_NGHI.filter(e => e.id != Utils.MUA_VTU);
      }
    } else {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
    }
    if (this.response.canCuVeGia == Utils.QD_DON_GIA) {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_GAO && e.id != Utils.MUA_MUOI);
    }
  }

  //neu la de nghi theo don gia mua can lay ra so quyet dinh chi tieu;
  getSoQdChiTieu() {
    if (!this.response.canCuVeGia) {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn căn cứ về giá');
      this.response.namBcao = null;
      return;
    }
    const request = {
      namKHoach: this.response.namBcao,
      maDvi: this.userInfo?.MA_DVI,
    }
    this.spinner.show();
    this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.response.soQdChiTieu = data.data[0];
          if (!this.response.soQdChiTieu) {
            this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy số quyết định chỉ tiêu cho năm ' + this.response.namBcao);
            this.response.namBcao = null;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          this.response.namBcao = null;
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        this.response.namBcao = null;
      }
    )
    this.spinner.hide();
  }
  //lay ra chi tiet cua de nghi
  async getDetail() {
    if (!this.response.namBcao) {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập năm đề nghị');
      this.response.loaiDnghi = null;
      return;
    }
    await this.checkRequest();
    this.spinner.hide();
    if (this.isRequestExist == 2) {
      this.notification.warning(MESSAGE.WARNING, 'Trạng thái đề nghị không cho phép đề nghị cấp vốn lần mới');
      return;
    }
    if (this.isRequestExist == 0) {
      this.response.maDvi = this.userInfo?.MA_DVI;
      this.response.ngayTao = new Date();
      this.response.soLan = 1;
      this.response.trangThai = Utils.TT_BC_1;
      this.response.maDviTien = '1';
      this.response.lstFiles = [];
      //bao cao chua ton tai
      if (this.response.canCuVeGia == Utils.HD_TRUNG_THAU) {
        if (this.response.loaiDnghi == Utils.MUA_VTU) {
          await this.getContractData();
        } else {
          if (this.userService.isCuc()) {
            await this.checkContract();
            if (!this.isContractExist) {
              this.notification.warning(MESSAGE.WARNING, 'Không tồn tại hợp đồng cho loại đề nghị đã chọn');
              return;
            } else {
              // await this.syntheticContract();
              await this.capVonNguonChiService.ctietDeNghi(this.idCallChitiet).toPromise().then(
                async (data) => {
                  if (data.statusCode == 0) {
                    const dataRequest = data.data.lstCtiets;
                    for (const item of dataRequest) {
                      this.response.lstCtiets.push({ ...item });
                    }
                  } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                  }
                },
                (err) => {
                  this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
              );
            }
          } else {
            await this.callSynthetic();
          }
        }
      } else {
        //neu la chi cuc thi tao moi de nghi
        if (this.userService.isChiCuc()) {
          this.searchFilter.maDvi = this.maDonVi;
          this.searchFilter.maLoai = '0';
          const request = JSON.parse(JSON.stringify(this.searchFilter));

          await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
            (data) => {
              if (data.statusCode == 0) {
                if (data.data.content?.length > 0) {
                  if (data.data.content[0].trangThai == Utils.TT_BC_7) {
                    this.idCallChitietCapVon = data.data.content[0].id
                  }
                }
              } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.loaiDnghi = null;
              }
            },
            (err) => {
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
              this.response.loaiDnghi = null;
            }
          );
          await this.capVonNguonChiService.ctietDeNghi(this.idCallChitietCapVon).toPromise().then(
            (data) => {
              if (data.statusCode == 0) {
                if (data.data.trangThai == Utils.TT_BC_7) {
                  const object = data.data.lstCtiets[0];
                  const { id, ...rest } = object;
                  this.response.lstCtiets = [];
                  this.response.lstCtiets.push({
                    ...rest,
                    id: uuid.v4() + 'FE',
                    maDvi: this.userInfo?.MA_DVI,
                    tenDvi: this.userInfo?.TEN_DVI,
                    dnghiCapvonLuyKes: [],
                  })
                }
              }
            })
        }
        // else {
        // await this.checkRequest();
        // }
      }
      await this.getMaDnghi();
    }
    // else {
    //them lan moi cho de nghi
    //   await this.capVonNguonChiService.ctietDeNghi(this.idRequest).toPromise().then(
    //     async (data) => {
    //       if (data.statusCode == 0) {
    //         this.response = data.data;
    //         this.response.trangThai = Utils.TT_BC_1;
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, data?.msg);
    //       }
    //     },
    //     (err) => {
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     },
    //   );
    //   if (this.response.loaiDnghi != Utils.MUA_VTU) {
    //     if ((this.response.canCuVeGia == Utils.HD_TRUNG_THAU && this.userService.isTongCuc()) ||
    //       (this.response.canCuVeGia == Utils.QD_DON_GIA && !this.userService.isChiCuc())) {
    //       this.callSynthetic();
    //     }
    //   }
    //   this.response.soLan += 1;

    // }
  }

  // tao moi de nghi cap von cuc khu vuc


  async callSynthetic() {
    const request = {
      canCuVeGia: this.response.canCuVeGia,
      loaiDnghi: this.response.loaiDnghi,
      maDvi: this.userInfo?.MA_DVI,
      namBcao: this.response.namBcao,
      // loaiTimKiem: '0',
      maLoai: '1'
    }
    await this.capVonNguonChiService.tongHopDeNghi(request).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          res.data.forEach(item => {
            const temp = item;
            const id = this.response.lstCtiets.find(e => e.maDvi == temp.maDvi)?.id;
            temp.id = id ? id : uuid.v4() + 'FE';
            this.response.lstCtiets = this.response.lstCtiets.filter(e => e.maDvi != temp.maDvi);
            this.response.lstCtiets.push(temp);
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  async getContractData() {
    const request = {
      namKHoach: this.response.namBcao,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: "02",
    }
    await this.capVonNguonChiService.dsachHopDong(request).toPromise().then(
      (data) => {
        debugger
        if (data.statusCode == 0) {
          data.data.forEach(item => {
            const temp: ItemContract = {
              ... new ItemContract(),
              id: uuid.v4() + 'FE',
              tenKhachHang: item.tenNhaThau,
              isParent: false,
              qdPheDuyetKqNhaThau: item.soHd,
              slKeHoach: item.soLuongKehoach,
              slHopDong: item.soLuong,
              donGia: item.donGia,
              gtHopDong: mulNumber(item.soLuong, item.donGia),
              dnghiCapvonLuyKes: [],
            }
            this.response.lstCtiets.push(temp);
            const index = this.response.lstCtiets.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
            if (index == -1) {
              this.response.lstCtiets.push({
                ...temp,
                id: uuid.v4() + 'FE',
                isParent: true,
                qdPheDuyetKqNhaThau: item.soQdPdKhlcnt,
              })
            } else {
              if (this.response.lstCtiets[index].qdPheDuyetKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
                this.response.lstCtiets[index].qdPheDuyetKqNhaThau += ', ' + item.soQdPdKhlcnt;
              }
              this.response.lstCtiets[index].slHopDong = sumNumber([this.response.lstCtiets[index].slHopDong, temp.slHopDong]);
              this.response.lstCtiets[index].slKeHoach = sumNumber([this.response.lstCtiets[index].slKeHoach, temp.slKeHoach]);
              this.response.lstCtiets[index].gtHopDong = sumNumber([this.response.lstCtiets[index].gtHopDong, temp.gtHopDong]);
              this.response.lstCtiets[index].donGia = divNumber(this.response.lstCtiets[index].gtHopDong, this.response.lstCtiets[index].slHopDong);
            }
          })
        } else {
          this.notification.warning(MESSAGE.WARNING, data?.msg);
        }
      },
      (err) => {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  async syntheticContract() {
    const request = {
      loaiDnghi: this.response.loaiDnghi,
      maDvi: this.userInfo?.MA_DVI,
      namHdong: this.response.namBcao,
    }
    await this.capVonNguonChiService.tongHopHd(request).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          res.data.forEach(item => {
            this.response.lstCtiets.push({
              ...new ItemContract(),
              id: uuid.v4() + 'FE',
              slKeHoach: item.slKeHoach,
              slHopDong: item.slHopDong,
              slThucHien: item.slThucHien,
              gtHopDong: item.gtHopDong,
              donGia: item.donGia,
              gtriThucHien: item.gtriThucHien,
              duToanDaGiao: item.daGiaoDuToan,
              dnghiCapvonLuyKes: [],
              maDvi: item.maDvi,
              tenDvi: item.tenDvi,
              tenKhachHang: item.tenKhachHang,
              isParent: item.isParent,
              qdPheDuyetKqNhaThau: item.qdPheDuyetKqNhaThau,
            })
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  async getMaDnghi() {
    await this.capVonNguonChiService.maDeNghi().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.response.maDnghi = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  async checkRequest() {
    this.isRequestExist = 0;
    this.searchFilter.maDvi = this.maDonVi;
    this.searchFilter.maLoai = '0';
    const request = JSON.parse(JSON.stringify(this.searchFilter));

    await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          if (res.data.content[0].trangThai == Utils.TT_BC_7) {
            this.idCallChitietDnghiCapVon = res.data.content[0].id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    if (this.response.canCuVeGia == Utils.QD_DON_GIA) {
      await this.capVonNguonChiService.ctietDeNghi(this.idCallChitietDnghiCapVon).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            if (data.data.trangThai == Utils.TT_BC_7) {
              const arrData = data.data.lstCtiets;
              for (let i = 0; i < arrData.length; i++) {
                arrData[i].id = uuid.v4() + 'FE';
              }
              this.response.lstCtiets = [];
              this.response.lstCtiets.push(
                ...arrData,
              )
            }
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.spinner.hide();
  }

  async checkContract() {
    this.isContractExist = false;
    const request = {
      maDvi: this.userInfo?.MA_DVI,
      namHdong: this.response.namBcao,
      loaiDnghi: this.response.loaiDnghi,
      maDviTien: '1',
      maLoai: '3',
      loaiTimKiem: '0',
      paggingReq: {
        limit: 10,
        page: 1,
      },
      trangThai: Utils.TT_BC_7,
    }
    await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          if (data.data.content?.length > 0) {
            this.idCallChitiet = data.data.content[0].id;
            this.isContractExist = true;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          this.response.loaiDnghi = null;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        this.response.loaiDnghi = null;
      }
    );
  }

  handleOk() {
    if (!this.response.canCuVeGia) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (!this.response.namBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }

    if (!this.response.loaiDnghi) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}

