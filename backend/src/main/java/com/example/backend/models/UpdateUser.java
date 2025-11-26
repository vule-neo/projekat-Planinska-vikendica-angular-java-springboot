package com.example.backend.models;

public class UpdateUser {
    private String username;
    private String field;
    private String newVal;


    

    public UpdateUser(String username, String field, String newVal) {
        this.username = username;
        this.field = field;
        this.newVal = newVal;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getField() {
        return field;
    }
    public void setField(String field) {
        this.field = field;
    }
    public String getNewVal() {
        return newVal;
    }
    public void setNewVal(String newVal) {
        this.newVal = newVal;
    }

    
    
    
}
