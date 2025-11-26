package com.example.backend.db.dao;
import java.util.ArrayList;

import com.example.backend.models.User;

public interface UserRepoInterface {
    public int register(User u);
    public User adminlogin(User user);
    public ArrayList<User> getPending();
}
