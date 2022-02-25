import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  statusSuccess: boolean = false;
  taskForm: FormGroup;
  taskAlreadyPresent = false;
  errorText = '';

  constructor(private fb:FormBuilder, private taskService:TaskService, private router:Router, private http:HttpClient) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      username: ['',Validators.required],
      password:['', Validators.required],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]]
    })
  }

  onSubmit(){
    this.statusSuccess = !this.statusSuccess;
    const task = this.taskForm.value;
    console.log('onSubmit() task : ', task)
    this.addTask(task);
  }

  addTask(task){
    this.taskService.addTask(task).subscribe(isTaskSaved => {
      if (isTaskSaved && isTaskSaved.data && !isTaskSaved.errors){
        console.log('task saved! isTaskSaved: ', isTaskSaved);
        this.router.navigate(['/login'])
      }
      else if (isTaskSaved.err) {
        this.errorText = 'Technical error. Please try again in few minutes.'
      }
      else {
        console.log('Task already present')
        this.errorText = 'Task already exists. Please try with a different username.'
        this.taskAlreadyPresent = true;
      }
    })
  }
}
