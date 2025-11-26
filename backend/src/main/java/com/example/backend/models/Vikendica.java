package com.example.backend.models;

public class Vikendica {
    private String vlasnik;
    private String naziv;
    private String mesto;
    private String usluge;
    private String telefon;
    private double x;
    private double y;
    private String [] slike;

    public Vikendica(String vlasnik, String naziv, String mesto, String usluge, String telefon, double x, double y, String[] slike) {
        this.vlasnik = vlasnik;
        this.naziv = naziv;
        this.mesto = mesto;
        this.usluge = usluge;
        this.telefon = telefon;
        this.x = x;
        this.y = y;
        this.slike = slike;
    }
    public String getVlasnik() {
        return vlasnik;
    }
    public void setVlasnik(String vlasnik) {
        this.vlasnik = vlasnik;
    }
    public String getNaziv() {
        return naziv;
    }
    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
    public String getMesto() {
        return mesto;
    }
    public void setMesto(String mesto) {
        this.mesto = mesto;
    }
    public String getUsluge() {
        return usluge;
    }
    public void setUsluge(String usluge) {
        this.usluge = usluge;
    }
    public String getTelefon() {
        return telefon;
    }
    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }
    public double getX() {
        return x;
    }
    public void setX(double x) {
        this.x = x;
    }
    public double getY() {
        return y;
    }
    public void setY(double y) {
        this.y = y;
    }
    public String[] getSlike() {
        return slike;
    }
    public void setSlike(String[] slike) {
        this.slike = slike;
    }


    
}
