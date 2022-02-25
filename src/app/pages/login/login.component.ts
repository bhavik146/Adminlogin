import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  taskForm:FormGroup;
  allTasks;
  allowTaskToLogin= false;
  afterLoginClick= false;
  taskAlreadyLoggedIn = false;

  constructor(private fb:FormBuilder, private router:Router, private taskService:TaskService) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    console.log(this.taskForm);
    this.checkIfUserAlreadyLoggedIn();
  }

  checkIfUserAlreadyLoggedIn(){
    if (sessionStorage.getItem('access_token_task')){
      this.taskAlreadyLoggedIn = true;
      this.router.navigate(['/task-farm']);
    } else {
      this.taskAlreadyLoggedIn = false;
      this.router.navigate(['/login'])
    }
  }

  onLogin(){
    console.log(this.taskForm);
    const task = this.taskForm.value;
    const enteredUsername = task.username;
    const enteredPassword = task.password;
    const tasks = this.allTasks;
    const taskContext = {
      username: enteredUsername,
      password: enteredPassword
    }
    this.taskService.getTask(taskContext).subscribe((token:any) => {
      if (token && token.access_token){
        console.log('token: ', token);
        if (task.username === enteredUsername && task.password === enteredPassword){
          this.allowTaskToLogin = true;
          console.log('success: Redirecting to task-farm');
          sessionStorage.setItem('access_token_task', JSON.stringify(token));
          this.router.navigate(['/task-farm']);
          return;
        } 
      } else {
        sessionStorage.removeItem('access_token_task');
        this.allowTaskToLogin = false;
        this.afterLoginClick = true;
        console.log('*****allowTaskToLogin----------->', this.allowTaskToLogin, this.afterLoginClick, ' <-------- afterLoginClick ********************')
      }
    }); 
  }
}
