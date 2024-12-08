import axios from "axios";

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: "http://localhost:3002/api",
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