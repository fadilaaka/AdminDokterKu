import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAIThd451LLwy1Aka3lzqCdQ2WBCUvSjq8',
  authDomain: 'dokterku-9a6e8.firebaseapp.com',
  projectId: 'dokterku-9a6e8',
  storageBucket: 'dokterku-9a6e8.appspot.com',
  messagingSenderId: '168233228125',
  appId: '1:168233228125:web:6b24504e6f814ccc0f3ab4',
  databaseURL:
    'https://dokterku-9a6e8-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export {auth, database};
