package com.example.backend.models;

public class ChangePass {
    private String username;
    private String oldPassword;
    private String newPassword;
    private String repNewPassword;

    

    public ChangePass(String username, String oldPassword, String newPassword, String repNewPassword) {
        this.username = username;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.repNewPassword = repNewPassword;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getOldPassword() {
        return oldPassword;
    }
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    public String getRepNewPassword() {
        return repNewPassword;
    }
    public void setRepNewPassword(String repNewPassword) {
        this.repNewPassword = repNewPassword;
    }

    
}
