from flask import Flask, request
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import urllib.parse

class Scrapper: 
    def __init__(self): 
        self.options = webdriver.ChromeOptions()
        self.driver = webdriver.Chrome(options=self.options)
        self.driver.maximize_window()
        print("Initialised scrapper!")
        
    def get_audio_link(self, podcast_author, podcast_title): 
        print("Starting scrap")
        # Go to the search 
        self.driver.get(f'https://player.fm/search/{urllib.parse.quote(podcast_author)}')

        # Scroll down a bit 
        self.driver.execute_script("window.scrollTo(0, 100)") 

        # Close one trust policy 
        WebDriverWait(self.driver, 60).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[9]/div[2]/div/div[2]/button"))).click()
        # Search 
        WebDriverWait(self.driver, 60).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[4]/div/div[2]/div/div[1]/section/main/div/article[2]/div[2]/div[1]/header/h2[1]/span/a"))).click()

        # Scroll down a bit 
        self.driver.execute_script("window.scrollTo(0, 200)") 

        # Click search icon
        WebDriverWait(self.driver, 60).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[4]/div[3]/div/div/div[2]/section/header/div/span[1]/span[2]/span[1]/i"))).click()
        # Enter podcast title
        WebDriverWait(self.driver, 60).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[4]/div[3]/div/div/div[2]/section/header/div/span[1]/span[2]/input"))).send_keys(podcast_title)
        # Press enter
        WebDriverWait(self.driver, 60).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[4]/div[3]/div/div/div[2]/section/header/div/span[1]/span[2]/input"))).send_keys(Keys.RETURN);

        top_result_xpath = "/html/body/div[4]/div[3]/div/div/div[2]/section/main/div/article/div[2]/div[2]/header/a[1]"
        top_result_link = self.driver.find_element(By.XPATH, top_result_xpath)
        podcast_link = top_result_link.get_attribute("href")

        print(f'Podcast Link is: {podcast_link}')
        return podcast_link
    
    
app = Flask(__name__)

@app.route('/search')
def search():
    query = request.args.get('q')
    print(query)
    return f'Searching for: {query}'

@app.route('/audio')
def audio():
    print("Hello")
    author = request.args.get('author')
    title = request.args.get('title')
    print(f"Searching for: {author} - {title}")
    bot = Scrapper()
    link = bot.get_audio_link(author, title)
    return f'Link is: {link}'
    

if __name__ == '__main__':
    app.run()
    