import { Component, OnInit } from '@angular/core';
import { Todo } from './todo';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  userId = '';
  userEmail = '';
  model: Todo;
  successMsg = 'Data saved successfully';

  todoRef: AngularFirestoreCollection<Todo>;
  todo: Observable<Todo[]> 

  constructor(private afs: AngularFirestore, public afa: AngularFireAuth, private userService: UserService) { 
    this.todoRef = this.afs.collection<Todo>('todos');

    this.model = {
      userId: '',
      todo: '',
      isChecked: null
    }

    this.afa.auth.onAuthStateChanged(user => {
      if(user) {
        this.userEmail = user.email;
        this.userId = user.uid;
      }
    })
  }

  addTodo(todo: string) {
    this.model = {
      userId: this.userId,
      todo: todo, 
      isChecked: false
    }
    this.todoRef.add(this.model);
    // .then(_ => alert(this.successMsg));
    // this.todoRef.doc(this.model.id.toString()).set(this.model).then(_ => alert(this.successMsg));
  }

  ngOnInit() {
  }

  trySignOut() {
    this.userService.signOut();
  }
}
