package com.example.backend.models;

public class Rezervacija {
    
    private String vikendica = "";
    private String korisnik = "";
    private String datumPocetka = "";
    private String datumKraja = "";
    private int brojOdraslih = 0;
    private int brojDece = 0;
    private String opis = "";
    private int cena = 0;
    private String status = "";
    private String brojKartice = "";
    private String komentar = "";
    private int ocena = 0;

    
   public Rezervacija(String vikendica, String korisnik, String datumPocetka,
                   String datumKraja, int brojOdraslih, int brojDece,
                   String opis, int cena, String status, String brojKartice,
                   int ocena, String komentar) {
        this.vikendica = vikendica;
        this.korisnik = korisnik;
        this.datumPocetka = datumPocetka;
        this.datumKraja = datumKraja;
        this.brojOdraslih = brojOdraslih;
        this.brojDece = brojDece;
        this.opis = opis;
        this.cena = cena;
        this.status = status;
        this.brojKartice = brojKartice;
        this.ocena = ocena;
        this.komentar = komentar;
    }

    public String getVikendica() {
        return vikendica;
    }
    public void setVikendica(String vikendica) {
        this.vikendica = vikendica;
    }
    public String getKorisnik() {
        return korisnik;
    }
    public void setKorisnik(String korisnik) {
        this.korisnik = korisnik;
    }
    public String getDatumPocetka() {
        return datumPocetka;
    }
    public void setDatumPocetka(String datumPocetka) {
        this.datumPocetka = datumPocetka;
    }
    public String getDatumKraja() {
        return datumKraja;
    }
    public void setDatumKraja(String datumKraja) {
        this.datumKraja = datumKraja;
    }
    public int getBrojOdraslih() {
        return brojOdraslih;
    }
    public void setBrojOdraslih(int brojOdraslih) {
        this.brojOdraslih = brojOdraslih;
    }
    public int getBrojDece() {
        return brojDece;
    }
    public void setBrojDece(int brojDece) {
        this.brojDece = brojDece;
    }
    public String getOpis() {
        return opis;
    }
    public void setOpis(String opis) {
        this.opis = opis;
    }
    public int getCena() {
        return cena;
    }
    public void setCena(int cena) {
        this.cena = cena;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getBrojKartice() {
        return brojKartice;
    }
    public void setBrojKartice(String brojKartice) {
        this.brojKartice = brojKartice;
    }

    public String getKomentar() {
        return komentar;
    }
    public void setKomentar(String komentar) {
        this.komentar = komentar;
    }

    public int getOcena() {
        return ocena;
    }

    public void setOcena(int ocena) {
        this.ocena = ocena;
    }

    

}
