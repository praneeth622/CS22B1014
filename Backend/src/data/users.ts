import { api, getCachedUsers } from "../services/api";
import cache from "../services/cache";

export const getUsers = async () => {
  // First check if we have it in cache
  const cachedUsers = getCachedUsers();
  if (cachedUsers) {
    return cachedUsers;
  }
  
  // If not in cache, fetch from API
  try {
    const res = await api.get("/users");
    const users = res.data.users;
    
    // Cache for future use
    cache.set('all_users', users);
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
