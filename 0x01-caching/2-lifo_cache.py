#!/usr/bin/env python3
""" Module implements LIFOCache"""


BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """ Implements a LIFOCache """
    def __init__(self):
        super().__init__()
        self.stack = []

    def put(self, key, item):
        """Assign to the cache the item value for the LIFOCache key """
        if key is not None and item is not None:
            self.cache_data[key] = item
            self.stack.append(key) if key not in self.stack else None
            if len(self.stack) > BaseCaching.MAX_ITEMS:
                key_to_pop = self.stack.pop(-2)
                del self.cache_data[key_to_pop]
                print(f"DISCARD: {key_to_pop}")

    def get(self, key):
        """ Get value of a given key """
        return self.cache_data.get(key)
