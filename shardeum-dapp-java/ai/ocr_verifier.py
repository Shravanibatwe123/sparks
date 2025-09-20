# OCR stub. Use pytesseract for real OCR.
from PIL import Image
import sys
def ocr(path):
    print('OCR not implemented in stub. Provide path:', path)
if __name__=='__main__':
    if len(sys.argv)>1:
        ocr(sys.argv[1])
    else:
        print('usage: python ocr_verifier.py <image>')
