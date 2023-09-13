import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_model/member';
import { MembersService } from '../../_services/members.service';
import { NgxGalleryOptions, NgxGalleryAnimation, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_model/message';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, AfterViewInit{

  @ViewChild('memberTabs') memberTabs?: TabsetComponent
  activeTab?: TabDirective;

  member: Member | undefined;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  messages: Message[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute,
    private messageService : MessageService
  ) { }

  ngOnInit(): void {
    this.loadMember();

  

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false

      }
    ];

  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  getImages() {
    if (!this.member) return [];

    const imageUrls = [];

    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        large: photo.url
      })
    }

    return imageUrls;
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        console.log(this.member?.photoUrl)
        this.galleryImages = this.getImages();
      }
    })

  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages,

      })
    }
  }

  onTabActivated(data: TabDirective) {


    this.activeTab = data;

    if (this.activeTab.heading === 'Messages') {
      this.loadMessages()
}
  }

  

}
