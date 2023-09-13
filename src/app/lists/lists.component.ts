import { Component, OnInit } from '@angular/core';
import { Member } from '../_model/member';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Member[] | undefined;
  predicate = 'liked'

  constructor(private membersService : MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }


  loadLikes() {
    this.membersService.getLikes(this.predicate).subscribe({
      next: response => {
        this.members = response;
      }
    })
  }

}
