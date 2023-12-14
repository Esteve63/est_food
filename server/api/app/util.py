import http.client
import gzip
from io import BytesIO
import re

def find_text_between_keys(input_string, start_key, end_key) -> str:
    # Create a regex pattern to find text between start_key and end_key
    pattern = re.escape(start_key) + '\s*(.*?)\s*' + re.escape(end_key)

    # Search the string with the pattern
    match = re.search(pattern, input_string)

    # Extract and return the matched text
    if match:
        return match.group(1)
    else:
        return ''
    
def get_product_name_from_ean_search(id: str) -> str:
    conn = http.client.HTTPSConnection('www.ean-search.org')
    headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.ean-search.org/',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1'
    }
    conn.request('GET', f'/?q={id}', '', headers)
    res = conn.getresponse()

    if res.getheader('Content-Encoding') == 'gzip':
        buffer = BytesIO(res.read())
        f = gzip.GzipFile(fileobj=buffer)
        data = f.read()
    else:
        data = res.read()

    html = data.decode('utf-8') 

    product_name = find_text_between_keys(html, id, '</title>')

    return product_name