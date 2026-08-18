package com.saurav.viberoom.dao;

import java.util.List;

import com.saurav.viberoom.model.Favorite;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class FavoriteDAO {

    private EntityManagerFactory emf;

    public FavoriteDAO() {
        emf = Persistence.createEntityManagerFactory("viberoom");
    }

    public void addFavorite(int songId) {

        EntityManager em = emf.createEntityManager();

        try {
            Favorite favorite = new Favorite(songId);

            em.getTransaction().begin();

            em.persist(favorite);

            em.getTransaction().commit();

        } finally {
            em.close();
        }
    }

    public void removeFavorite(int songId) {

        EntityManager em = emf.createEntityManager();

        try {
            em.getTransaction().begin();

            List<Favorite> favorites = em.createQuery(
                    "SELECT f FROM Favorite f WHERE f.songId = :songId",
                    Favorite.class
            )
            .setParameter("songId", songId)
            .getResultList();

            for (Favorite favorite : favorites) {
                em.remove(favorite);
            }

            em.getTransaction().commit();

        } finally {
            em.close();
        }
    }

    public List<Favorite> getAllFavorites() {

        EntityManager em = emf.createEntityManager();

        try {
            return em.createQuery(
                    "SELECT f FROM Favorite f",
                    Favorite.class
            ).getResultList();

        } finally {
            em.close();
        }
    }
}