import { Component, OnInit } from '@angular/core';
import { Todo } from './todo';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  userId = '';
  userEmail = '';
  model: Todo;

  todoRef: AngularFirestoreCollection<Todo>;
  todo: Observable<Todo[]> 

  constructor(private afs: AngularFirestore, 
        public afa: AngularFireAuth, 
        private userService: UserService, 
        public msg: MessagingService) { 
    this.todoRef = this.afs.collection<Todo>('todos');

    this.model = {
      userId: '',
      todo: '',
      isChecked: false
    }

    this.afa.auth.onAuthStateChanged(user => {
      if(user) {
        this.userEmail = user.email;
        this.userId = user.uid;
      }

      const token = this.msg.getPermission(this.userId);
      // this.msg.monitorRefresh(this.userId);
      this.msg.receiveMessages();
    })

    // const userId = 'cEvkIEs7bmbZTlCkiMz9JYDdfPW2';
    // this.msg.getPermission(this.userId);
    // this.msg.monitorRefresh(this.userId);
    // this.msg.receiveMessages();
  }

  addTodo(todo: string) {
    this.model = {
      userId: this.userId,
      todo: todo, 
      isChecked: false
    }
    this.todoRef.add(this.model);
  }

  ngOnInit() {

  }

  trySignOut() {
    this.userService.signOut();
  }
}
