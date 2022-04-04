import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { LOAIBAOCAO, Utils } from "../../../../../Utility/utils";
import { MESSAGE } from '../../../../../constants/message';

export class ObjResp {
     id: string;
     maBcao: string;
     maDvi: number;
     maDviTien: string;
     maLoaiBcao: string;
     namBcao: number;
     namHienHanh: number;
     ngayTao: string;
     nguoiTao: string;
     trangThai: string;
}

export class ItemData {
     id!: any;
     stt!: string;
     objResp: ObjResp;
     url: string;
     checked!: boolean;
}

@Component({
     selector: 'app-van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam',
     templateUrl: './van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.component.html',
     styleUrls: ['./van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.component.scss'],
})

export class VanBanGuiTcdtVeNsnnVaKhtc3NamComponent implements OnInit {
     userInfo: any;
     errorMessage!: String;                      //
     ngayNhap!: string;                             // ngay nhap
     nguoiNhap!: string;                         // nguoi nhap
     noiTao!: string;
     trangThai: string = '6';
     soVban!: string;
     ngayDuyetVban!: string;
     baoCaos: any = LOAIBAOCAO;
     cucKhuVucs: any = [];
     lstBcao: any = [];
     trangThais: any = [
          {
               id: "1",
               tenDm: "Đang soạn",
          },
          {
               id: "2",
               tenDm: "Gửi đơn vị cấp trên",
          },
     ];

     url: string;

     lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
     id!: any;                                   // id truyen tu router
     chiTietBcaos: any[];                          // thong tin chi tiet bao cao
     userName: any;                              // ten nguoi dang nhap

     maDonViTao!: any;                           // ma don vi tao
     maBaoCao!: string;                          // ma bao cao
     namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
     trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
     maLoaiBaoCao: string = "26";                // nam bao cao
     newDate = new Date();
     kt: boolean;                   //

     statusBtnDel: boolean;                       // trang thai an/hien nut xoa
     statusBtnSave: boolean;                      // trang thai an/hien nut luu
     statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
     statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
     statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
     statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
     statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

     listIdDelete: string = "";


