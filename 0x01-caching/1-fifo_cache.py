#!/usr/bin/env python3
""" Module implements FIFOCache """


BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """ Implements the FIFOCache """
    def __init__(self):
        super().__init__()
        self.keyTrack = []

    def put(self, key, item):
        """ Assigns to the cache the item value for key """
        if key is not None and item is not None:
            self.cache_data[key] = item
            self.keyTrack.append(key) if key not in self.keyTrack else None
            if len(self.keyTrack) > BaseCaching.MAX_ITEMS:
                key_to_discard = self.keyTrack.pop(0)
                del self.cache_data[key_to_discard]
                print(f"DISCARD: {key_to_discard}")

    def get(self, key):
        """ Gets value of the given key """
        return self.cache_data.get(key)
