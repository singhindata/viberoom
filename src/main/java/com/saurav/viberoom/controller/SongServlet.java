package com.saurav.viberoom.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saurav.viberoom.dao.SongDAO;
import com.saurav.viberoom.model.Song;

@WebServlet("/songs")
public class SongServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private SongDAO songDAO;

    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {

        songDAO = new SongDAO();

        objectMapper = new ObjectMapper();
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        List<Song> songs = songDAO.fetchAllSongs();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(
                response.getWriter(),
                songs
        );
    }
}