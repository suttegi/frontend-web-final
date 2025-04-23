import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themes = ['light', 'dark'];
  
  private currentThemeSubject = new BehaviorSubject<string>(
    localStorage.getItem('theme') || 'light'
  );
  
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.applyTheme(this.currentThemeSubject.value);
  }

  toggleTheme() {
    const current = this.currentThemeSubject.value;
    const nextIndex = (this.themes.indexOf(current) + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    
    this.setTheme(nextTheme);
  }

  setTheme(theme: string) {
    if (this.themes.includes(theme)) {
      localStorage.setItem('theme', theme);
      this.currentThemeSubject.next(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: string) {
    document.body.className = '';
    document.body.classList.add(theme);
  }
}