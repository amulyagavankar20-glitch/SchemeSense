import requests
import json
import os
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
from src.scraper.cleaner import clean_text
from src.scraper.urls import SCHEME_URLS
from src.utils.logger import setup_logger

logger = setup_logger("Scraper")

def scrape_url(url, domain):
    try:
        logger.info(f"Scraping URL: {url} (Domain: {domain})")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Basic content extraction (can be refined per site)
        # Removing headers, footers, etc. is handled by clean_text
        raw_text = soup.get_text()
        cleaned_text = clean_text(raw_text)
        
        return {
            "url": url,
            "domain": domain,
            "content": cleaned_text
        }
    except Exception as e:
        logger.error(f"Error scraping {url}: {str(e)}")
        return None

def run_expanded_scrape():
    all_schemes = []
    
    # Flatten the URL list for concurrent processing
    tasks = []
    for domain, urls in SCHEME_URLS.items():
        for url in urls:
            tasks.append((url, domain))
            
    logger.info(f"Starting expanded scrape of {len(tasks)} URLs...")
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(lambda p: scrape_url(p[0], p[1]), tasks))
        
    all_schemes = [r for r in results if r is not None]
    
    # Ensure data directory exists
    os.makedirs(os.path.dirname(RAW_DATA_PATH), exist_ok=True)
    
    with open(RAW_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_schemes, f, indent=4)
        
    logger.info(f"Scraping complete. Saved {len(all_schemes)} schemes to {RAW_DATA_PATH}")

if __name__ == "__main__":
    run_expanded_scrape()
