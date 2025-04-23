import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'https://backend-web-dev-kbtu-production.up.railway.app/api/chat';

  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/`);
  }

  createChat(title: string, user: number): Observable<Chat> {
    return this.http.post<Chat>(`https://backend-web-dev-kbtu-production.up.railway.app/api/chat/`, { title, user });
  }  

  updateChat(id: number, title: string, user: number): Observable<Chat> {
    return this.http.put<Chat>(`${this.apiUrl}${id}/`, { title, user });
  }

  deleteChat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}