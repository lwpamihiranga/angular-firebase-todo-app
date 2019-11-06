import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  model: User;
  userRef: AngularFirestoreCollection<User>;


  private messaging = firebase.messaging();
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(private afs: AngularFirestore) { 
    this.userRef = this.afs.collection<User>('users');

    this.model = {
      uid: '',
      fcmToken: ''
    }
   }

  getPermission(user) {
    this.messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted');
      return this.messaging.getToken();
    })
    .then(token => {
      console.log(token);
      this.saveToken(user, token);
    })
    .catch((err) => {
      console.log('Unable to get permission to notify', err);
    });
  }

  // monitorRefresh(user) {
  //   this.messaging.onTokenRefresh(() => {
  //     this.messaging.getToken()
  //     .then(refreshedToken => {
  //       console.log('Token refreshed.');
  //       this.saveToken(user, refreshedToken)
  //     })
  //     .catch( err => console.log(err, 'Unable to retrieve new token') )
  //   });
  // }

  receiveMessages() {
    this.messaging.onMessage(payload => {
     console.log('Message received. ', payload);
     this.messageSource.next(payload)
   });

  }

  // private saveToken(user, token): void {
  //   const currentTokens = user.fcmTokens || { }
  //   console.log(currentTokens, token);

  //   if (!currentTokens[token]) {
  //     const userRef = this.afs.collection('users').doc(user.uid)
  //     const tokens = { ...currentTokens, [token]: true }
  //     userRef.update({ fcmTokens: tokens })
  //   }
  // }

  private saveToken(userID, token): void {

    this.model = {
      uid: userID,
      fcmToken: token
    }
    // this.afs.collection('users').add({userId: userID, fcmToken: token });
    // if(!currentTokens[token])
      this.afs.collection('users').add(this.model); 
  }
}