export class UserLogin {
  sub: string;
  MA_QD: string;
  roles: any;
  MA_DVI: string;
  CAP_DVI: string;
  MA_KHQLH: string;
  MA_KTBQ: string;
  MA_TCKT: string;
  MA_TR: string;
  constructor(initObj: any) {
    if (initObj) {
      for (var key in initObj) {
        this[key] = initObj[key];
      }
    }
  }
}
