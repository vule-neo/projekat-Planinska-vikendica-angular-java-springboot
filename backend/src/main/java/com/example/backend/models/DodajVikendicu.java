package com.example.backend.models;

public class DodajVikendicu {
    private Cenovnik[] cenovnici;
    private Vikendica vikendica;

    

    public DodajVikendicu(Cenovnik[] cenovnici, Vikendica vikendica) {
        this.cenovnici = cenovnici;
        this.vikendica = vikendica;
    }
    public Cenovnik[] getCenovnici() {
        return cenovnici;
    }
    public void setCenovnici(Cenovnik[] cenovnici) {
        this.cenovnici = cenovnici;
    }
    public Vikendica getVikendica() {
        return vikendica;
    }
    public void setVikendica(Vikendica vikendica) {
        this.vikendica = vikendica;
    }
    


}
