import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult } from "../_model/pagination";

export function getPaginatedResults<T>(url: string, params: HttpParams, http : HttpClient) {

  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  //if (this.members.length > 0) return of(this.members);
  return http.get<T>(url, { observe: 'response', params }).pipe(
    map(response => {
      if (response.body) {
        paginatedResult.result = response.body;
      }

      const pagination = response.headers.get('Pagination');

      if (pagination) {
        paginatedResult.pagination = JSON.parse(pagination);
      }

      return paginatedResult;

    })
  )

}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);

  return params;

}
