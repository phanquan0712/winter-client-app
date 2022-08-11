import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageRender from './customRoute/PageRender';
import Login from './pages/login';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from './utils/Typescript';
import Home from './pages/home';
import Alert from './components/alert/Alert';
import Header from './components/Header/Header';
import { refreshToken } from './redux/action/authAction';
import Register from './pages/register';
import StatusModal from './components/home/StatusModal';
import { getPost } from './redux/action/postAction';
import CommentDisplay from './components/home/CommentDisplay';
import { OPEN_MODAL_COMMENT } from './redux/types/commentType';
import { GET_DETAIL_POST } from './redux/types/postType';
import { getSuggestionUser } from './redux/action/suggestionUserAction';
import io from 'socket.io-client';
import { SOCKET } from './redux/types/socketType';
import SocketClient from './SocketClient';
import { getNotifies } from './redux/action/notifyAction';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs';
import { PEER } from './redux/types/peerType';
import { API_URL } from './utils/config';


function App() {
  const dispatch = useDispatch();
  const { auth, status, comments, homePost, discoverPost, detailPost, profile, call  } = useSelector((state: RootStore) => state);


  useEffect(() => {
    dispatch(refreshToken());
    const socket = io(API_URL)
    dispatch({ type: SOCKET, payload: socket })
    return () => {socket.close()}
  }, [dispatch])


  useEffect(() => { 
    if (auth.access_token) {
      dispatch(getPost(auth.access_token, 1));
      dispatch(getSuggestionUser(auth.access_token));
    }
  }, [dispatch, auth.access_token])


  useEffect(() => {
    if(auth.access_token) {
      dispatch(getNotifies(auth.access_token));
    }
  }, [auth.access_token, dispatch])

  useEffect(() => {
    if (comments.isOpen) {
      const allPosts = [...homePost.posts, ...discoverPost.posts, ...profile.posts, detailPost];
      const newPost = allPosts.find(post => post._id === comments.post._id)
      if(newPost) {
        dispatch({ type: OPEN_MODAL_COMMENT, payload: { ...comments, post: newPost } })
      }
    }
  }, [dispatch, homePost.posts, discoverPost.posts, comments.isOpen, profile.posts, detailPost])

  useEffect(() => {
    const allPosts = [...homePost.posts, ...discoverPost.posts, ...profile.posts, detailPost];
    const newPost = allPosts.find(post => post._id === detailPost._id)
    if (newPost)
      dispatch({ type: GET_DETAIL_POST, payload: newPost })
  }, [dispatch, homePost.posts, discoverPost.posts])


  useEffect(() => {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }
      else if (Notification.permission === "granted") {}
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {}
        });
      }
  }, [])

  useEffect(() => {
    const newPeer = new Peer(undefined as any, {
      path: '/', secure: true
    })
    dispatch({ type: PEER, payload: newPeer })
  }, [dispatch])

  return (
    <Router>
      <Alert />
      <input type="checkbox" id='theme' style={{ display: 'none' }} />
      <div className="App"
      >
        <div className='main'>
          {auth.access_token &&
            <div className='header-config'>
              <Header />
            </div>
          }
          {status.status && <StatusModal />}
          {comments.isOpen && <CommentDisplay comments={comments} />}
          { auth.access_token && <SocketClient />}
          { call.isOpen && <CallModal />}
          <Routes>
            <Route path="/" element={auth.access_token ? <Home /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/:page' element={<PageRender />} />
            <Route path='/:page/:id' element={<PageRender />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
