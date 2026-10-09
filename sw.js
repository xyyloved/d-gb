var C='snn-v7-2';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return c.addAll(['./','./index.html','./manifest.json']);
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){if(k!==C)return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(r){
    return r||fetch(e.request).then(function(res){
      var cp=res.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return res;
    }).catch(function(){return caches.match('./index.html');});
  }));
});
