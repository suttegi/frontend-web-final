import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environments.prod';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})


export class AuthComponent {
  username = '';
  password = '';
  isLoginMode = true;
  errorMessage = '';
  currentTheme = 'light';


  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService

  ) {}

  ngOnInit() {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  submit() {
    const url = this.isLoginMode
      ? `${environment.apiBaseUrl}/token/`
      : `${environment.apiBaseUrl}/register/`;
    
    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>(url, body).subscribe({
      next: (res) => {
        if (this.isLoginMode && res.access && res.refresh) {
          this.auth.setToken({ access: res.access, refresh: res.refresh });
          const decoded = this.auth.decodeToken(res.access);
          if (decoded && decoded.user_id) {
            localStorage.setItem('user', JSON.stringify({ user_id: decoded.user_id }));
          }
          this.router.navigateByUrl('/');
        } else if (!this.isLoginMode) {
          this.isLoginMode = true;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Error occurred';
      }
    });
  }
}
