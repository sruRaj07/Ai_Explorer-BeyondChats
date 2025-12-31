import axios from "axios";
import { ENV } from "../config/env.js";

export async function saveArticle(article) {
  return axios.post(`${ENV.LARAVEL_API}/articles`, article);
}