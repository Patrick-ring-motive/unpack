# Stash Class Usage

The `Stash` class provides a unified caching interface using the Cache API across different extension contexts.

## Architecture

### Service Worker (Background)
- **Implementation**: Real Stash instance with direct Cache API access
- **File**: `background/stash-bundle.js`
- **Access**: Direct via `globalThis.stash` or `stash` variable

### Content Scripts
- **Implementation**: StashProxy that forwards requests to service worker
- **Communication**: Chrome message passing API
- **Access**: Transparent via `globalThis.stash` or `stash` variable

### Options Page
- **Implementation**: Real Stash instance with direct Cache API access
- **File**: Imported from `lib/Stash.js`
- **Access**: Direct via `globalThis.stash` or `stash` variable

## API

All contexts use the same API:

### `stash.get(key)`
Get a value from the cache.

```javascript
const value = await stash.get('myKey');
console.log(value);
```

### `stash.set(key, value)`
Store a value in the cache.

```javascript
await stash.set('myKey', { foo: 'bar', count: 42 });
```

### `stash.delete(key)`
Remove a value from the cache.

```javascript
await stash.delete('myKey');
```

## Examples

### From Service Worker Code
```javascript
// Direct access - runs in service worker context
await stash.set('user', { id: 123, name: 'John' });
const user = await stash.get('user');
console.log(user.name); // 'John'
```

### From Content Script Code
```javascript
// Proxied through message passing - transparent to user
await stash.set('pageData', { url: location.href, title: document.title });
const data = await stash.get('pageData');
console.log(data.title);
```

### From Options Page Code
```javascript
// Direct access - runs in options page context
await stash.set('settings', { theme: 'dark', lang: 'en' });
const settings = await stash.get('settings');
```

## Notes

- All values are automatically JSON serialized/deserialized
- Default TTL is 1 year (31535000 seconds)
- Content scripts communicate with service worker via message passing
- Service worker and options page have direct Cache API access
- All operations are asynchronous and return Promises
