package com.example.backend.db.dao;
import java.time.*;
import java.time.format.DateTimeFormatter;
import com.example.backend.db.DB;
import com.example.backend.models.OdbijenaRezervacija;
import java.time.temporal.ChronoUnit;
import com.example.backend.models.Rezervacija;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
public class RezervacijaRepo {
    public int dodajRezervaciju(Rezervacija r) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement("SELECT id FROM Vikendica WHERE naziv = ?");
            PreparedStatement stm3 = conn.prepareStatement(
                "INSERT INTO rezervacija(vikendica, korisnik,datum_pocetka, datum_kraja,broj_odraslih,broj_dece,opis,ukupna_cena,credit_card_number) " + 
                "VALUES(?,?,?,?,?,?,?,?,?)"
                );
            
        ){
            stm1.setString(1, r.getVikendica());
            ResultSet rs1 = stm1.executeQuery();
            String id = "";
            if (rs1.next()){
                id = rs1.getString("id");
            }
            stm3.setString(1, id);
            stm3.setString(2, r.getKorisnik());
            stm3.setString(3, r.getDatumPocetka());
            stm3.setString(4, r.getDatumKraja());
            stm3.setInt(5, r.getBrojOdraslih());
            stm3.setInt(6, r.getBrojDece());
            stm3.setString(7, r.getOpis());
            stm3.setInt(8, r.getCena());
            stm3.setString(9, r.getBrojKartice());
            return stm3.executeUpdate();

        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public ArrayList<Rezervacija> mojeRezervacije(String user) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT * FROM Rezervacija WHERE korisnik = ?");
            PreparedStatement stm1 = conn.prepareStatement("SELECT naziv FROM Vikendica WHERE id = ?");
        ){
            
            stm.setString(1, user);
            ResultSet rs = stm.executeQuery();
            ArrayList<Rezervacija> rezervacije = new ArrayList<>();
            while (rs.next()){
                
                stm1.setString(1, rs.getString("vikendica"));
                ResultSet rs2 = stm1.executeQuery();
                String nazivVikendice = "";
                if (rs2.next()){
                    nazivVikendice = rs2.getString("naziv");
                }
                Rezervacija r = new Rezervacija(
                    nazivVikendice,
                    user,
                    rs.getString("datum_pocetka"),
                    rs.getString("datum_kraja"),
                    rs.getInt("broj_odraslih"),
                    rs.getInt("broj_dece"),
                    rs.getString("opis"),
                    rs.getInt("ukupna_cena"),
                    rs.getString("status"),
                    rs.getString("credit_card_number"),
                    rs.getInt("ocena"),
                    rs.getString("komentar")
                );

                rezervacije.add(r);
            }
            return rezervacije;
        }catch(Exception e){
            System.err.println(e);
        }
        return null;
    }

    public ArrayList<Rezervacija> rezervacijeVlasnik(String user) {
    try (
        Connection conn = DB.source().getConnection();
        PreparedStatement stm1 = conn.prepareStatement("SELECT id, naziv FROM Vikendica WHERE vlasnik = ?");
        PreparedStatement stm2 = conn.prepareStatement("SELECT naziv FROM Vikendica WHERE id = ?");
    ) {
        ArrayList<Rezervacija> rezervacije = new ArrayList<>();
        stm1.setString(1, user);
        ResultSet rs1 = stm1.executeQuery();

        StringBuilder sql = new StringBuilder("(");
        ArrayList<String> ids = new ArrayList<>();

        while (rs1.next()) {
            ids.add(rs1.getString("id"));
        }

        if (ids.isEmpty()) {
            return rezervacije; 
        }

        for (int i = 0; i < ids.size(); i++) {
            sql.append("?");
            if (i != ids.size() - 1) sql.append(",");
        }
        sql.append(")");

        PreparedStatement stm = conn.prepareStatement("SELECT * FROM Rezervacija WHERE vikendica IN " + sql.toString());
        for (int i = 0; i < ids.size(); i++) {
            stm.setString(i + 1, ids.get(i));
        }

        ResultSet rs2 = stm.executeQuery();

        while (rs2.next()) {
            stm2.setString(1, rs2.getString("vikendica"));
            ResultSet rs3 = stm2.executeQuery();
            String naziv = "";
            if (rs3.next()) {
                naziv = rs3.getString("naziv");
            }

            int ocena = rs2.getInt("ocena");
            String komentar = rs2.getString("komentar"); 

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
                ocena,
                komentar
            );
            rezervacije.add(r);
        }

        return rezervacije;
    } catch (Exception e) {
        System.err.println(e);
    }
    return null;
}


    public int potvrdiRezervaciju(Rezervacija r) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT id FROM Vikendica WHERE naziv = ?");
            PreparedStatement stm1 = conn.prepareStatement(
                "UPDATE Rezervacija SET status = 'potvrdjeno' WHERE vikendica = ? AND datum_pocetka = ? AND datum_kraja = ? "
                );
        ){
            
            stm.setString(1, r.getVikendica());
            ResultSet rs1 = stm.executeQuery();
            String id = "";
            if (rs1.next()){
                id = rs1.getString("id");
            }
            stm1.setString(1, id);
            stm1.setString(2, r.getDatumPocetka());
            stm1.setString(3,r.getDatumKraja());

            return stm1.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int odbijRezervaciju(OdbijenaRezervacija r) {
        try(
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement("SELECT id FROM Vikendica WHERE naziv = ?");
            PreparedStatement stm1 = conn.prepareStatement(
                "UPDATE Rezervacija SET status = 'odbijeno' WHERE vikendica = ? AND datum_pocetka = ? AND datum_kraja = ? "
                );
            PreparedStatement stm2 = conn.prepareStatement(
                "SELECT id FROM rezervacija WHERE vikendica = ? AND datum_pocetka = ? AND datum_kraja = ?  "
                );
                PreparedStatement stm3 = conn.prepareStatement(
                "INSERT INTO komentar (rezervacija_id, tekst, korisnik) VALUES(?,?, ?)"
                );
        ){
            
            stm.setString(1, r.getRezervacija().getVikendica());
            ResultSet rs1 = stm.executeQuery();
            String id = "";
            if (rs1.next()){
                id = rs1.getString("id");
            }
            stm1.setString(1, id);
            stm1.setString(2, r.getRezervacija().getDatumPocetka());
            stm1.setString(3,r.getRezervacija().getDatumKraja());
            int updated = stm1.executeUpdate();
            System.out.println("Updated rows: " + updated);

            stm2.setString(1, id);
            stm2.setString(2, r.getRezervacija().getDatumPocetka());
            stm2.setString(3,r.getRezervacija().getDatumKraja());
            ResultSet rs2 = stm2.executeQuery();
            if (rs2.next()){
                id = rs2.getString("id");
            }

            stm3.setString(1, id);
            stm3.setString(2, r.getKomentar());
            stm3.setString(3, r.getRezervacija().getKorisnik());
            return stm3.executeUpdate();
        }catch(Exception e){
            System.err.println(e);
        }
        return -1;
    }

    public int updatePastRezervacije(String user) {
        try (
            Connection conn = DB.source().getConnection();
            PreparedStatement stm = conn.prepareStatement(
                "UPDATE Rezervacija " +
                "SET status = 'zavrseno' " +
                "WHERE korisnik = ? AND status = 'potvrdjeno' AND STR_TO_DATE(datum_kraja, '%Y-%m-%d') < CURDATE()"
            );
        ) {
            stm.setString(1, user);
            return stm.executeUpdate();
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }

    public int posaljiKomentarIOcenu(Rezervacija r) {
        try (
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement("SELECT id FROM vikendica WHERE naziv = ?");
            PreparedStatement stm2 = conn.prepareStatement(
                "UPDATE rezervacija SET ocena = ?, komentar = ? " +
                "WHERE vikendica = ? AND korisnik = ? AND datum_pocetka = ? AND datum_kraja = ?"
            );
        ) {
            stm1.setString(1, r.getVikendica());
            ResultSet rs = stm1.executeQuery();
            String vikendicaId = null;
            if (rs.next()) {
                vikendicaId = rs.getString("id");
            } else {
                return -1;
            }

            if (r.getOcena() == 0) {
                stm2.setNull(1, java.sql.Types.INTEGER);
            } else {
                stm2.setInt(1, r.getOcena());
            }

            if (r.getKomentar() == null || r.getKomentar().trim().isEmpty()) {
                stm2.setNull(2, java.sql.Types.VARCHAR);
            } else {
                stm2.setString(2, r.getKomentar());
            }

            stm2.setString(3, vikendicaId);
            stm2.setString(4, r.getKorisnik());
            stm2.setString(5, r.getDatumPocetka());
            stm2.setString(6, r.getDatumKraja());

            return stm2.executeUpdate();
        } catch (Exception e) {
            System.err.println(e);
        }
        return -1;
    }
    
    
    public int otkaziRez(Rezervacija r) {
        try (
            Connection conn = DB.source().getConnection();
            PreparedStatement stm1 = conn.prepareStatement("SELECT id FROM vikendica WHERE naziv = ?");
            PreparedStatement stm2 = conn.prepareStatement(
                "UPDATE rezervacija SET status = 'otkazano' " +
                "WHERE vikendica = ? AND korisnik = ? AND datum_pocetka = ? AND datum_kraja = ?"
            );
        ) {
            LocalDate currentDate = LocalDate.now();
    
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate startDate = LocalDate.parse(r.getDatumPocetka(), formatter);
    
            long daysDifference = ChronoUnit.DAYS.between(currentDate, startDate);
            if (daysDifference < 1) {
                return -1;
            }
    
            stm1.setString(1, r.getVikendica());
            ResultSet rs = stm1.executeQuery();
            String vikendicaId = null;
    
            if (rs.next()) {
                vikendicaId = rs.getString("id");
            } else {
                return -1; 
            }
    
            stm2.setString(1, vikendicaId);
            stm2.setString(2, r.getKorisnik());
            stm2.setString(3, r.getDatumPocetka());
            stm2.setString(4, r.getDatumKraja());
    
            return stm2.executeUpdate(); 
        } catch (Exception e) {
            System.err.println(e);
        }
    
        return -1;  
    }

    public int provjeriDatum(String datumPocetka, String datumKraja, String vikendicaNaziv) {
    try (
        Connection conn = DB.source().getConnection();
        PreparedStatement stm1 = conn.prepareStatement("SELECT id FROM vikendica WHERE naziv = ?");
        PreparedStatement stm2 = conn.prepareStatement(
            "SELECT COUNT(*) FROM rezervacija " +
            "WHERE vikendica = ? AND status = 'potvrdjeno' AND " +
            "NOT (datum_kraja < ? OR datum_pocetka > ?)"
        );
    ) {
        stm1.setString(1, vikendicaNaziv);
        ResultSet rs1 = stm1.executeQuery();

        if (!rs1.next()) {
            return -1;
        }

        String vikendicaId = rs1.getString("id");

        stm2.setString(1, vikendicaId);
        stm2.setString(2, datumPocetka);
        stm2.setString(3, datumKraja);

        ResultSet rs2 = stm2.executeQuery();
        if (rs2.next()) {
            int count = rs2.getInt(1);
            return (count > 0) ? -1 : 1;
        }

    } catch (Exception e) {
        System.err.println("Error in provjeriDatum: " + e);
    }

    return -1;
}

}
