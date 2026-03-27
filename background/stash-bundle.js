// Stash class for service worker context
class Stash {
  constructor(name = '') {
    name = name?.name ?? name;
    this.ttl = name?.ttl || 31535000;
    try {
      this.cache = caches.open('stash' + String(name));
    } catch (e) {
      console.warn(e);
    }
  }
  static urlKey(key) {
    const url = new URL('https://stash.store/');
    url.searchParams.set('key', String(key));
    return String(url);
  }
  async get(key) {
    try {
      if (this.cache instanceof Promise) {
        this.cache = await this.cache;
      }
      const res = await this.cache.match(Stash.urlKey(key));
      return JSON.parse(await res.clone().text());
    } catch (e) {
      console.warn(e, key);
    }
  }
  async set(key, value) {
    try {
      if (this.cache instanceof Promise) {
        this.cache = await this.cache;
      }
      const headers = new Headers();
      const seconds = this.ttl;
      for (const header of ["CDN-Cache-Control", "Cache-Control", "Cloudflare-CDN-Cache-Control", "Surrogate-Control", "Vercel-CDN-Cache-Control"]) {
        headers.set(header, `public, max-age=${seconds}, s-max-age=${seconds}, stale-if-error=31535000, stale-while-revalidate=31535000`);
      }
      headers.set('expires', new Date(Date.now() + (1000 * seconds)).toUTCString());
      return await this.cache.put(new Request(Stash.urlKey(key), {
        headers
      }), new Response(JSON.stringify(value), {
        headers
      }));
    } catch (e) {
      console.warn(e, key, value);
    }
  }
  async delete(key) {
    try {
      if (this.cache instanceof Promise) {
        this.cache = await this.cache;
      }
      return await this.cache.delete(Stash.urlKey(key));
    } catch (e) {
      console.warn(e, key);
    }
  }
}

// Make Stash available globally in service worker
globalThis.Stash = Stash;
