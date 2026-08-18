package com.saurav.viberoom.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saurav.viberoom.dao.FavoriteDAO;
import com.saurav.viberoom.model.Favorite;

@WebServlet("/favorites")
public class FavoriteServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private FavoriteDAO favoriteDAO;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {

        favoriteDAO = new FavoriteDAO();
        objectMapper = new ObjectMapper();
    }

    // GET /favorites
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        List<Favorite> favorites =
                favoriteDAO.getAllFavorites();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(
                response.getWriter(),
                favorites
        );
    }

    // POST /favorites?songId=1
    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String songIdParameter =
                request.getParameter("songId");

        if (songIdParameter == null) {

            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "songId is required"
            );

            return;
        }

        int songId =
                Integer.parseInt(songIdParameter);

        favoriteDAO.addFavorite(songId);

        response.setStatus(
                HttpServletResponse.SC_CREATED
        );
    }

    // DELETE /favorites?songId=1
    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String songIdParameter =
                request.getParameter("songId");

        if (songIdParameter == null) {

            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "songId is required"
            );

            return;
        }

        int songId =
                Integer.parseInt(songIdParameter);

        favoriteDAO.removeFavorite(songId);

        response.setStatus(
                HttpServletResponse.SC_NO_CONTENT
        );
    }
}