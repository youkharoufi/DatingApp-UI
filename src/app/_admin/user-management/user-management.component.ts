import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../_modals/roles-modal/roles-modal.component';
import { User } from '../../_model/user';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[] = [];

  bsModalRef : BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>()

  constructor(private adminService: AdminService, private modalService : BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();

    console.log(this.users);
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }

  openRolesModal() {

    const initialState: ModalOptions = {

      initialState: {
        list: [
          'Do thing',
          'Another thing',
          'Something else'
        ],
        title: 'Test modal'
      }

    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
  }

}
