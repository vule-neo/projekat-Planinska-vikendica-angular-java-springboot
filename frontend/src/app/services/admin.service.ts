import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getAllUsers() {
    return this.http.get<User[]>(`${this.path}/getAllUsers`)
  }

  constructor() { }

  private http = inject(HttpClient);
  private path = "http://localhost:8000/user"

  login(username : string, password : string){
    const data = {
      username : username,
      password : password
    }
    return this.http.post<User>(`${this.path}/adminlogin`, data)
  }

  getPendingUsers(){
    return this.http.get<User[]>(`${this.path}/getPending`)
  }

  acceptPending(username : string){
    return this.http.post(`${this.path}/adminaccept`, username)
  }

  dismissPending(username : string){
    return this.http.post(`${this.path}/admindismiss`, username)
  }

  izbrisi(username : string){
    
    return this.http.get(`${this.path}/izbrisi/${username}`)
  }

}
