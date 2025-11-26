package com.example.backend.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.db.dao.UserRepo;
import com.example.backend.models.ChangePass;
import com.example.backend.models.UpdateUser;
import com.example.backend.models.User;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    @PostMapping("/register")
    public int register(@RequestBody User user) {
        return new UserRepo().register(user);
    }

    @PostMapping("/adminlogin")
    public User adminlogin(@RequestBody User user) {
        return new UserRepo().adminlogin(user);
    }

    @GetMapping("/getPending")
    public ArrayList<User> getPending(){
        return new UserRepo().getPending();
    }

    @GetMapping("/getAllUsers")
    public ArrayList<User> getAllUsers(){
        return new UserRepo().getAllUsers();
    }

    @PostMapping("/adminaccept")
    public int adminAccept(@RequestBody String username) {
        return new UserRepo().adminAccept(username);
    }

    @PostMapping("/admindismiss")
    public int adminDismiss(@RequestBody String username) {
        return new UserRepo().adminDismiss(username);
    }
    

    @PostMapping("/userlogin")
    public User userlogin(@RequestBody User user) {
        return new UserRepo().userlogin(user);
    }

    @PostMapping("/changePassword")
    public int changePassword(@RequestBody ChangePass cp) {
        return new UserRepo().changePassword(cp);
    }

    @GetMapping("/numOfTurista")
    public int getNumTurista(){
        return new UserRepo().getNumTurista();
    }

    @GetMapping("/numOfVlasnik")
    public int getNumVlasnik(){
        return new UserRepo().getNumVlasnik();
    }

    @PostMapping("/updateUser")
    public int updateUser(@RequestBody UpdateUser uu) {
        return new UserRepo().updateUser(uu);
    }

    @PostMapping("/updateProfilePicture")
    public int updateProfilePicture(@RequestBody UpdateUser uu) {
        return new UserRepo().updateProfilePicture(uu);
    }


    @GetMapping("/izbrisi/{username}")
    public int izbrisi(@PathVariable String username) {
        return new UserRepo().izbrisi(username);
    }

}
