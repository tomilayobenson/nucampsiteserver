const express = require('express')
const cors = require('./cors')
const authenticate = require('../authenticate')
const Favorite = require('../models/favorite')
const Campsite = require('../models/campsite')
const favoriteRouter = express.Router()

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            })
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(campsiteId => {
                        if (!favorite.campsites.includes(campsiteId._id)) {
                            favorite.campsites = [...favorite.campsites, campsiteId._id]
                        }
                    });
                    favorite.save()
                        .then(fav => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => next(err))
                } else {
                    const campsitesArr = req.body.map(campsiteObj => campsiteObj._id)
                    Favorite.create({ user: req.user._id, campsites: campsitesArr })
                        .then(fav => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => next(err))
                }
            })
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(response => {
                if (response) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(response)
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.end('You do not have any favorites to delete.')
                }
            })
            .catch(err => next(err))
    })

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`)
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // Campsite.findOne({ _id: req.params.campsiteId })
        //     .then(campsite => {
        //         if (!campsite) {
        //             res.statusCode = 200
        //             res.setHeader('Content-Type', 'text/plain')
        //             return res.end(`There is no such campsite with id of ${req.params.campsiteId}`)
        //         }
        //     })
        //     .catch(err => next(err))
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save()
                            .then(fav => {
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json(fav)
                            })
                            .catch(err => next(err))
                    } else {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/plain')
                        res.end("That campsite is already in the list of favorites!")
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                        .then(fav => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                           res.json(fav)
                        })
                        .catch(err => next(err))
                }
            })
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    favorite.campsites = favorite.campsites.filter(fav => !fav.equals(req.params.campsiteId))
                    favorite.save()
                        .then(
                            fav => {
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json(fav)
                            }
                        )
                        .catch(err => next(err))
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.end('You do not have any favorites to delete.')
                }
            })
            .catch(err => next(err))
    })

module.exports = favoriteRouter