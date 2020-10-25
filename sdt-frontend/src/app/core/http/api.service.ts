import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * @description Create post request to send text to given code
   * @param code
   * @param body
   */
  sendText(code, body) {
    return this.http.post(AppConfig.settings.env.apiEndpoint + '/code/' + code + '/text', body);
  }

  uploadFiles(code, files, backendType) {
    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }

    return this.http.post<any>(AppConfig.settings.env.apiEndpoint + '/code/' + code + '/files?backendType=' + backendType, formData);
  }
}
