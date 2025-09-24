import axios from "axios"

export const ServerSide = axios.create({
  baseURL: "http://localhost:3000",
})