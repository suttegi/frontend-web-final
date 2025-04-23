import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map }   from 'rxjs/operators';
import { Observable, throwError }  from 'rxjs';
import { AuthToken } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessKey  = 'accessToken';
  private readonly refreshKey = 'refreshToken';

  getToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }
  
  setToken(tokens: AuthToken) {
    localStorage.setItem(this.accessKey,  tokens.access);
    localStorage.setItem(this.refreshKey, tokens.refresh);
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id ?? 0;
    } catch {
      return 0;
    }
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload); 
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  clearToken() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }

}
