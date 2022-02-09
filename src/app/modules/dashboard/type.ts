import { InjectionToken } from "@angular/core";
import { ApiConstant } from "../types";

export const DASHBOARD_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface BookingResponse {
    dataBookings: [],
    dataTimes: [],
}

export interface ProductResponse {
    dataProduct: ProductData[],
    dataTime: [],
}

export interface ProductData {
    medicalProduct: [],
    otherProduct: [],
}

export interface PatientResponse {
    dataNewPatient: [],
    dataTime: [],
}

export interface ContainerResponse {
    id: string,
    name: string,
}

export interface NurseResponse {
    id: string,
    username: string,
}

export interface DataFilterProductPatient {
    typeDate: string,
    containerId: string,
    nurseId: string,
}
