import { Component, OnInit } from '@angular/core';
import { User } from './_model/User';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';

  constructor(private accountService : AccountService) { }

  ngOnInit(): void {

    this.setCurrentUser();
    
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }


}