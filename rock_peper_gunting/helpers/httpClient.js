import axios from "axios"

export const ServerSide = axios.create({
  baseURL: "https://rps.ikaros.web.id",
})