const NodeCache = require("node-cache");
const cache = new NodeCache();
// Function to retrieve or generate data and cache it in-memory
async function getCachedData(key) {
  // Check if the data is in the in-memory cache
  const inMemoryData = cache.get(key);
  if (inMemoryData !== undefined) {
    console.log("Cache hit (in-memory):", key);
    return inMemoryData;
  }
  return null;
}

async function setCacheData(key, fetchedData, expiration) {
  // If data is fetched, cache it in-memory for future use
  cache.set(key, fetchedData, expiration);
  console.log("Cache miss (in-memory):", key);
  return fetchedData;
}
module.exports = { getCachedData, setCacheData };
