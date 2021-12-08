import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import {ReactFacebookFailureResponse, ReactFacebookLoginInfo} from "./types/facebook";

import { Vacations } from 'src/pages/vacations';
import { ReactFacebookLogin } from 'src/components/react-facebook-login'

import Logo from './assets/img/logo.png';

import './App.css';

export const Home: React.FC = () => {
  const handleFacebookLogin = (responseFacebook: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    fetch('/auth/facebook/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(responseFacebook)
    }).then(res => {
      console.log('responseFacebook', res)
    })
  }

  return (
    <div>
      <h2>Добро пожаловать на Meadowlark Travel</h2>
      <p>Посетите страницу "<Link to="/about">О нас</Link>"!</p>
      <p>Посетите страницу "<Link to="/vacation">Отпуск</Link>"!</p>
      <ReactFacebookLogin
        appId='160891822881828'
        callback={handleFacebookLogin}
        render={(props) => {
          return <button onClick={props.onClick}>this custom FB button</button>
        }}
      />
    </div>
  )
};

export const About: React.FC = () => {
  return (<i>Скоро появится</i>)
}

export const NotFound: React.FC = () => {
  return (<i>Не найдено</i>)
}

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Meadowlark Travel</h1>
          <Link to="/"><img src={Logo} alt="Логотип Meadowlark Travel" /></Link>
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route path="/vacation" component={Vacations} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
