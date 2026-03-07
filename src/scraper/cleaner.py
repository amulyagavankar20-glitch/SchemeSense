import re
from bs4 import BeautifulSoup

def clean_text(html_content):
    if not html_content:
        return ""
    
    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove script and style elements
    for script_or_style in soup(["script", "style", "header", "footer", "nav"]):
        script_or_style.decompose()
    
    # Get text
    text = soup.get_text()
    
    # Break into lines and remove leading/trailing whitespace
    lines = (line.strip() for line in text.splitlines())
    
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)
    
    # Remove redundant whitespace and special chars
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

if __name__ == "__main__":
    sample_html = "<html><body><header>Nav</header><h1>Scheme Title</h1><p>Rules and <b>Eligibility</b>.</p></body></html>"
    print(f"Cleaned: {clean_text(sample_html)}")
