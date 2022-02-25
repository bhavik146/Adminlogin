import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.checkIfTaskAlreadyLoggedIn();
  }

  checkIfTaskAlreadyLoggedIn(){
    if (sessionStorage.getItem('access_token_empower_tech_task')){
      this.router.navigate(['/task-farm']);
    } else{
      this.router.navigate(['/'])
    }
  }

  navigateToRegister(){
    this.router.navigate(['/registration'])
  }

  navigateToLogin(){
    this.router.navigate(['/login'])
  }

}
