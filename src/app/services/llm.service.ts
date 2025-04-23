import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';

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
  private readonly API = 'https://backend-web-dev-kbtu-production.up.railway.app/api/llm/';
  constructor(private http: HttpClient) {}
  sendPrompt(body: LlmRequest): Observable<LlmResponse> {
    return this.http.post<LlmResponse>(this.API, body);
  }
}