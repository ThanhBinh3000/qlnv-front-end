export class UserLogin {
    roleId: string;
    roleName: string;
    deptId: string;
    deptName: string;
    deptType: number;
    userId: string;
    displayName: string;
    userName: string;
    roleCode: string;
    deptCode: string;
    unitName: string;
    unitId: string;
    isLeader: boolean;
    isSigner: boolean
    positionName: String;

    constructor(initObj: any) {
        if (initObj) {
            for (var key in initObj) {
                this[key] = initObj[key];
            }
        }
    }
}
