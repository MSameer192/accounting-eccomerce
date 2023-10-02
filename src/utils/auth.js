// auth.js

export function setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
  
  export function getAuthToken() {
    return localStorage.getItem('token');
  }
  