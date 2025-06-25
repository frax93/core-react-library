export interface ResponseSummary {
    code: string;
    error: boolean;
    messages: string[];
  }
  
  export interface HttpResponse<T> {
    payload: T;
    summary: ResponseSummary;
  }
  
  type PaginationInformation = {
    totalCount: number;
    page: number;
    pageSize: number;
  };
  
  
  interface HttpResponseListPayload{
    pageInfo?: PaginationInformation;
    totalRows: number;
  }
  
  export type HttpResponseList<T> = HttpResponse<Array<T>& HttpResponseListPayload>;
    