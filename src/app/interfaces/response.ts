export interface OldResponseData {
  success: boolean;
  status?: number;
  error?: string;
  data?: any;
  message?: string;
  totalRecord?: number;
}
export type ResponseData<T> = {
  success: boolean;
  status?: number;
  error?: string;
  data?: T;
  message?: string;
  totalRecord?: number;
};
