import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environments.prod';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = `${environment.apiBaseUrl}/message`;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/`);
  }

  // createMessage(content: string, chat: number, user: number): Observable<Message> {
  //   return this.http.post<Message>(`${this.apiUrl}/`, { content, chat, user, file: null });
  // }
}