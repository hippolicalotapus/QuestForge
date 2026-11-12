// Small in-memory rate limiter for a future private feedback endpoint.
// This is process-local and is NOT sufficient for a distributed public service.
function createRateLimiter({limit=5,windowMs=60_000,now=()=>Date.now()}={}) {
  if(!Number.isSafeInteger(limit)||limit<1||!Number.isSafeInteger(windowMs)||windowMs<1) throw new RangeError('Invalid rate-limit configuration');
  const buckets=new Map();
  return function check(key) {
    if(typeof key!=='string'||key.length<1||key.length>256) return {allowed:false,retryAfterMs:windowMs};
    const time=now();
    if(!Number.isFinite(time)) return {allowed:false,retryAfterMs:windowMs};
    const current=buckets.get(key);
    if(!current||time-current.start>=windowMs||time<current.start){buckets.set(key,{start:time,count:1});return {allowed:true,retryAfterMs:0};}
    if(current.count>=limit) return {allowed:false,retryAfterMs:Math.max(1,windowMs-(time-current.start))};
    current.count++;
    return {allowed:true,retryAfterMs:0};
  };
}
export {createRateLimiter};
