import axios from "axios";

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: "https://webway.click/api",
    // baseURL: "http://localhost:3002/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json"
    }
  });

  return {
    provide: {
      axios: instance
    }
  };
});