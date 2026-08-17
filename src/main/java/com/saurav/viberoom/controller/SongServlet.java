package com.saurav.viberoom.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.saurav.viberoom.dao.SongDAO;
import com.saurav.viberoom.model.Song;

@WebServlet("/songs")
public class SongServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private SongDAO songDAO;

    @Override
    public void init() throws ServletException {
        songDAO = new SongDAO();
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        List<Song> songs = songDAO.fetchAllSongs();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        out.println("[");

        for (int i = 0; i < songs.size(); i++) {

            Song song = songs.get(i);

            out.print("{");
            out.print("\"id\":" + song.getId() + ",");
            out.print("\"title\":\"" + song.getTitle() + "\",");
            out.print("\"artist\":\"" + song.getArtist() + "\",");
            out.print("\"filePath\":\"" + song.getFilePath() + "\"");
            out.print("}");

            if (i < songs.size() - 1) {
                out.println(",");
            }
        }

        out.println("]");
    }
}