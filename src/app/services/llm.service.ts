import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import { environment } from '../../environments/environments.prod';

interface LlmRequest {
  prompt: string;
  chat_id: number;
  file_url?: string; 
}

interface LlmResponse {
  response: string;
}

@Injectable({ providedIn: 'root' })
export class LlmService {
  private readonly API = `${environment.apiBaseUrl}/llm/`;
  constructor(private http: HttpClient) {}
  sendPrompt(body: LlmRequest): Observable<LlmResponse> {
    return this.http.post<LlmResponse>(this.API, body);
  }
}