import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isCollapsed = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/welcome/dashboard']);
  }

}
