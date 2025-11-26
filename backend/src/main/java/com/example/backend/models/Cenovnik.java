package com.example.backend.models;

public class Cenovnik {
    private String vikendica;
    private double cena;
    private int od;
    private int doo;

    

    public Cenovnik(String vikendica, double cena, int od, int doo) {
        this.vikendica = vikendica;
        this.cena = cena;
        this.od = od;
        this.doo = doo;
    }
    public String getVikendica() {
        return vikendica;
    }
    public void setVikendica(String vikendica) {
        this.vikendica = vikendica;
    }
    public double getCena() {
        return cena;
    }
    public void setCena(double cena) {
        this.cena = cena;
    }
    public int getOd() {
        return od;
    }
    public void setOd(int od) {
        this.od = od;
    }
    public int getDoo() {
        return doo;
    }
    public void setDoo(int doo) {
        this.doo = doo;
    }

    
}
