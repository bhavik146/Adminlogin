import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/task.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-task-farm',
  templateUrl: './task-farm.component.html',
  styleUrls: ['./task-farm.component.css']
})
export class TaskFarmComponent implements OnInit {

  constructor(private taskService:TaskService, private router:Router) { }

  public allTasks:Task[];
  displayedColumns: string[] = ['name', 'username', 'password', 'update', 'delete'];
  dataSource = new MatTableDataSource([]);

  ngOnInit(): void {
    this.checkIfTaskAlreadyLoggedIn();
    this.getAllTasks();
  }

  checkIfTaskAlreadyLoggedIn(){
    if (sessionStorage.getItem('access_token_task')) {
      this.router.navigate(['/task-farm']);
    } else {
      this.router.navigate(['/login'])
    }
  }

  getAllTasks(){
    this.taskService.getAllTasks().subscribe(allTasks => {
      if (allTasks) {
        this.allTasks = allTasks;
        this.dataSource = new MatTableDataSource(allTasks)
      }
    })
  }

  updateTask(task){
    // const updatedUsername = document.getElementById(task._id + '_input_username').value;
    // const updatedPassword = document.getElementById(task._id + '_input_password').value;
    // const updatedName = document.getElementById(task._id + '_input_name').value;

    // const updatedTask = task;
    // updatedTask.username = updatedUsername;
    // updatedTask.password = updatedPassword;
    // updatedTask.name = updatedName;
    
    console.log('Updated Task ', task);

    this.taskService.updateTask(task).subscribe(data => {
      if (data) {
        this.getAllTasks();
      }
    })
  }

  deleteTask(task) {
    this.taskService.deleteTask(task).subscribe(data => {
      if (data) {
        this.getAllTasks();
      }
    });
  }

  editTask(task) {
    console.log('task : ', task);

    this.disableTexts(task);
    this.enableInputs(task);
  }

  disableTexts(task) {
    if (document.getElementById(task._id + '_span_name').style.display !== 'none') {
      document.getElementById(task._id + '_span_name').style.display = 'none';
    }
    if (document.getElementById(task._id + '_span_username').style.display !== 'none') {
      document.getElementById(task._id + '_span_username').style.display = 'none';
    }
    if (document.getElementById(task._id + '_span_password').style.display !== 'none') {
      document.getElementById(task._id + '_span_password').style.display = 'none';
    }
    if (document.getElementById(task._id + '_edit_btn').style.display !== 'none') {
      document.getElementById(task._id + '_edit_btn').style.display = 'none';
    }
  }

  enableInputs(task) {
    if (document.getElementById(task._id + '_input_name').style.display === 'none') {
      document.getElementById(task._id + '_input_name').style.display = 'block';
    }
    if (document.getElementById(task._id + '_input_username').style.display === 'none') {
      document.getElementById(task._id + '_input_username').style.display = 'block';
    }
    if (document.getElementById(task._id + '_input_password').style.display === 'none') {
      document.getElementById(task._id + '_input_password').style.display = 'block';
    }
    if (document.getElementById(task._id + '_update_btn').style.display === 'none') {
      document.getElementById(task._id + '_update_btn').style.display = 'block';
    }
  }

  logout() {
    sessionStorage.removeItem('access_token_task');
    this.router.navigate(['/login']);
  }

  onBackspaceClick() {
    this.router.navigate(['/']);
  }

}
