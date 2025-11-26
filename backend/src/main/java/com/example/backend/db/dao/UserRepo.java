package com.example.backend.db.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.regex.*;


import java.sql.Connection;

import com.example.backend.db.DB;
import com.example.backend.models.ChangePass;
import com.example.backend.models.UpdateUser;
import com.example.backend.models.User;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


public class UserRepo implements UserRepoInterface {
    public int register(User u){
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("INSERT INTO users VALUES(?,?,?,?,?,?,?,?,?,?,?,?)");
            PreparedStatement stm2 = conn.prepareStatement("SELECT username FROM users");
            PreparedStatement stm3 = conn.prepareStatement("SELECT email FROM users");
        ){

            String regex = "^(?=[A-Za-z])(?=(.*[a-z]){3,})(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,10}$";


            Pattern pattern = Pattern.compile(regex);

            Matcher matcher = pattern.matcher(u.getPassword());
            if (!matcher.matches()) {
                System.err.println("Ne valja sifra...");
                return -1;
            }

            ResultSet rs1 = stm2.executeQuery();

            while (rs1.next()) {
                String existingUsername = rs1.getString("username");
                if (existingUsername.equals(u.getUsername())) {
                    return -2;
                }
            }

            ResultSet rs2 = stm3.executeQuery();

            while (rs2.next()) {
                String existingEmail = rs2.getString("email");
                if (existingEmail.equals(u.getEmail())) {
                    return -3;
                }
            }

            String rawPassword = u.getPassword();
            String hashedPassword = new BCryptPasswordEncoder().encode(rawPassword);
            u.setPassword(hashedPassword);

            stm.setString(1, u.getUsername());
            stm.setString(2, u.getPassword());
            stm.setString(3, u.getFirstname());
            stm.setString(4, u.getLastname());
            stm.setString(5, u.getGender());
            stm.setString(6, u.getAddress());
            stm.setString(7, u.getPhoneNumber());
            stm.setString(8, u.getEmail());
            stm.setString(9, u.getProfilePicture());
            stm.setString(10, u.getCreditCardNumber());
            stm.setString(11, u.getType());
            stm.setString(12, u.getStatus());

            return stm.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return 1;
    }

    public User adminlogin(User user){
        System.out.println(new BCryptPasswordEncoder().encode("Admin!23"));
        try (Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT password FROM users WHERE username = ? AND type = 'admin'");
            PreparedStatement stm2 = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND type = 'admin'");
            
            ) {

            stm.setString(1, user.getUsername());
            ResultSet rs = stm.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                boolean match = encoder.matches(user.getPassword(), storedHash);

                if (match) {
                    stm2.setString(1, user.getUsername());
                    ResultSet rs2 = stm2.executeQuery();
                    if (rs2.next()){
                        return new User (rs2.getString("username"), rs2.getString("password"), rs2.getString("firstname"),
                            rs2.getString("lastname"),rs2.getString("gender"),rs2.getString("address"),
                            rs2.getString("phone_number"),
                            rs2.getString("email"),rs2.getString("profile_picture"),rs2.getString("credit_card_number"),
                            rs2.getString("type"),rs2.getString("status"));
                    }
                };
            } else {
                System.out.println("No admin user found with that username.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ArrayList<User> getPending() {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT * FROM users WHERE status = 'pending'")
        ){

            ResultSet rs = stm.executeQuery();
            ArrayList<User> users = new ArrayList<>();
            while (rs.next()){
                User u = new User (rs.getString("username"), rs.getString("password"), rs.getString("firstname"),
                rs.getString("lastname"),rs.getString("gender"),rs.getString("address"),
                rs.getString("phone_number"),
                rs.getString("email"),rs.getString("profile_picture"),rs.getString("credit_card_number"),
                rs.getString("type"),rs.getString("status"));
                users.add(u);
            }
            return users;

        }catch(Exception e){
            System.err.println(e);
        }
        return new ArrayList<User>();
    }

