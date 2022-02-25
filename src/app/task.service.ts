import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Task } from './models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTask(taskContext){
    return this.http.post('http://localhost:3000/get-task',taskContext);
  }

  getAllTasks():Observable<any>{
    return this.http.get('http://localhost:3000/all');
  }

  addTask(task:Task):Observable<any>{
    console.log('service task ', task);
    return this.http.post('http://localhost:3000/add', task)
  }

  updateTask(task:Task):Observable<any>{
    return this.http.post('http://localhost:3000/update-one', task)
  }

  deleteTask(task: Task): Observable<any>{
    return this.http.post('http://localhost:3000/delete-one', task);
  }

  deleteAllTasks(): Observable<any> {
    return this.http.post('http://localhost:3000/delete-all', {});
  }

}
