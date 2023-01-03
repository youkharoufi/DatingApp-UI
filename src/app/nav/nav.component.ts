import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../_model/User';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model = {
    username:'',
    password:''
  };

  currentUser$: Observable<User | null> = of(null);

  constructor(private accountService: AccountService, private ref: ChangeDetectorRef,
  private router: Router, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    //console.log(this.currentUser$);
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        console.log("Connected");
        this.currentUser$ = this.accountService.currentUser$;
        this.ref.detectChanges();
        this.router.navigateByUrl('/members');
      },
      error: error => {
        this.toastr.error(error.error);
      }
      })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
