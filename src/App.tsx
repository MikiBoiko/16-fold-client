/* React */
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonContent, IonHeader, IonProgressBar, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Components */
import Navbar from './components/Navbar';

/* Pages */
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';

/* Context */
import appContext, { Challenge, GameType } from './context/appContext';
import Logo from './components/Logo';
import { Center } from './components/Center';

/* Storage */
import { Storage } from '@ionic/storage';

/* Client connections */
import axios from 'axios';
import Profile from './pages/Profile';
import { HTTP_URL, USER_URL, WS_URL } from './socket';
import { Socket, connect, io } from 'socket.io-client';
import LoadingScreen from './components/LoadingScreen';

const store = new Storage();
await store.create();

setupIonicReact();

const App: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [user, setUser] = useState<{ username: string, publicToken: string }>()
  const [socket, setSocket] = useState<Socket>()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [games, setGames] = useState<GameType[]>([])

  const onAccess = useCallback((token: string | null) => {
    if (token === null) {
      store.remove('token').then(() => {
        setLoaded(true)
        setUser(undefined)
        socket?.disconnect()
      })
      return
    }

    store.set('token', token)
    axios.post(`${HTTP_URL}/access`, { token }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
      .then((response: any) => {
        const { user, publicToken } = response.data
        setUser({
          ...user,
          publicToken
        })
        setLoaded(true)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [setUser, store, socket])

  useEffect(() => {
    store.get('token')
      .then((token: string) => {
        if (token === null) {
          setLoaded(true)
        }
        else onAccess(token)
      })
  }, [])


  const isLogged = user !== undefined

  const addNewChallenge = useCallback((challenge: Challenge) => {
    setChallenges((challenges) => [
      ...challenges,
      challenge
    ])
  }, [setChallenges])

  const cancelChallenge = useCallback((index: number) => {
    console.log('cancel')
    setChallenges((challenges) => {
      const newChallenges = [...challenges]
      newChallenges.splice(index, 1)
      return newChallenges
    })
  }, [setChallenges])

  const updateGames = useCallback((games: GameType[]) => {
    setGames(games)
  }, [setGames])

  const addNewGame = useCallback((game: GameType) => {
    setGames((games: GameType[]) => [
      ...games,
      game
    ])
  }, [setGames])

  useEffect(() => {
    if (isLogged !== true) return

    const socket = io(USER_URL, { withCredentials: true, autoConnect: false, auth: { token: user.publicToken } })

    socket.connect()

    function onConnect() {
      console.log('connected')
    }

    function onNewChallenge(challenge: Challenge) {
      addNewChallenge(challenge)
    }

    function onChallengeCancelled(index: number) {
      cancelChallenge(index)
    }

    function onFetchGames(games: GameType[]) {
      console.log('fetch games')
      console.log(games)
      updateGames(games)
    }

    function onNewGame(newGame: any) {
      addNewGame(newGame)
    }

    socket.on('connect', onConnect)
    socket.on('new-challenge', onNewChallenge)
    socket.on('challenge-cancelled', onChallengeCancelled)
    socket.on('fetch-games', onFetchGames)
    socket.on('new-game', onNewGame)

    setSocket(socket)

    return () => {
      socket.off('connect', onConnect)
      socket.off('new-challenge', onNewChallenge)
      socket.off('challenge-cancelled', onChallengeCancelled)
      socket.off('fetch-games', onFetchGames)
      socket.off('new-game', onNewGame)

      setSocket(undefined)
    }
  }, [isLogged])

  return (
    <appContext.Provider
      value={{
        user,
        onAccess,
        socket,
        challenges,
        games
      }}
    >
      {
        (loaded === false)
          ? <LoadingScreen />
          : (
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/login">
                  {
                    isLogged === true
                      ? <Redirect to="/home" />
                      : <Login />
                  }

                </Route>
                <Route path="/register">
                  {
                    isLogged === true
                      ? <Redirect to="/home" />
                      : <Register />
                  }

                </Route>
                <Route exact path="/">
                  {
                    isLogged === true
                      ? <Redirect to="/home" />
                      : <Redirect to="/login" />
                  }
                </Route>
                <Route path="/game/:tag">
                  {
                    isLogged === true
                      ? <Navbar title="Game" children={<Game />} />
                      : <Redirect to="/login" />
                  }
                </Route>
                <Route exact path="/home">
                  {
                    isLogged === true
                      ? <Navbar title='Home' children={<Home />} />
                      : <Redirect to="/login" />
                  }
                </Route>
                <Route exact path="/profile/:of">
                  {
                    isLogged === true
                      ? <Navbar title="Profile" children={<Profile />} />
                      : <Redirect to="/login" />
                  }
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          )
      }
    </appContext.Provider>
  )
}

export default App