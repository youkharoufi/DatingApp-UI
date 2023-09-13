import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseURL = environment.apiURL;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model:any) {
    return this.http.post<User>(this.baseURL + "account/login", model).pipe(map((response:User) => {
      const user = response;
      if (user) {
        this.setCurrentUser(user);
      }
    }));
    
  }

  register(model: any) {
    return this.http.post<User>(this.baseURL + "account/register", model).pipe(map((user: User) => {
      if (user) {
        this.setCurrentUser(user);
      }
    }));

  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
