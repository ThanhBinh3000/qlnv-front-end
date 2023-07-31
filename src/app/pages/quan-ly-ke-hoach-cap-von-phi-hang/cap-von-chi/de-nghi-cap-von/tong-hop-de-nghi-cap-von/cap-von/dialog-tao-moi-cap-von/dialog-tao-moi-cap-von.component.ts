
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { divNumber, mulNumber, sumNumber } from 'src/app/Utility/func';
import { CAN_CU_GIA, LOAI_DE_NGHI, Operator, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { BaoCao, ItemContract } from '../../../de-nghi-cap-von.constant';

@Component({
  selector: 'app-dialog-tao-moi-cap-von',
  templateUrl: './dialog-tao-moi-cap-von.component.html',
  styleUrls: ['./dialog-tao-moi-cap-von.component.scss']
})

export class DialogTaoMoiCapVonComponent implements OnInit {
  @Input() obj: any;

  userInfo: any;
  response: BaoCao;
  loaiDns: any[] = LOAI_DE_NGHI;
  canCuGias: any[] = CAN_CU_GIA;
  isRequestExist: number;
  isContractExist: boolean;
  idRequest!: string;
  total: ItemContract = new ItemContract();
  idCallChitiet!: string;
  idRequestCallCtiet!: string;
  demSoLan: number;
  tinhLuyKe: any;

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private userService: UserService,
    private capVonNguonChiService: CapVonNguonChiService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this.response = new BaoCao();
    this.userInfo = this.userService.getUserLogin();
    if (this.userService.isChiCuc()) {
      this.canCuGias = this.canCuGias.filter(e => e.id == Utils.QD_DON_GIA);
    }
    if (!this.userService.isTongCuc()) {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
    }
    this.response.dnghiCvHopDongCtiets = [];
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
              await this.capVonNguonChiService.ctietDeNghi(this.idCallChitiet).toPromise().then(
                async (data) => {
                  if (data.statusCode == 0) {
                    const dataRequest = data.data.lstCtiets[0];
                    this.response.lstCtiets.push({
                      ... new ItemContract,
                      id: uuid.v4() + 'FE',
                      maDvi: this.userInfo?.MA_DVI,
                      tenDvi: this.userInfo?.TEN_DVI,
                      slKeHoach: dataRequest.slKeHoach,
                      slHopDong: dataRequest.slHopDong,
                      gtHopDong: dataRequest.gtHopDong,
                      viPhamHopDong: dataRequest.viPhamHopDong,
                      thanhLyHdongSl: dataRequest.thanhLyHdongSl,
                      thanhLyHdongTt: dataRequest.thanhLyHdongTt,
                      luyKeCapUng: this.total.luyKeCapUng,
                      luyKeCapVon: this.total.luyKeCapVon,
                      luyKeCong: this.total.luyKeCong,
                    })
                  } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                  }
                  data.data.lstCtiets.length += 1;
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
          if (this.demSoLan == 0) {
            this.response.lstCtiets = [];
            this.response.lstCtiets.push({
              ... new ItemContract(),
              id: uuid.v4() + 'FE',
              maDvi: this.userInfo?.MA_DVI,
              tenDvi: this.userInfo?.TEN_DVI,
              stt: '0.1'
            });
          } else {
            await this.capVonNguonChiService.ctietDeNghi(this.idRequest).toPromise().then(
              async (data) => {
                if (data.statusCode == 0) {
                  const updateItems = data.data.lstCtiets.map(item => ({
                    ...item,
                    ... new ItemContract(),
                    id: uuid.v4() + 'FE',
                    maDvi: this.userInfo?.MA_DVI,
                    tenDvi: this.userInfo?.TEN_DVI,
                    slKeHoach: null,
                    slThucHien: null,
                    donGia: null,
                    gtriThucHien: null,
                    duToanDaGiao: null,
                    luyKeTongCapUng: Operator.sum([item.luyKeTongCapUng, item.vonDuyetCapUng]),
                    luyKeTongCapVon: Operator.sum([item.luyKeTongCapVon, item.vonDuyetCapVon]),
                    luyKeTongCong: Operator.sum([item.luyKeTongCong, item.vonDuyetCong]),
                    tongVonVaDtDaCap: null,
                    vonDnghiCapLanNay: null,
                    vonDuyetCapUng: null,
                    vonDuyetCapVon: null,
                    vonDuyetCong: null,
                    tongTien: null,
                    soConDuocCap: null,
                    ghiChu: null,
                  }))
                  this.response.lstCtiets = updateItems;
                } else {
                  this.notification.error(MESSAGE.ERROR, data?.msg);
                }
              },
              (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
              },
            );
            this.response.soLan = this.demSoLan + 1;
          }
        } else {
          await this.callSynthetic();
        }
      }
      await this.getMaDnghi();
    }
    else {
      //them lan moi cho de nghi
      await this.capVonNguonChiService.ctietDeNghi(this.idRequest).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.response = data.data;
            this.response.lstCtiets.map(item => {
              item.slKeHoach = null;
              item.slThucHien = null;
              item.donGia = null;
              item.gtriThucHien = null;
              item.duToanDaGiao = null;
              item.luyKeTongCapUng = Operator.sum([item.luyKeTongCapUng, item.vonDuyetCapUng]);
              item.luyKeTongCapVon = Operator.sum([item.luyKeTongCapVon, item.vonDuyetCapVon]);
              item.luyKeTongCong = Operator.sum([item.luyKeTongCong, item.vonDuyetCong]);
              item.tongVonVaDtDaCap = null;
              item.vonDnghiCapLanNay = null;
              item.vonDuyetCapUng = null;
              item.vonDuyetCapVon = null;
              item.vonDuyetCong = null;
              item.tongTien = null;
              item.soConDuocCap = null;
            })
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
      if (this.response.loaiDnghi != Utils.MUA_VTU) {
        if ((this.response.canCuVeGia == Utils.HD_TRUNG_THAU && this.userService.isTongCuc()) ||
          (this.response.canCuVeGia == Utils.QD_DON_GIA && !this.userService.isChiCuc())) {
          this.callSynthetic();
        }
      }
      this.response.soLan += 1;
      this.response.trangThai = Utils.TT_BC_1;
    }
  }

  async callSynthetic() {
    const request = {
      canCuVeGia: this.response.canCuVeGia,
      loaiDnghi: this.response.loaiDnghi,
      maDvi: this.userInfo?.MA_DVI,
      namBcao: this.response.namBcao,
      maLoai: '1'
    }
    await this.capVonNguonChiService.tongHopDeNghi(request).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          res.data.forEach(item => {
            const temp = item;
            const id = this.response.lstCtiets.find(e => e.maDvi == temp.maDvi)?.id;
            temp.id = id ? id : uuid.v4() + 'FE';
            temp.stt = '0.1.1';
            this.response.lstCtiets = this.response.lstCtiets.filter(e => e.maDvi != temp.maDvi);
            this.total.slKeHoach = Operator.sum([this.total.slKeHoach, item.slKeHoach]);
            this.total.slThucHien = Operator.sum([this.total.slThucHien, item.slThucHien]);
            this.total.donGia = Operator.sum([this.total.donGia, item.donGia]);
            this.total.gtriThucHien = Operator.sum([this.total.gtriThucHien, item.gtriThucHien]);
            this.response.lstCtiets.push({
              ... new ItemContract(),
              id: uuid.v4() + 'FE',
              maDvi: this.userInfo?.MA_DVI,
              tenDvi: this.userInfo?.TEN_DVI,
              slKeHoach: this.total.slKeHoach,
              slThucHien: this.total.slThucHien,
              donGia: this.total.donGia,
              gtriThucHien: this.total.gtriThucHien,
              stt: '0.1'
            }, temp);
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
      maLoai: '3'
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
    const request = {
      maDvi: this.userInfo?.MA_DVI,
      namBcao: this.response.namBcao,
      loaiDnghi: this.response.loaiDnghi,
      canCuVeGia: this.response.canCuVeGia,
      maLoai: '0',
      paggingReq: {
        limit: 10,
        page: 1,
      },
      loaiTimKiem: '0'
    }
    await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          if (data.data.content.length > 0) {
            if (data.data.content[0].trangThai == Utils.TT_BC_7) {
              // this.isRequestExist = 1;
              this.idRequest = data.data.content[0].id;
            } else {
              this.isRequestExist = 2;
            }
          }
          this.demSoLan = data.data.content.length;
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
    this.canCuGias = this.canCuGias.filter(e => e.id == Utils.HD_TRUNG_THAU)
    if (this.canCuGias) {
      await this.capVonNguonChiService.ctietDeNghi(this.idRequest).toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            data.data.lstCtiets.map((item) => {
              this.total.luyKeCapUng = Operator.sum([item.luyKeCapUng, item.capUng]);
              this.total.luyKeCapVon = Operator.sum([item.luyKeCapVon, item.capVon]);
              this.total.luyKeCong = Operator.sum([item.luyKeCong, item.cong]);
            })
          }
        }
      )
    }

    this.spinner.hide();
  }
  // check hop dong
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
          this.idCallChitiet = data.data.content[0].id;
          if (data.data.content?.length > 0) {
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

  async callChitiet() {

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

  async callAddNewReport() {
    this.isRequestExist = 0;
    const request = {
      maDvi: this.userInfo?.MA_DVI,
      namBcao: this.response.namBcao,
      loaiDnghi: this.response.loaiDnghi,
      canCuVeGia: this.response.canCuVeGia,
      maLoai: '2',
      paggingReq: {
        limit: 10,
        page: 1,
      },
    }
    await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
      (data) => {
        debugger
        if (data.statusCode == 0) {
          if (data.data.content.length > 0) {
            if (data.data.content[0].trangThai == Utils.TT_BC_7) {
              this.isRequestExist = 1;
              this.idRequestCallCtiet = data.data.content[0].id;
            } else {
              this.isRequestExist = 2;
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
    await this.capVonNguonChiService.ctietDeNghi(this.idRequestCallCtiet).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          const dataRequest = data.data.lstCtiets[0];
          this.response.lstCtiets.push({
            ... new ItemContract,
            id: uuid.v4() + 'FE',
            maDvi: this.userInfo?.MA_DVI,
            tenDvi: this.userInfo?.TEN_DVI,
            slKeHoach: dataRequest.slKeHoach,
            slHopDong: dataRequest.slHopDong,
            gtHopDong: dataRequest.gtHopDong,
            viPhamHopDong: dataRequest.viPhamHopDong,
            thanhLyHdongSl: dataRequest.thanhLyHdongSl,
            thanhLyHdongTt: dataRequest.thanhLyHdongTt,
          })
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    this.spinner.hide();
  }
}

