import { Component } from '@angular/core';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-firebase-app';

  message;

  constructor(public msg: MessagingService) {}
  ngOnInit() {
    // const userId = 'cEvkIEs7bmbZTlCkiMz9JYDdfPW2';
    // this.msg.getPermission(userId);
    // this.msg.monitorRefresh(userId);
    // this.msg.receiveMessages();

  }

}
