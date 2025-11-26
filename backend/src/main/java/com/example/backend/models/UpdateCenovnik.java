package com.example.backend.models;

public class UpdateCenovnik {
    private Cenovnik cenovnik;
    private String field;
    private int newVal;


    public UpdateCenovnik(Cenovnik cenovnik, String field, int newVal) {
        this.cenovnik = cenovnik;
        this.field = field;
        this.newVal = newVal;
    }
    public Cenovnik getCenovnik() {
        return cenovnik;
    }
    public void setCenovnik(Cenovnik cenovnik) {
        this.cenovnik = cenovnik;
    }
    public String getField() {
        return field;
    }
    public void setField(String field) {
        this.field = field;
    }
    public int getNewVal() {
        return newVal;
    }
    public void setNewVal(int newVal) {
        this.newVal = newVal;
    }

    
}
