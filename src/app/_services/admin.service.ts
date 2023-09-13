import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  getUsersWithRoles(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + 'admin/users-with-roles');
  }
}
