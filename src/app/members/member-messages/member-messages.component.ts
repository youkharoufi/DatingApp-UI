import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../_model/message';
import { MessageService } from '../../_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {

  @Input() username?: string;

  @Input() messages: Message[] = [];

  @ViewChild("messageForm") messageForm?: NgForm | undefined;

  messageContent = '';

  constructor(private messageService : MessageService) { }

  ngOnInit(): void {
  }


  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).subscribe({
      next: message => {
        this.messages.push(message);
        this.messageForm?.reset()
      }
      })
  }

  


}
