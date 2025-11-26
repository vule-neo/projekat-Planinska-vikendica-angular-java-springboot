package com.example.backend.db.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;

import com.example.backend.db.DB;
import com.example.backend.models.Cenovnik;
import com.example.backend.models.DodajVikendicu;
import com.example.backend.models.Rezervacija;
import com.example.backend.models.UpdateCenovnik;
import com.example.backend.models.Vikendica;

public class VikendicaRepo {

    public int dodajVikendicu(DodajVikendicu dvr) {
        Connection conn = null;

        try {
            conn = DB.source().getConnection();
            conn.setAutoCommit(false); 

            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO Vikendica (vlasnik, naziv, mesto, usluge, telefon, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            PreparedStatement stm2 = conn.prepareStatement(
                "INSERT INTO VikendicaSlika (vikendica_id, slika_url) VALUES (?, ?)"
            );
            PreparedStatement stm3 = conn.prepareStatement(
                "SELECT id FROM Vikendica WHERE naziv = ?"
            );
            PreparedStatement stm4 = conn.prepareStatement(
                "INSERT INTO Cenovnik (vikendica_id, periodod, perioddo, cena) VALUES (?, ?, ?, ?)"
            );

            stmt.setString(1, dvr.getVikendica().getVlasnik());
            stmt.setString(2, dvr.getVikendica().getNaziv());
            stmt.setString(3, dvr.getVikendica().getMesto());
            stmt.setString(4, dvr.getVikendica().getUsluge());
            stmt.setString(5, dvr.getVikendica().getTelefon());
            stmt.setDouble(6, dvr.getVikendica().getX());
            stmt.setDouble(7, dvr.getVikendica().getY());

            stmt.executeUpdate();

            stm3.setString(1, dvr.getVikendica().getNaziv());
            ResultSet rs = stm3.executeQuery();

            String vikendicaId = null;
            if (rs.next()) {
                vikendicaId = rs.getString("id");
                stm2.setString(1, vikendicaId);
                stm4.setString(1, vikendicaId);
            } else {
                conn.rollback();
                return -1;
            }

            for (String slika : dvr.getVikendica().getSlike()) {
                stm2.setString(2, slika);
                stm2.executeUpdate();
            }

            for (Cenovnik c : dvr.getCenovnici()) {
                stm4.setString(2, String.valueOf(c.getOd()));
                stm4.setString(3, String.valueOf(c.getDoo()));
                stm4.setString(4, String.valueOf(c.getCena()));
                stm4.executeUpdate();
            }

            conn.commit();
            return 1;

        } catch (Exception e) {
            System.err.println("Error: " + e);
            if (conn != null) {
                try {
                    conn.rollback(); 
                } catch (SQLException se) {
                    System.err.println("Rollback failed: " + se);
                }
            }
        } finally {
            try {
                if (conn != null) conn.setAutoCommit(true);
            } catch (SQLException e) {
                System.err.println("Failed to reset autocommit: " + e);
            }
        }

        return -1;
    }

    public ArrayList<String> mojeVikendice(String username) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement(
                "SELECT naziv FROM Vikendica WHERE vlasnik = ?"
            )
        ){
            ArrayList <String> vikendice = new ArrayList<>();
            stm.setString(1, username);
            ResultSet rs = stm.executeQuery();
            
            while (rs.next()){
                vikendice.add(rs.getString("naziv"));
            }

            return vikendice;
        }catch (Exception e){
            System.err.println(e);
        }
        return null;
    }

    public int updateVikendica(String[] info) {
        String sql = "UPDATE vikendica SET " + info[1]+ " = ? WHERE naziv = ? ";
        try(
            Connection conn = DB.source().getConnection();
            
            PreparedStatement stm = conn.prepareStatement(sql);
        ){
            System.out.println("INFO 0 " + info[0]);
            System.out.println("INFO 1 " + info[1]);
            System.out.println("INFO 2 " + info[2]);
            stm.setString(1, info[2]);
            stm.setString(2, info[0]);
            return stm.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int deleteVikendica(String naziv) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement(
                "DELETE FROM vikendica where naziv = ?"
            )
        ){
            stm.setString(1, naziv);
            return stm.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public Vikendica getAllInfo(String naziv) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement(
                "SELECT * FROM Vikendica WHERE naziv = ?"
            )
        ){
            stm.setString(1, naziv);
            ResultSet rs = stm.executeQuery();
            if (rs.next()){
                Vikendica v = new Vikendica("", naziv, rs.getString("mesto"), rs.getString("usluge"), 
                rs.getString("telefon"), (rs.getDouble("x")), 
                (rs.getDouble("y")), null);
                return v;
            }
        }catch(Exception e){
            System.err.println(e);
        }
        return null;
    }

    public ArrayList<String> getAllSlike(String naziv) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement(
                "SELECT id FROM Vikendica WHERE Naziv = ?"
            );
            PreparedStatement stm2 = conn.prepareStatement(
                "SELECT slika_url FROM vikendicaslika WHERE vikendica_id = ?"
            )
        ){
           stm1.setString(1, naziv);
           ResultSet rs1 = stm1.executeQuery();
           String id = null;
           if (rs1.next()) id = rs1.getString("id");
           stm2.setString(1, id);
           ResultSet rs2 = stm2.executeQuery();
           ArrayList<String> slike = new ArrayList<>();
           while (rs2.next()){
            slike.add(rs2.getString("slika_url"));
           }
           return slike;
        }catch(Exception e){
            System.err.println(e);
        }
        return null;
    }

    public ArrayList<Cenovnik> getAllCenovnici(String naziv) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement(
                "SELECT id FROM Vikendica WHERE Naziv = ?"
            );
            PreparedStatement stm2 = conn.prepareStatement(
                "SELECT periodod, perioddo, cena FROM cenovnik WHERE vikendica_id = ?"
            )
        ){
           stm1.setString(1, naziv);
           ResultSet rs1 = stm1.executeQuery();
           String id = null;
           if (rs1.next()) id = rs1.getString("id");
           stm2.setString(1, id);
           ResultSet rs2 = stm2.executeQuery();
           ArrayList<Cenovnik> cenovnici = new ArrayList<>();
           while (rs2.next()){
            cenovnici.add(new Cenovnik(id, rs2.getDouble("cena"), rs2.getInt("periodod"), 
            rs2.getInt("perioddo")));
           }
           return cenovnici;
        }catch(Exception e){
            System.err.println(e);
        }
        return null;
    }

    public int deleteSlika(String[] info) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm2 = conn.prepareStatement(
                "DELETE FROM vikendicaslika where slika_url = ? AND vikendica_id = ?"
            );
            PreparedStatement stm1 = conn.prepareStatement(
                "SELECT id FROM vikendica WHERE naziv = ?"
            )
        ){
            stm1.setString(1, info[1]);
           ResultSet rs1 = stm1.executeQuery();
           String id = null;
           if (rs1.next()) id = rs1.getString("id");
           stm2.setString(1, info[0]);
           stm2.setString(2, id);
           return stm2.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int uploadImage(String[] info) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement(
                "SELECT id FROM vikendica WHERE naziv = ?"
            );
            PreparedStatement stm2 = conn.prepareStatement(
                "INSERT INTO VikendicaSlika (vikendica_id, slika_url) VALUES (?, ?)"
            );
        ){
            stm1.setString(1, info[1]);
           ResultSet rs1 = stm1.executeQuery();
           String id = null;
           if (rs1.next()) id = rs1.getString("id");
           stm2.setString(1, id);
           stm2.setString(2, info[0]);
           return stm2.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int updateCenovnik(UpdateCenovnik uc) {
        String sql = "UPDATE cenovnik SET " + uc.getField() + " = ? WHERE vikendica_id = ? AND periodod = ? and perioddo = ?";
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement(
                sql
            );
            
        ){
            stm1.setInt(1, uc.getNewVal());
            stm1.setString(2, uc.getCenovnik().getVikendica());
            stm1.setInt(3, uc.getCenovnik().getOd());
            stm1.setInt(4, uc.getCenovnik().getDoo());
            return stm1.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int dodajCenovnik(Cenovnik c) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm3 = conn.prepareStatement(
                "SELECT id FROM Vikendica WHERE naziv = ?"
            );
            PreparedStatement stm4 = conn.prepareStatement(
                "INSERT INTO Cenovnik (vikendica_id, periodod, perioddo, cena) VALUES (?, ?, ?, ?)"
            );
        ){
            stm3.setString(1, c.getVikendica());
            ResultSet rs = stm3.executeQuery();
            String id = "";
            if (rs.next()){
                id = rs.getString("id");
            }
            stm4.setString(1, id);
            stm4.setInt(2, c.getOd());
            stm4.setInt(3, c.getDoo());
            stm4.setDouble(4, c.getCena());
            return stm4.executeUpdate();
        }catch(Exception e){

        }
        return -1;
    }

    public int numVikendica() {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm3 = conn.prepareStatement(
                "SELECT COUNT(*) AS cnt FROM Vikendica"
            );
        ){
            ResultSet rs = stm3.executeQuery();
            if (rs.next()){
                System.out.println(rs.getInt("cnt"));
                return rs.getInt("cnt");
            }
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public ArrayList<Vikendica> getAllVikendice() {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm3 = conn.prepareStatement(
                "SELECT * FROM Vikendica"
            );
        ){
            ResultSet rs = stm3.executeQuery();
            ArrayList<Vikendica> vikendice = new ArrayList<>();
            while (rs.next()){
                Vikendica v = new Vikendica(rs.getString("vlasnik"), rs.getString("naziv"), 
                rs.getString("mesto"), rs.getString("usluge"), rs.getString("telefon"), 
                rs.getDouble("x"), rs.getDouble("y"), null);
                vikendice.add(v);
            }
            return vikendice;
        }catch(Exception e){
            System.err.println(e);
        }
        return null;
    }

    public int racunajCijenu(Rezervacija r) {
    try (
        Connection conn = DB.source().getConnection();
        PreparedStatement stm3 = conn.prepareStatement(
            "SELECT id FROM Vikendica WHERE naziv = ?"
        );
        PreparedStatement stm4 = conn.prepareStatement(
            "SELECT * FROM Cenovnik WHERE periodod <= ? AND perioddo >= ? AND vikendica_id = ?"
        );
    ) {
        stm3.setString(1, r.getVikendica());
        ResultSet rs = stm3.executeQuery();
        String id = "";
        if (rs.next()) {
            id = rs.getString("id");
        } else {
            System.err.println("Vikendica not found");
            return -1;
        }

        LocalDate datumPocetka = LocalDate.parse(r.getDatumPocetka());
        LocalDate datumKraja = LocalDate.parse(r.getDatumKraja());

        int danPocetak = datumPocetka.getDayOfMonth();
        int mjesecPocetak = datumPocetka.getMonthValue();
        int godinaPocetak = datumPocetka.getYear();

        int danKraj = datumKraja.getDayOfMonth();
        int mjesecKraj = datumKraja.getMonthValue();
        int godinaKraj = datumKraja.getYear();

        int cijena = 0;

        if (mjesecPocetak == mjesecKraj && godinaPocetak == godinaKraj) {
            stm4.setInt(1, mjesecPocetak);
            stm4.setInt(2, mjesecPocetak);
            stm4.setString(3, id);
            ResultSet rs1 = stm4.executeQuery();

            if (rs1.next()) {
                int brojDana = danKraj - danPocetak + 1;
                cijena = brojDana * rs1.getInt("cena");
            }
        } else {
            YearMonth yearMonthPocetak = YearMonth.of(godinaPocetak, mjesecPocetak);
            int totalDaysPocetakMonth = yearMonthPocetak.lengthOfMonth();
            int daysFirstMonth = totalDaysPocetakMonth - danPocetak + 1; 

            stm4.setInt(1, mjesecPocetak);
            stm4.setInt(2, mjesecPocetak);
            stm4.setString(3, id);
            ResultSet rs1 = stm4.executeQuery();

            if (rs1.next()) {
                cijena += daysFirstMonth * rs1.getInt("cena");
            }

            int daysLastMonth = danKraj;

            stm4.setInt(1, mjesecKraj);
            stm4.setInt(2, mjesecKraj);
            stm4.setString(3, id);
            ResultSet rs2 = stm4.executeQuery();

            if (rs2.next()) {
                cijena += daysLastMonth * rs2.getInt("cena");
            }

            LocalDate startNextMonth = datumPocetka.plusMonths(1).withDayOfMonth(1);
            LocalDate endPrevMonth = datumKraja.minusMonths(1).withDayOfMonth(1);


            while (!startNextMonth.isAfter(endPrevMonth)) {
                int month = startNextMonth.getMonthValue();
                int year = startNextMonth.getYear();

                stm4.setInt(1, month);
                stm4.setInt(2, month);
                stm4.setString(3, id);
                ResultSet rsMid = stm4.executeQuery();

                if (rsMid.next()) {
                    YearMonth ymMid = YearMonth.of(year, month);
                    int fullMonthDays = ymMid.lengthOfMonth();
                    cijena += fullMonthDays * rsMid.getInt("cena");
                }

                startNextMonth = startNextMonth.plusMonths(1);
            }
        }

        return cijena;

    } catch (Exception e) {
        System.err.println(e);
        return -1;
    }
}

    public int numVikendicaUPeriodu(int brDana) {
    String sql = "SELECT COUNT(*) AS cnt FROM rezervacija WHERE datum_rezervacije >= CURDATE() - INTERVAL ? DAY";
    
    try (
        Connection conn = DB.source().getConnection();
        PreparedStatement stm = conn.prepareStatement(sql);
    ) {
        stm.setInt(1, brDana);
        ResultSet rs = stm.executeQuery();

        if (rs.next()) {
            return rs.getInt("cnt");
        }

    } catch (Exception e) {
        System.err.println(e);
    }
    return -1;
}

    public double prosecnaOcena(String naziv) {
    String getIdSql = "SELECT id FROM Vikendica WHERE naziv = ?";
    String getAvgRatingSql = "SELECT AVG(ocena) AS avg_ocena FROM rezervacija WHERE vikendica = ? AND ocena BETWEEN 1 AND 5";

    try (
        Connection conn = DB.source().getConnection();
        PreparedStatement stm1 = conn.prepareStatement(getIdSql);
        PreparedStatement stm2 = conn.prepareStatement(getAvgRatingSql);
    ) {
        stm1.setString(1, naziv);
        ResultSet rs1 = stm1.executeQuery();

        if (!rs1.next()) {
            return 0.0;
        }

        String vikendicaId = rs1.getString("id");

        stm2.setString(1, vikendicaId);
        ResultSet rs2 = stm2.executeQuery();

        if (rs2.next()) {
            double avg = rs2.getDouble("avg_ocena");
            if (rs2.wasNull()) return 0.0;
            return avg;
        }

    } catch (Exception e) {
        System.err.println(e);
    }
    return 0.0;
}

    public ArrayList<Rezervacija> getAllRezervacije(String naziv) {
    String getIdSql = "SELECT id FROM Vikendica WHERE naziv = ?";
    String getRezervacijeSql = "SELECT * FROM rezervacija WHERE vikendica = ?";

    try (
        Connection conn = DB.source().getConnection();
        PreparedStatement stm1 = conn.prepareStatement(getIdSql);
        PreparedStatement stm2 = conn.prepareStatement(getRezervacijeSql);
    ) {
        stm1.setString(1, naziv);
        ResultSet rs1 = stm1.executeQuery();

        String vikendicaId = null;
        if (rs1.next()) {
            vikendicaId = rs1.getString("id");
        } else {
            return new ArrayList<>();
        }

        stm2.setString(1, vikendicaId);
        ResultSet rs2 = stm2.executeQuery();

        ArrayList<Rezervacija> rezervacije = new ArrayList<>();

        while (rs2.next()) {
            Rezervacija r = new Rezervacija(
                naziv,                                              
                rs2.getString("korisnik"),
                rs2.getString("datum_pocetka"),
                rs2.getString("datum_kraja"),
                rs2.getInt("broj_odraslih"),
                rs2.getInt("broj_dece"),
                rs2.getString("opis"),
                rs2.getInt("ukupna_cena"),
                rs2.getString("status"),
                rs2.getString("credit_card_number"),
                rs2.getInt("ocena"),
                rs2.getString("komentar")
            );
            rezervacije.add(r);
        }

        return rezervacije;

    } catch (Exception e) {
        System.err.println(e);
    }

    return null;
}





    
}
