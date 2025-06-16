import sys
import os
import time
from datetime import datetime, timedelta, timezone
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.extensions import db
from app.model import Job

app = create_app()
app.app_context().push()

def safe_find_element(parent, by, value, default=None):
    try:
        return parent.find_element(by, value)
    except NoSuchElementException:
        return default

def safe_find_elements(parent, by, value):
    try:
        return parent.find_elements(by, value)
    except NoSuchElementException:
        return []

def safe_get_text(element, default=""):
    return element.text.strip() if element else default

def safe_get_attribute(element, attr, default=""):
    return element.get_attribute(attr) if element else default

def parse_posting_date(text):
    if not text:
        return datetime.now(timezone.utc).date()
    
    text = text.lower().strip()
    
    if "today" in text or "just now" in text or "new" in text:
        return datetime.now(timezone.utc).date()
    elif "hour" in text:
        return datetime.now(timezone.utc).date()
    elif "day" in text:
        try:
            days = int(text.split()[0])
            return datetime.now(timezone.utc).date() - timedelta(days=days)
        except (ValueError, IndexError):
            return datetime.now(timezone.utc).date()
    elif "week" in text:
        try:
            weeks = int(text.split()[0])
            return datetime.now(timezone.utc).date() - timedelta(weeks=weeks)
        except (ValueError, IndexError):
            return datetime.now(timezone.utc).date()
    elif "month" in text:
        try:
            months = int(text.split()[0])
            return datetime.now(timezone.utc).date() - timedelta(days=months*30)
        except (ValueError, IndexError):
            return datetime.now(timezone.utc).date()
    else:
        return datetime.now(timezone.utc).date()

options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

EDGE_DRIVER_PATH = "C:/webdrivers/msedgedriver.exe"
service = EdgeService(executable_path=EDGE_DRIVER_PATH)
driver = webdriver.Edge(service=service, options=options)

try:
    driver.get("https://www.actuarylist.com/")
    
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'Job_job-card__')]"))
    )
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)  
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
    
    job_cards = driver.find_elements(By.XPATH, "//div[contains(@class, 'Job_job-card__')]")
    

    for i, card in enumerate(job_cards):
        try:
            
            title_elem = (safe_find_element(card, By.XPATH, ".//p[contains(@class, 'position')]") or
                         safe_find_element(card, By.XPATH, ".//p[contains(@class, 'Position')]") or
                         safe_find_element(card, By.XPATH, ".//p[contains(@class, 'title')]"))
            title = safe_get_text(title_elem)
            
            company_elem = (safe_find_element(card, By.XPATH, ".//p[contains(@class, 'company')]") or
                           safe_find_element(card, By.XPATH, ".//p[contains(@class, 'Company')]") or
                           safe_find_element(card, By.XPATH, ".//div[contains(@class, 'company')]"))
            company = safe_get_text(company_elem)
            
            if not title or not company:
                continue
                
            city_elem = (safe_find_element(card, By.XPATH, ".//a[contains(@class, 'location')]") or
                        safe_find_element(card, By.XPATH, ".//span[contains(@class, 'location')]"))
            city = safe_get_text(city_elem, "Remote")
            
            country_elem = (safe_find_element(card, By.XPATH, ".//a[contains(@class, 'country')]") or
                           safe_find_element(card, By.XPATH, ".//span[contains(@class, 'country')]"))
            country = safe_get_text(country_elem)
            
            link_elem = (safe_find_element(card, By.XPATH, ".//a[contains(@class, 'job-page-link')]") or
                        safe_find_element(card, By.XPATH, ".//a[contains(@href, 'actuarial-jobs')]"))
            link = safe_get_attribute(link_elem, "href", "#")
            
            tags_container = (safe_find_element(card, By.XPATH, ".//div[contains(@class, 'tags')]") or
                            safe_find_element(card, By.XPATH, ".//div[contains(@class, 'tag')]"))
            tags = []
            if tags_container:
                tags = [safe_get_text(a) for a in safe_find_elements(tags_container, By.XPATH, ".//a") or 
                       safe_find_elements(tags_container, By.XPATH, ".//span")]
                tags = [tag for tag in tags if tag]  # Remove empty tags
            
            
            posting_elem = (safe_find_element(card, By.XPATH, ".//p[contains(@class, 'posted-on')]") or
                          safe_find_element(card, By.XPATH, ".//span[contains(@class, 'date')]"))
            posting_raw = safe_get_text(posting_elem, "Today")
            posting_date = parse_posting_date(posting_raw)

            
            job_type = "Full-time"
            if any("intern" in tag.lower() for tag in tags):
                job_type = "Internship"
            elif any("part" in tag.lower() for tag in tags):
                job_type = "Part-time"
            elif any("contract" in tag.lower() for tag in tags):
                job_type = "Contract"

            
            existing = Job.query.filter_by(link=link).first()
            if not existing:
                job = Job(
                    title=title,
                    company=company,
                    location=f"{city}, {country}" if country else city,
                    posting_date=posting_date,
                    job_type=job_type,
                    tags=",".join(tags),
                    link=link
                )
                db.session.add(job)
            else:
                print(f" Duplicate skipped {i+1}/{len(job_cards)}: {title} at {company}")

        except Exception as e:
            print(f"Error processing job card {i+1}/{len(job_cards)}: {str(e)[:100]}")

    db.session.commit()
    print("Scraping complete!")

except TimeoutException:
    print(" Timed out waiting for page to load")
except Exception as e:
    print(f" Critical error: {e}")
finally:
    driver.quit()