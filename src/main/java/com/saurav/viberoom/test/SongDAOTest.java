package com.saurav.viberoom.test;

import java.util.List;

import com.saurav.viberoom.dao.SongDAO;
import com.saurav.viberoom.model.Song;

public class SongDAOTest {

    public static void main(String[] args) {

        SongDAO dao = new SongDAO();

        List<Song> songs = dao.fetchAllSongs();

        for (Song song : songs) {
            System.out.println(song);
        }
    }
}