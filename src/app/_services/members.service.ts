import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member } from '../_model/member';
import { PaginatedResult } from '../_model/pagination';
import { User } from '../_model/user';
import { UserParams } from '../_model/userParams';
import { AccountService } from './account.service';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseURL = environment.apiURL;

  members: Member[] = [];

  memberCache = new Map();

  userParams: UserParams | undefined;

  user: User | undefined;

  paginatedResults: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user
        }
      }
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params
  }

  getMembers(userParams: UserParams) {

    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResults<Member[]>(this.baseURL + 'users', params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );

  }


      //map(members => {
      //  this.members = members;
      //  return members;
      //}));
  

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) =>
        arr.concat(elem.result), []
    ).find((member: Member) => member.userName === username);

    if (member) return of(member);

    //const member = this.members.find(x => x.userName === username);
    //if (member) return of(member);
    return this.http.get<Member>(this.baseURL + "users/" + username);
  }

  updateMember(member : Member) {
    return this.http.put(this.baseURL + "users", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseURL + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseURL + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseURL + "likes/" + username, {});
  }

  getLikes(predicate: string) {
    return this.http.get<Member[]>(this.baseURL + "likes?predicate=" + predicate);
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

}
