import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Todo } from '../todo/todo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

 

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent   {
  private todoCollection: AngularFirestoreCollection<Todo>;
  
  todos: Observable<Todo[]>;

  userId = '';
  myValue = '';
  todoId = '';
  editDisable = true;
  constructor(private readonly afs: AngularFirestore, public afa: AngularFireAuth, private userService: UserService) { 
      this.afa.auth.onAuthStateChanged(user => {
        if(user) {
          this.userId = user.uid;
          this.todoCollection =  afs.collection<Todo>('todos', ref => ref.where('userId', '==', this.userId));
          this.todos = this.todoCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Todo;
              const id = a.payload.doc.id;
              return {id , ...data };
            }))
          );
        }
    });
  }

  ngOnInit() {
  }

  deleteTodo(id) {
    this.userService.deleteTodo(id);
  }

  updateTodo(id, todo) {
    this.userService.updateTodo(id, todo);
    this.myValue = '';
  }

  updateChecked(id, value:boolean) {
    this.userService.updateIsChecked(id, value);
  }

  editClick(todo, id) {
    this.todoId = id;
    this.myValue = todo;
    this.editDisable = false;
  }

  setReminder(id, dateValue) {
    console.log("id", id);
    console.log("value", dateValue);

    this.userService.setRemider(id, dateValue);
  }

  checkDate(id, date) {
    this.userService.checkDate(id,date);
  }
}
