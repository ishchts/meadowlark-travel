import {Application} from "express";
import passport from "passport";
import {Strategy as FacebookStrategy} from "passport-facebook";

import { db } from '../db';

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser((id: string, done) => {
  db.getUserById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
})

export type createAuthOptions = {
  providers: any,
  successRedirect: string,
  failureRedirect: string,
  baseUrl?: string,
}

export const createAuth = (app: Application, options: createAuthOptions) => {
  if (!options.successRedirect) {
    options.successRedirect = '/account';
  }

  if (!options.failureRedirect) {
    options.failureRedirect = '/login';
  }

  return {
    init: () => {
      const config = options.providers;

      passport.use(
        new FacebookStrategy({
          clientID: config.facebook.appId,
          clientSecret: config.facebook.appSecret,
          callbackURL: (options.baseUrl || '') + '/auth/facebook/callback',
        },
  (accessToken, refreshToken, profile, done) => {
          console.log('profile', profile)
          const authId = 'facebook:' + profile.id;
          db.getUserByAuthId(authId)
            .then((user) => {
              if (user) {
                return done(null, user)
              }

              db.addUser(({
                authId: authId,
                name: profile.displayName,
                created: new Date(),
                role: 'customer',
              }))
                .then(user => done(null, user))
                .catch(err => done(err, null))
            })
            .catch(err => {
              if(err) return done(err, null);
            })

          app.use(passport.initialize());
          app.use(passport.session());
        })
      )
    },
    registerRoutes: () => {
      app.post('/auth/facebook/login', (req, res, next) => {
        const authId = 'facebook:' + req.body.id

        db.getUserByAuthId(authId)
          .then((user) => {
            if (user) {
              return user
            }

            db.addUser({
              authId,
              name: req.body.name,
              created: new Date(),
              role: 'customer',
            }).then((user) => {
              console.log('user', user)
            }).catch((err) => {
              console.log('err', err)
            })
          })
          .catch((err) => {
            console.log('err', err)
          })
        res.json({ qwe: '??????????????'})
      })

      app.get('/auth/facebook', (req, res, next) => {
        if(req.query.redirect) {
          // req.session.authRedirect = req.query.redirect
        }
        passport.authenticate('facebook')(req, res, next)
      })

      app.get('/auth/facebook/callback', passport.authenticate('facebook',
        { failureRedirect: options.failureRedirect }),
        (req, res) => {
          console.log('???? ???????? ???????????????? ???????????? ?????? ???????????????? ????????????????????????????.');
          // ???? ???????? ???????????????? ???????????? ?????? ???????????????? ????????????????????????????.
          /*
          const redirect = req.session.authRedirect
          if(redirect) {
            delete req.session.authRedirect
          }
          res.redirect(303, redirect || options.successRedirect)
           */
          res.redirect(303, options.successRedirect)
        }
      )
    },
  }
}