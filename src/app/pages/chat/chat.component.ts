import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router }          from '@angular/router';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';

import { ChatService }             from '../../services/chat.service';
import { MessageService }          from '../../services/message.service';
import { LlmService }              from '../../services/llm.service';
import { AuthService }             from '../../services/auth.service';

import { Message }                 from '../../models/message.model';
import { LlmRequest } from '../../models/llm.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;
  chatId!: number;
  messages: Message[] = [];
  newMessage = '';
  loading = false;
  error = '';
  userId = 0;
  currentTheme = 'light';





  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private llmService: LlmService,
    private auth: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.auth.getUserId();
    this.fetchMessages();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  fetchMessages() {
    this.loading = true;
    this.messageService.getMessages().subscribe({
      next: (all) => {
        this.messages = all.filter(m => m.chat === this.chatId);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load messages.';
        this.loading = false;
      }
    });
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  back(){
    this.router.navigateByUrl('/');
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    this.newMessage = '';
    this.loading = true;

    this.messages.push({
      id: Date.now(),
      content: text,
      chat: this.chatId,
      user: this.userId,
      file: null
    });

    const llmReq: LlmRequest = {
          prompt: text,
          chat_id: this.chatId,
          file_url: ''
        };

    this.llmService.sendPrompt(llmReq).subscribe({
          next: (llmRes) => {
            const aiResponse = llmRes.response;
            this.messages.push({
              id: 0,  
              content: aiResponse,
              chat: this.chatId,
              user: 0,  
              file: null
            });
            this.loading = false;
          },
          error: () => {
            this.error = 'LLM request failed.';
            this.loading = false;
          }
        });
      }

      private scrollToBottom(): void {
        if (this.messagesEnd) {
          this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
  }