    public int adminAccept(String username) {
        try (
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("UPDATE users SET status='active' WHERE username = ?");
        ){

            stm.setString(1, username);
            return stm.executeUpdate();
            
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }

    public int adminDismiss(String username) {
         try (
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("DELETE FROM users WHERE username = ?");
        ){
            stm.setString(1, username);
            return stm.executeUpdate();
            
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }


    public User userlogin(User user){
        try (Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT password, status FROM users WHERE username = ?");
            PreparedStatement stm2 = conn.prepareStatement("SELECT * FROM users WHERE username = ?");
            ) {
            
            
            stm.setString(1, user.getUsername());
            ResultSet rs = stm.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                boolean match = encoder.matches(user.getPassword(), storedHash);
                
                if (rs.getString("status").equals("pending")){
                    System.out.println("User is not active.");
                    return null;
                }

                if (match){
                    stm2.setString(1, user.getUsername());
                    ResultSet rs2 = stm2.executeQuery();
                    if (rs2.next()){
                        return new User (rs2.getString("username"), rs2.getString("password"), rs2.getString("firstname"),
                            rs2.getString("lastname"),rs2.getString("gender"),rs2.getString("address"),
                            rs2.getString("phone_number"),
                            rs2.getString("email"),rs2.getString("profile_picture"),rs2.getString("credit_card_number"),
                            rs2.getString("type"),rs2.getString("status"));
                    }
                } 
            } else {
                System.out.println("No user found with that username.");
            }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
    }

    public int changePassword(ChangePass cp) {
        try (Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT password, status FROM users WHERE username = ?");
            PreparedStatement stm2 = conn.prepareStatement("UPDATE users SET password = ? WHERE username = ?");
            ) {

            if (cp.getOldPassword().equals(cp.getNewPassword())){
                return -6;
            }
 

            String regex = "^(?=[A-Za-z])(?=(.*[a-z]){3,})(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,10}$";


            Pattern pattern = Pattern.compile(regex);

            Matcher matcher = pattern.matcher(cp.getNewPassword());
            if (!matcher.matches()) {
                return -5;
            }

            stm.setString(1, cp.getUsername());
            ResultSet rs = stm.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                

                boolean match = encoder.matches(cp.getOldPassword(), storedHash);

                if (match){
                    if (cp.getNewPassword().equals(cp.getRepNewPassword())){
                        String hashedPassword = new BCryptPasswordEncoder().encode(cp.getNewPassword());
                        stm2.setString(1, hashedPassword);
                        stm2.setString(2, cp.getUsername());

                        return stm2.executeUpdate();

                    }else {
                        return -4;
                    }
                }else{
                    System.out.println("Old password is incorrect.");
                    return -2;
                }
            } else {
                System.out.println("No user found with that username.");
                return -1;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -3;
    }

    public int getNumTurista() {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT COUNT(*) as cnt FROM users WHERE type='turista' AND status='active'")
        ){
            ResultSet rs = stm.executeQuery();
            if (rs.next()){
                return Integer.parseInt(rs.getString("cnt"));
            }
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int getNumVlasnik() {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT COUNT(*) as cnt FROM users WHERE type='vlasnik' AND status='active'")
        ){
            ResultSet rs = stm.executeQuery();
            if (rs.next()){
                return Integer.parseInt(rs.getString("cnt"));
            }
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int updateUser(UpdateUser uu) {
        String sql = "UPDATE users SET " + uu.getField() + " = ? WHERE username = ?";
        try(
            Connection conn = DB.source().getConnection();
            
            PreparedStatement stm = conn.prepareStatement(sql);
        ) {
             stm.setString(1, uu.getNewVal());
             stm.setString(2, uu.getUsername());
             return stm.executeUpdate();
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }

    public int updateProfilePicture(UpdateUser uu) {
        String sql = "UPDATE users SET " + uu.getField() + " = ? WHERE username = ?";
        try(
            Connection conn = DB.source().getConnection();
            
            PreparedStatement stm = conn.prepareStatement(sql);
        ) {
             stm.setString(1, uu.getNewVal());
             stm.setString(2, uu.getUsername());
             return stm.executeUpdate();
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }

    public ArrayList<User> getAllUsers() {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT * FROM users ")
        ){

            ResultSet rs = stm.executeQuery();
            ArrayList<User> users = new ArrayList<>();
            while (rs.next()){
                User u = new User (rs.getString("username"), rs.getString("password"), rs.getString("firstname"),
                rs.getString("lastname"),rs.getString("gender"),rs.getString("address"),
                rs.getString("phone_number"),
                rs.getString("email"),rs.getString("profile_picture"),rs.getString("credit_card_number"),
                rs.getString("type"),rs.getString("status"));
                users.add(u);
            }
            return users;

        }catch(Exception e){
            System.err.println(e);
        }
        return new ArrayList<User>();
    }

    public int izbrisi(String u) {
        try (
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("DELETE FROM users WHERE username = ?");
        ) {
            stm.setString(1, u);
            return stm.executeUpdate();
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }


    

}
