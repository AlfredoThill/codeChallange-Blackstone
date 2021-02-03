// # Straighforward cache stuff on server side
let cache = { 'date': 0 };
let check_cache = async function checkCache(input,callback,args) {
    let cursor = null
    let one_day = 1000*60*60*24;
    let stored_by = cache['date'] - new Date;
    // check if the input has been calaculated already and stored in cache
    if(cache[input] && stored_by < one_day) {
      console.log('Brought from cache')
      return cache[input] // return the result in the cache
    }
    // if not do the operation and store the result
    else {
      cursor = await callback.apply(this, args);
      console.log('Brought from Atlas')
      cache[input] = cursor; // store the result with the input as key
      cache['date'] = new Date; // store the result with the input as key
    }
    return cursor
}

module.exports = {
  check: check_cache,
  bring: cache,
}