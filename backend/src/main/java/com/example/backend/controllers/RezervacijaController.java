package com.example.backend.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.db.dao.RezervacijaRepo;
import com.example.backend.models.OdbijenaRezervacija;
import com.example.backend.models.Rezervacija;

@RestController
@RequestMapping("/rezervacija")
@CrossOrigin(origins = "http://localhost:4200")
public class RezervacijaController {
    @PostMapping("/dodajRezervaciju")
    public int dodajRezervaciju(@RequestBody Rezervacija r) {
        return new RezervacijaRepo().dodajRezervaciju(r);
    }

    @PostMapping("/mojeRezervacije")
    public ArrayList<Rezervacija> mojeRezervacije(@RequestBody String user) {
        return new RezervacijaRepo().mojeRezervacije(user);
    }

    @PostMapping("/rezervacijeVlasnik")
    public ArrayList<Rezervacija> rezervacijeVlasnik(@RequestBody String user) {
        return new RezervacijaRepo().rezervacijeVlasnik(user);
    }

    @PostMapping("/odbijRezervaciju")
    public int odbijRezervaciju(@RequestBody OdbijenaRezervacija or) {
        return new RezervacijaRepo().odbijRezervaciju(or);
    }

    @PostMapping("/potvrdiRezervaciju")
    public int potvrdiRezervaciju(@RequestBody Rezervacija r) {
        return new RezervacijaRepo().potvrdiRezervaciju(r);
    }

    @PostMapping("/updatePastRezervacije")
    public int updatePastRezervacije(@RequestBody String u) {
        return new RezervacijaRepo().updatePastRezervacije(u);
    }

    @PostMapping("/posaljiKomentarIOcenu")
    public int posaljiKomentarIOcenu(@RequestBody Rezervacija u) {
        return new RezervacijaRepo().posaljiKomentarIOcenu(u);
    }

    @PostMapping("/otkaziRez")
    public int otkaziRez(@RequestBody Rezervacija u) {
        return new RezervacijaRepo().otkaziRez(u);
    }

    @GetMapping("/provjeriDatum/{datumPocetka}/{datumKraja}/{vikendica}")
    public int provjeriDatum(@PathVariable String datumPocetka, @PathVariable String datumKraja,@PathVariable String vikendica) {
        return new RezervacijaRepo().provjeriDatum(datumPocetka, datumKraja, vikendica);
    }
}
