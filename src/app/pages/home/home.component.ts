import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chats: Chat[] = [];
  newChatTitle = '';
  loading = false;
  error = '';
  currentTheme = 'light';


  constructor(
    public auth: AuthService,
    private chatService: ChatService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme
    })
  }

  fetchChats() {
    this.loading = true;
    this.chatService.getChats().subscribe({
      next: (res) => {
        this.chats = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chats.';
        this.loading = false;
      }
    });
  }

  createChat() {
    if (!this.newChatTitle.trim()) return;
  
    const userId = this.auth.getUserId();
  
    this.chatService.createChat(this.newChatTitle, userId).subscribe({
      next: (chat) => {
        this.chats.unshift(chat);
        this.newChatTitle = '';
      },
      error: () => {
        this.error = 'Failed to create chat.';
      }
    });
  }

  deleteChat(id: number) {
    this.chatService.deleteChat(id).subscribe({
      next: () => {
        this.chats = this.chats.filter(c => c.id !== id);
      },
      error: () => {
        this.error = 'Failed to delete chat.';
      }
    });
  }
  

  logout() {
    this.auth.clearToken();
    this.router.navigateByUrl('/auth');
  }

  openChat(chat: Chat) {
    this.router.navigate(['/chat', chat.id]);
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
