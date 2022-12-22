//lấy phần đầu của stt, dùng để xác định cha cua phần tử
export function getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
}
// lấy phần đuôi của stt
export function getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
}
//tìm vị trí cần để thêm mới
export function findIndex(str: string, lstCtietBcao: any[]): number {
    const start: number = lstCtietBcao.findIndex(e => e.stt == str);
    let index: number = start;
    for (let i = start + 1; i < lstCtietBcao.length; i++) {
        if (lstCtietBcao[i].stt.startsWith(str)) {
            index = i;
        }
    }
    return index;
}