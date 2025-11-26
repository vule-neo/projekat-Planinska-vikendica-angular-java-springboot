package com.example.backend.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.db.dao.VikendicaRepo;
import com.example.backend.models.Cenovnik;
import com.example.backend.models.DodajVikendicu;
import com.example.backend.models.Rezervacija;
import com.example.backend.models.UpdateCenovnik;
import com.example.backend.models.Vikendica;

@RestController
@RequestMapping("/vikendica")
@CrossOrigin(origins = "http://localhost:4200")
public class VikendicaController {
    @PostMapping("/dodajVikendicu")
    public int dodajVikendicu(@RequestBody DodajVikendicu dvr) {
        return new VikendicaRepo().dodajVikendicu(dvr);
    }

    @PostMapping("/mojeVikendice")
    public ArrayList<String> mojeVikendice(@RequestBody String username) {
        return new VikendicaRepo().mojeVikendice(username);
    }

    @PostMapping("/updateVikendica")
    public int updateVikendica(@RequestBody String[] info) {
        return new VikendicaRepo().updateVikendica(info);
    }

    @PostMapping("/deleteVikendica")
    public int deleteVikendica(@RequestBody String naziv) {
        return new VikendicaRepo().deleteVikendica(naziv);
    }

    @PostMapping("/getAllInfo")
    public Vikendica getAllInfo(@RequestBody String naziv) {
        return new VikendicaRepo().getAllInfo(naziv);
    }

    @PostMapping("/getAllSlike")
    public ArrayList<String> getAllSlike(@RequestBody String naziv) {
        return new VikendicaRepo().getAllSlike(naziv);
    }

    @PostMapping("/getAllCenovnici")
    public ArrayList<Cenovnik> getAllCenovnici(@RequestBody String naziv) {
        return new VikendicaRepo().getAllCenovnici(naziv);
    }

    @PostMapping("/deleteSlika")
    public int deleteSlika(@RequestBody String[] info) {
        return new VikendicaRepo().deleteSlika(info);
    }

    @PostMapping("/uploadImage")
    public int uploadImage(@RequestBody String[] info) {
        return new VikendicaRepo().uploadImage(info);
    }


    @PostMapping("/updateCenovnik")
    public int updateCenovnik(@RequestBody UpdateCenovnik uc) {
        return new VikendicaRepo().updateCenovnik(uc);
    }

    @PostMapping("/dodajCenovnik")
    public int dodajCenovnik(@RequestBody Cenovnik c) {
        return new VikendicaRepo().dodajCenovnik(c);
    }

    @GetMapping("/numVikendica")
    public int numVikendica() {
        return new VikendicaRepo().numVikendica();
    }

    @GetMapping("/getAllVikendice")
    public ArrayList<Vikendica> getAllVikendice() {
        return new VikendicaRepo().getAllVikendice();
    }

    @PostMapping("/racunajCijenu")
    public int racunajCijenu(@RequestBody Rezervacija r) {
        return new VikendicaRepo().racunajCijenu(r);
    }

    @GetMapping("/numVikendicaUPeriodu/{brDana}")
    public int numVikendicaUPeriodu(@PathVariable int brDana) {
        return new VikendicaRepo().numVikendicaUPeriodu(brDana);
    }

    @GetMapping("/prosecnaOcena/{naziv}")
    public double prosecnaOcena(@PathVariable String naziv) {
        return new VikendicaRepo().prosecnaOcena(naziv);
    }

    @GetMapping("/getAllRezervacije/{naziv}")
    public ArrayList<Rezervacija> getAllRezervacije(@PathVariable String naziv) {
        return new VikendicaRepo().getAllRezervacije(naziv);
    }

    

}
