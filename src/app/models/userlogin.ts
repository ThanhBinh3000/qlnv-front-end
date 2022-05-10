export class UserLogin {
  sub: string;
  MA_QD: string;
  roles: any;
  MA_DVI: string;

  constructor(initObj: any) {
    if (initObj) {
      for (var key in initObj) {
        this[key] = initObj[key];
      }
    }
  }
}
