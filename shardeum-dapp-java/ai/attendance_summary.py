# Simple attendance analyzer stub
# For production, connect to provider, read events and compute top 3 regulars.
import sys
def sample():
    print({'top3': [{'address':'0xabc...','count':28},{'address':'0xdef...','count':25},{'address':'0x123...','count':20}]})
if __name__=='__main__':
    sample()
