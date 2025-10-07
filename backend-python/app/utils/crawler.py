import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import json
from datetime import datetime

def extract_data_from_html(html: str, url: str) -> List[Dict[str, Any]]:
    """
    Extract data from HTML based on common patterns
    """
    soup = BeautifulSoup(html, 'html.parser')
    data = []

    # Extract tables
    for table in soup.find_all('table'):
        table_data = []
        headers = []

        # Get headers
        header_row = table.find('thead')
        if header_row:
            headers = [th.get_text(strip=True) for th in header_row.find_all(['th', 'td'])]
        else:
            # Use first row as headers
            first_row = table.find('tr')
            if first_row:
                headers = [td.get_text(strip=True) for td in first_row.find_all('td')]

        # Get data rows
        tbody = table.find('tbody') or table
        rows = tbody.find_all('tr')

        for i, row in enumerate(rows):
            if i == 0 and not header_row:  # Skip header row if already used
                continue

            cells = row.find_all('td')
            if cells:
                row_data = {}
                for j, cell in enumerate(cells):
                    header = headers[j] if j < len(headers) else f'column_{j + 1}'
                    row_data[header] = cell.get_text(strip=True)
                if row_data:
                    table_data.append(row_data)

        if table_data:
            data.append({
                'type': 'table',
                'data': table_data,
                'source': url
            })

    # Extract lists
    for list_elem in soup.find_all(['ul', 'ol']):
        list_items = [li.get_text(strip=True) for li in list_elem.find_all('li')]
        if list_items:
            data.append({
                'type': 'list',
                'data': list_items,
                'source': url
            })

    # Extract structured data (JSON-LD)
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            json_data = json.loads(script.string)
            data.append({
                'type': 'structured_data',
                'data': json_data,
                'source': url
            })
        except (json.JSONDecodeError, TypeError):
            pass

    # If no structured data found, extract basic text content
    if not data:
        title = soup.title.get_text(strip=True) if soup.title else ''
        description = ''
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc.get('content', '')

        body_text = soup.body.get_text(strip=True) if soup.body else ''
        body_text = ' '.join(body_text.split())[:10000]  # Limit content length

        data.append({
            'type': 'page_content',
            'data': {
                'title': title,
                'description': description,
                'content': body_text
            },
            'source': url
        })

    return data

async def crawl_url(url: str) -> List[Dict[str, Any]]:
    """
    Crawl a single URL
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()

        html = response.text
        return extract_data_from_html(html, url)
    except Exception as e:
        print(f"Error crawling {url}: {str(e)}")
        raise Exception(f"Failed to crawl {url}: {str(e)}")

def generate_urls_from_requirement(requirement: str) -> List[str]:
    """
    Generate URLs to crawl based on requirement
    """
    urls = []

    # Common data sources based on keywords
    keyword_mappings = {
        'weather': ['https://weather.com', 'https://accuweather.com'],
        'news': ['https://bbc.com/news', 'https://cnn.com', 'https://reuters.com'],
        'finance': ['https://finance.yahoo.com', 'https://bloomberg.com'],
        'sports': ['https://espn.com', 'https://sports.yahoo.com'],
        'technology': ['https://techcrunch.com', 'https://wired.com'],
        'health': ['https://webmd.com', 'https://mayoclinic.org'],
        'shopping': ['https://amazon.com', 'https://ebay.com'],
        'social': ['https://twitter.com/search', 'https://facebook.com/search']
    }

    lower_req = requirement.lower()

    for keyword, sources in keyword_mappings.items():
        if keyword in lower_req:
            urls.extend(sources)

    # If no specific matches, use default
    if not urls:
        urls.extend([
            'https://jsonplaceholder.typicode.com/posts',
            'https://jsonplaceholder.typicode.com/users'
        ])

    return urls[:3]  # Limit to 3 URLs

async def execute_crawling(request_id: int, requirement: str, db):
    """
    Execute crawling for a request
    """
    try:
        # Update request status to processing
        await db.requests.update_one(
            {'id': request_id},
            {'$set': {'status': 'processing'}}
        )

        # Generate URLs to crawl
        urls = generate_urls_from_requirement(requirement)

        if not urls:
            raise Exception('No URLs generated for crawling')

        # Crawl each URL
        for url in urls:
            try:
                crawled_data = await crawl_url(url)

                # Store crawled data
                await db.crawled_data.insert_one({
                    'request_id': request_id,
                    'url': url,
                    'data': crawled_data,
                    'validated': False,
                    'timestamp': datetime.utcnow()
                })

                print(f"Successfully crawled and stored data from {url}")
            except Exception as e:
                print(f"Failed to crawl {url}: {str(e)}")
                # Continue with other URLs

        # Update request status to completed
        await db.requests.update_one(
            {'id': request_id},
            {'$set': {'status': 'completed', 'completed_at': datetime.utcnow()}}
        )

    except Exception as e:
        print(f"Error executing crawling for request {request_id}: {str(e)}")
        # Update request status to failed
        await db.requests.update_one(
            {'id': request_id},
            {'$set': {'status': 'failed'}}
        )
        raise e

async def test_crawling(url: str) -> List[Dict[str, Any]]:
    """
    Test crawling functionality
    """
    try:
        return await crawl_url(url)
    except Exception as e:
        raise Exception(f"Test crawling failed: {str(e)}")