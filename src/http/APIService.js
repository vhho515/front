import axios from 'axios';
const API_URL =  'http://localhost:8000';

export class APIService {
  constructor() {

  }

  getPost(param_pk) {
    const url = `${API_URL}/api/post/${param_pk}`;
    let jwtToken = localStorage.getItem('token');
    console.log(":::jwtToken:::::"+jwtToken);
    const headers = {Authorization: `jwt ${jwtToken}`};
    return axios.get(url, {headers: {Authorization: `jwt ${jwtToken}`}});
  }

  getPostList() {
    const url = `${API_URL}/api/post/`;
    let jwtToken = localStorage.getItem('token');
    console.log(":::jwtToken:::::"+jwtToken);
    const headers = {Authorization: `jwt ${jwtToken}`};
    return axios.get(url, {headers: headers});

  }

  addNewPost(post){
    const url = `${API_URL}/api/post/`;
    let jwtToken = localStorage.getItem('token');
    const headers = {Authorization: `jwt ${jwtToken}`};
    return axios.post(url, post, {headers: headers});
  }

  updatePost(post){
    const url = `${API_URL}/api/post/${post.pk}`;
    let jwtToken = localStorage.getItem('token');
    const headers = {Authorization: `jwt ${jwtToken}`};
    return axios.put(url, post, {headers: headers});
  }

  deletePost(post_Pk){
    const url = `${API_URL}/api/post/${post_Pk}`;
    let jwtToken = localStorage.getItem('token');
    const headers = {Authorization: `jwt ${jwtToken}`};
    return axios.delete(url, {headers: headers});
  }

  authenticateLogin(credentials) {
    const url = `${API_URL}/auth/`;
    return axios.post(url, credentials);
  }
}
