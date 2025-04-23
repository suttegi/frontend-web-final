import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileItem } from '../models/file.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  private apiUrl = '/api/file';

  constructor(private http: HttpClient) {}

  getFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.apiUrl}/`);
  }

  uploadFile(formData: FormData): Observable<FileItem> {
    return this.http.post<FileItem>(`${this.apiUrl}/`, formData);
  }
}