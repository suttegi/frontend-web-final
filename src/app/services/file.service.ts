import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileItem } from '../models/file.model';
import { environment } from '../../environments/environments.prod';

@Injectable({ providedIn: 'root' })
export class FileService {
  private apiUrl = `${environment.apiBaseUrl}/file`;

  constructor(private http: HttpClient) {}

  getFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.apiUrl}/`);
  }

  uploadFile(formData: FormData): Observable<FileItem> {
    return this.http.post<FileItem>(`${this.apiUrl}/`, formData);
  }
}