import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import themeReducer from './themeReducer';
import userReducer from './profileReducer';
import statusReducer from './statusReducer';
import postReducer from './postReducer';
import commentReducer from './commentReducer';
import answerComment from './AnswerComment';
import detailPostReducer from './detailPostReducer';
import discoverReducer from './discoverReducer';
import suggestionUserReducer from './suggestionUserReducer';
import socketReducer from './socketReducer';
import notifyReducer from './notifyReducer';
import messageReducer from './messageReducer';
import onlineReducer from './onlineReducer';
import callReducer from './callReducer';
import peerReducer from './peerReducer';
export default combineReducers({
   auth: authReducer,
   alert: alertReducer,
   theme: themeReducer,
   profile: userReducer,
   status: statusReducer,
   homePost: postReducer,
   comments: commentReducer,
   answerComment: answerComment,
   detailPost: detailPostReducer,
   discoverPost: discoverReducer,
   suggestionUser: suggestionUserReducer,
   socket: socketReducer,
   notify: notifyReducer,
   message: messageReducer,
   online:  onlineReducer,
   call: callReducer,
   peer: peerReducer,
})