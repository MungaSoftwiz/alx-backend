#!/usr/bin/env python3
"""4-mru_cache
Implements MRU caching.
"""
from collections import OrderedDict
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """ Module implements MRUCache """

    def __init__(self):
        super().__init__()
        self.order = OrderedDict()

    def put(self, key, item):
        """ Implement an MRU cache """
        if key is not None and item is not None:
            if key in self.cache_data:
                del self.order[key]
            elif len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                most_used_key, _ = self.order.popitem(last=True)
                del self.cache_data[most_used_key]
                print(f"DISCARD: {most_used_key}")

            self.order[key] = item
            self.cache_data[key] = item

    def get(self, key):
        """ Get value of a given key """
        if key is not None and key in self.cache_data:
            self.order.move_to_end(key)
            return self.cache_data[key]
        return None
