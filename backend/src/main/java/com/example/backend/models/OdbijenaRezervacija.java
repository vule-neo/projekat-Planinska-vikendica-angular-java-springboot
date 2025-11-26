package com.example.backend.models;

public class OdbijenaRezervacija {
    private Rezervacija rezervacija;
    private String komentar;

    
    public OdbijenaRezervacija(Rezervacija rezervacija, String komentar) {
        this.rezervacija = rezervacija;
        this.komentar = komentar;
    }
    public Rezervacija getRezervacija() {
        return rezervacija;
    }
    public void setRezervacija(Rezervacija rezervacija) {
        this.rezervacija = rezervacija;
    }
    public String getKomentar() {
        return komentar;
    }
    public void setKomentar(String komentar) {
        this.komentar = komentar;
    }

    
}
