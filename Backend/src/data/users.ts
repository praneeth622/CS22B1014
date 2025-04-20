import { api } from "../services/api";
import cache from "../services/cache";

export const getUsers = async () => {
  const cacheKey = "users";
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  const res = await api.get("/users");
  const users = res.data.users;
  
  cache.set(cacheKey, users);
  return users;
};
