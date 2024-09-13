#!/usr/bin/env python3
""" Module implements a BaseCache class """

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """ Class definiton of BasicCache """
    def put(self, key, item):
        """ Assign to the cache the item value for key """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """ Return value in a cache linked to the key """
        return self.cache_data.get(key)
