import axios from "axios";

const API = axios.create({ 
    baseURL: 'https://amberflux-assignment-isat.onrender.com' 
});

export default API;
