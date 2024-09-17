#!/usr/bin/env python3
""" Module implements LRUCache """
from collections import OrderedDict
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ Implement a LRUCache """
    def __init__(self):
        super().__init__()
        self.order = OrderedDict()
        self.lru = None

    def put(self, key, item):
        """ Assign to the cache the item value for the LIFOCache key """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.order.move_to_end(key)
            self.cache_data[key] = item
            self.order[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                least_used_item = self.order.popitem(last=False)
                del self.cache_data[least_used_item[0]]
                print(f"DISCARD: {least_used_item[0]}")

    def get(self, key):
        """ Get value of a given key """
        if key is not None and key in self.cache_data:
            self.order.move_to_end(key)
            return self.cache_data[key]
        return None