     allChecked = false;                         // check all checkbox
     indeterminate = true;                       // properties allCheckBox
     editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private danhMucService: DanhMucHDVService,
          private userService: UserService,
          private notification: NzNotificationService,
          private location: Location
     ) {
          this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
     }


     async ngOnInit() {
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userService.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          if (this.id) {
               await this.getDetailReport();
               this.kt = false;
          } else {
               this.kt = true;
               this.trangThaiBanGhi = "1";
               this.nguoiNhap = userInfo?.username;
               this.maDonViTao = userInfo?.dvql;
               this.ngayDuyetVban = this.ngayNhap;
               this.spinner.show();
               this.quanLyVonPhiService.sinhMaVban().toPromise().then(
                    (data) => {
                         if (data.statusCode == 0) {
                              this.soVban = data.data;
                         } else {
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                         }
                    },
                    (err) => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    }
               );
               this.maBaoCao = '';
               this.namBaoCaoHienHanh = new Date().getFullYear();
          }

          const utils = new Utils();
          this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);

          this.danhMucService.dMucBcaoDuyet().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.lstBcao = data.data;
                         console.log(this.lstBcao);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

          //get danh muc nhom chi
          this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.cucKhuVucs = data.data;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

          this.noiTao = this.getUnitName();
          this.trangThai = this.getStatusName();

          this.spinner.hide();
     }

     //get user info
     async getUserInfo(username: string) {
          let userInfo = await this.userService.getUserInfo(username).toPromise().then(
               (data) => {
                    if (data?.statusCode == 0) {
                         this.userInfo = data?.data
                         return data?.data;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          return userInfo;
     }


     // luu
     async luu() {

          // replace nhung ban ghi dc them moi id thanh null
          this.lstCTietBCao.forEach(item => {
               if (typeof item.id != "number") {
                    item.id = null;
               }
          })
          let request = {
               id: this.id,                 // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
               listIdDeletes: this.listIdDelete,
               lstCtiet: this.lstCTietBCao,
               maDonVi: this.maDonViTao,
               ngayDuyetVban: this.ngayDuyetVban,
               soVban: this.soVban,
               stt: "",
               trangThai: this.trangThai,
          };
          //call service them moi
          this.spinner.show();
          if (this.id == null) {

               this.quanLyVonPhiService.themMoiVban(request).toPromise().then(
                    data => {
                         console.log(data);
                         if (data.statusCode == 0) {
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                         } else {
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                         }
                    },
                    err => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                         console.log(err);
                    },
               );
          } else {

               this.quanLyVonPhiService.capNhatVban(request).toPromise().then(res => {
                    if (res.statusCode == 0) {
                         this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    } else {
                         this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
               }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               })
          }
          this.lstCTietBCao.forEach(item => {
               if (!item.id) {
                    item.id = uuid.v4();
               }
          });
          this.updateEditCache();
          this.spinner.hide();
     }

     // chuc nang check role
     onSubmit(mcn: String) {
          const requestGroupButtons = {
               id: this.id,
               maChucNang: mcn,
               type: "",
          };
          this.spinner.show();
          this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
               if (data.statusCode == 0) {
                    this.getDetailReport();
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
               } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
               }
          }, err => {
               this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          });
          this.spinner.hide();
     }

     // call chi tiet bao cao
     async getDetailReport() {
          this.spinner.show();
          await this.quanLyVonPhiService.ctietVban(this.id).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         console.log(data);
                         this.chiTietBcaos = data.data.lstCtiet;
                         console.log(this.chiTietBcaos);

                         this.chiTietBcaos.forEach(item => {
                              let mm: ItemData = {
                                   id: item.id,
                                   stt: item.stt,
                                   objResp: {
                                        id: item.objResp.id,
                                        maBcao: item.objResp.maBcao,
                                        maDvi: item.objResp.maDvi,
                                        maDviTien: item.objResp.maDviTien,
                                        maLoaiBcao: item.objResp.maLoaiBcao,
                                        namBcao: item.objResp.namBcao,
                                        namHienHanh: item.objResp.namHienHanh,
                                        ngayTao: item.objResp.ngayTao,
                                        nguoiTao: item.objResp.nguoiTao,
                                        trangThai: item.objResp.trangThai,
                                   },
                                   url: this.getUrl(item.objResp.maLoaiBcao) + '/' + item.objResp.id,
                                   checked: false,
                              }
                              this.lstCTietBCao.push(mm);
                         })
                         console.log(this.lstCTietBCao);
                         this.updateEditCache();

                         // set thong tin chung bao cao
                         this.ngayDuyetVban = data.data.ngayDuyetVban;
                         this.nguoiNhap = data.data.nguoiTao;
                         this.maDonViTao = data.data.maDonVi;
                         this.soVban = data.data.soVban;
                         this.namBaoCaoHienHanh = data.data.namBcao;
                         this.trangThaiBanGhi = data.data.trangThai;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.spinner.hide();
     }
     xoa() {
          this.lstCTietBCao = [];
     }

     // them dong moi
     addLine(id: number): void {
          let item: ItemData = {
               id: uuid.v4(),
               stt: "",
               objResp: {
                    id: "",
                    maBcao: "",
                    maDvi: 0,
                    maDviTien: "",
                    maLoaiBcao: "",
                    namBcao: 0,
                    namHienHanh: 0,
                    ngayTao: "",
                    nguoiTao: "",
                    trangThai: "",
               },
               url: "",
               checked: false,
          }

          this.lstCTietBCao.splice(id, 0, item);
          this.editCache[item.id] = {
               edit: true,
               data: { ...item }
          };
     }

     // xoa dong
     deleteById(id: any): void {
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
          if (typeof id == "number") {
               this.listIdDelete += id + ",";
          }
     }

     // xóa với checkbox
     deleteSelected() {
          // add list delete id
          this.lstCTietBCao.filter(item => {
               if (item.checked == true && typeof item.id == "number") {
                    this.listIdDelete += item.id + ","
               }
          })
          // delete object have checked = true
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
          this.allChecked = false;
     }


     // click o checkbox all
     updateAllChecked(): void {
          this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
          if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
               this.lstCTietBCao = this.lstCTietBCao.map(item => ({
                    ...item,
                    checked: true
               }));
          } else {
               this.lstCTietBCao = this.lstCTietBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                    ...item,
                    checked: false
               }));
          }
     }

     // click o checkbox single
     updateSingleChecked(): void {
          if (this.lstCTietBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
               this.allChecked = false;
               this.indeterminate = false;
          } else if (this.lstCTietBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
               this.allChecked = true;
               this.indeterminate = false;
          } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
               this.indeterminate = true;
          }
     }

     redirectChiTieuKeHoachNam() {
          // this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
          this.location.back()
     }

     // lay ten trang thai
     getStatusName() {
          return this.trangThais.find(item => item.id == this.trangThaiBanGhi)?.tenDm;
     }

     // lay ten don vi tao
     getUnitName() {
          return this.cucKhuVucs.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
     }

     // start edit
     startEdit(id: string): void {
          this.editCache[id].edit = true;
     }

     // huy thay doi
     cancelEdit(id: string): void {
          const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
          this.editCache[id] = {
               data: { ...this.lstCTietBCao[index] },
               edit: false
          };
     }

     // luu thay doi
     saveEdit(id: string): void {
          this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
          const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
          Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
          this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
          console.log(this.lstCTietBCao);
     }

     // gan editCache.data == lstCTietBCao
     updateEditCache(): void {
          this.lstCTietBCao.forEach(item => {
               this.editCache[item.id] = {
                    edit: false,
                    data: { ...item }
               };
          });
     }

     changeModel(id: string): void {
          let mm = this.lstBcao.filter(item => item.maBcao == this.editCache[id].data.objResp.maBcao)
          console.log(mm);
          this.editCache[id].data.objResp.id = mm[0].id;
          this.editCache[id].data.objResp.maDvi = mm[0].maDvi;
          this.editCache[id].data.objResp.maDviTien = mm[0].maDviTien;
          this.editCache[id].data.objResp.maLoaiBcao = mm[0].maLoaiBcao;
          this.editCache[id].data.objResp.namBcao = mm[0].namBcao;
          this.editCache[id].data.objResp.namHienHanh = mm[0].namHienHanh;
          this.editCache[id].data.objResp.ngayTao = mm[0].ngayTao;
          this.editCache[id].data.objResp.nguoiTao = mm[0].nguoiTao;
          this.editCache[id].data.objResp.trangThai = mm[0].trangThai;
          this.editCache[id].data.url = this.getUrl(mm[0].maLoaiBcao) + '/' + mm[0].id;
          console.log(this.editCache[id].data);
     }

     //set url khi
     getUrl(maLoaiBcao: string) {
          var url: string;
          switch (maLoaiBcao) {
               case '12':
                    url = '/chi-thuong-xuyen-3-nam/'
                    break;
               case '01':
                    url = '/xay-dung-ke-hoach-von-dau-tu/'
                    break;
               case '02':
                    url = '/xay-dung-nhu-cau-nhap-xuat-hang-nam/'
                    break;
               case '03':
                    url = '/xay-dung-ke-hoach-bao-quan-hang-nam/'
                    break;
               case '04':
                    url = '/nhu-cau-xuat-hang-vien-tro/'
                    break;
               case '05':
                    url = '/xay-dung-ke-hoach-quy-tien-luong3-nam/'
                    break;
               case '06':
                    url = '/xay-dung-ke-hoach-quy-tien-luong-hang-nam/'
                    break;
               case '07':
                    url = '/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/'
                    break;
               case '08':
                    url = '/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/'
                    break;
               case '09':
                    url = '/du-toan-chi-ung-dung-cntt-3-nam/'
                    break;
               case '10':
                    url = '/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/'
                    break;
               case '11':
                    url = '/chi-ngan-sach-nha-nuoc-3-nam/'
                    break;
               case '13':
                    url = '/nhu-cau-phi-nhap-xuat-3-nam/'
                    break;
               case '14':
                    url = '/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/'
                    break;
               case '15':
                    url = '/ke-hoach-dao-tao-boi-duong-3-nam/'
                    break;
               case '16':
                    url = '/nhu-cau-ke-hoach-dtxd3-nam/'
                    break;
               case '17':
                    url = '/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/'
                    break;
               case '18':
                    url = '/du-toan-xuat-nhap-hang-dtqg-hang-nam/'
                    break;
               case '19':
                    url = '/ke-hoach-bao-quan-hang-nam/'
                    break;
               case '20':
                    url = '/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/'
                    break;
               case '21':
                    url = '/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/'
                    break;
               case '22':
                    url = '/ke-hoach-quy-tien-luong-nam-n1/'
                    break;
               case '23':
                    url = '/du-toan-chi-du-tru-quoc-gia-gd3-nam/'
                    break;
               case '24':
                    url = '/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/'
                    break;
               case '25':
                    url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/'
                    break;
               case '26':
                    url = '/du-toan-chi-ung-dung-cntt-giai-doan-3nam/'
                    break;
               case '27':
                    url = '/du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/'
                    break;
               case '28':
                    url = '/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/'
                    break;
               case '29':
                    url = '/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
                    break;
               case '30':
                    url = '/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
                    break;
               case '31':
                    url = '/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/'
                    break;
               case '32':
                    url = '/ke-hoach-dao-tao-boi-duong-3-nam-tc/'
                    break;
               default:
                    url = null;
                    break;
          }
          return url;
     }
}
