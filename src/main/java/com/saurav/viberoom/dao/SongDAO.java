package com.saurav.viberoom.dao;

import java.util.List;

import com.saurav.viberoom.model.Song;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class SongDAO {

    private EntityManagerFactory emf;

    public SongDAO() {
        emf = Persistence.createEntityManagerFactory("viberoom");
    }

    public List<Song> fetchAllSongs() {

        EntityManager em = emf.createEntityManager();

        List<Song> songs = em
                .createQuery("SELECT s FROM Song s", Song.class)
                .getResultList();

        em.close();

        return songs;
    }
}