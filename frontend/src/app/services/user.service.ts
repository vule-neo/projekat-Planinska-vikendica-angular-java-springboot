import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private path = "http://localhost:8000/user"

  register(username:string, password : string, firstname:string, lastname : string, gender : string, address : string, 
    phoneNumber : string, email : string, profilePicture:string, creditCardNumber : string, type : string){
    const data = {
      username : username,
      password : password,
      firstname:firstname, 
      lastname :lastname, 
      gender : gender, 
      address :address, 
      phoneNumber :phoneNumber, 
      email :email, 
      profilePicture:profilePicture, 
      creditCardNumber :creditCardNumber, 
      type :type,
      status : "pending"
    }
    
    
    return this.http.post<Number>(`${this.path}/register`, data)
  }

  registerAdmin(username:string, password : string, firstname:string, lastname : string, gender : string, address : string, 
    phoneNumber : string, email : string, profilePicture:string, creditCardNumber : string, type : string){
    const data = {
      username : username,
      password : password,
      firstname:firstname, 
      lastname :lastname, 
      gender : gender, 
      address :address, 
      phoneNumber :phoneNumber, 
      email :email, 
      profilePicture:profilePicture, 
      creditCardNumber :creditCardNumber, 
      type :type,
      status : "active"
    }
    
    
    return this.http.post<Number>(`${this.path}/register`, data)
  }

  
  login(username: string, password: string) {
    const data = {
      username : username,
      password : password
    }
    return this.http.post<User>(`${this.path}/userlogin`, data);
  }

  changePassword(oldPassword: string, newPassword: string, repNewPassword: string) {

    const data = {
      username: this.authService.getUser()?.username,
      oldPassword:oldPassword,
      newPassword:newPassword,
      repNewPassword:repNewPassword
    }

    return this.http.post<Number>(`${this.path}/changePassword`, data);
  }

  getNumTurista() {
    return this.http.get<Number>(`${this.path}/numOfTurista`);
  }
  getNumVlasnik() {
    return this.http.get<Number>(`${this.path}/numOfVlasnik`);
  }

  updateUser(what: string, what2 : string) {
    const data = {
      username: this.authService.getUser()?.username,
      field : what,
      newVal : what2
    }
    return this.http.post<Number>(`${this.path}/updateUser`, data);
  }

  adminUpdateUser(what: string, what2 : string, username: string) {
    const data = {
      username: username,
      field : what,
      newVal : what2
    }
    return this.http.post<Number>(`${this.path}/updateUser`, data);
  }

  uploadProfilePicture(data : any) {
    return this.http.post<Number>(`${this.path}/updateProfilePicture`, data);
  }

}
