package com.saurav.viberoom.test;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class HibernateTest {

    public static void main(String[] args) {

        EntityManagerFactory emf =
                Persistence.createEntityManagerFactory("viberoom");

        EntityManager em = emf.createEntityManager();

        System.out.println("Hibernate connected successfully!");

        em.close();
        emf.close();
    }
}