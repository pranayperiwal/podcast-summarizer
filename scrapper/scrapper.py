from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import urllib.parse

class WebScrapper: 

    timeout = 60
    scroll_y_offset = 200

    one_trust_policy_xpath = "/html/body/div[9]/div[2]/div/div[2]/button"
    podcast_search_bar_xpath = "/html/body/div[4]/div/div[2]/div/div[1]/section/main/div/article[2]/div[2]/div[1]/header/h2[1]/span/a"
    episodes_search_bar_icon_xpath = "/html/body/div[4]/div[3]/div/div/div[2]/section/header/div/span[1]/span[2]/span[1]/i"
    episodes_search_bar_xpath = "/html/body/div[4]/div[3]/div/div/div[2]/section/header/div/span[1]/span[2]/input"
    top_result_xpath = "/html/body/div[4]/div[3]/div/div/div[2]/section/main/div/article/div[2]/div[2]/header/a[1]"
       
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
        self.driver.execute_script(f"window.scrollTo(0, {WebScrapper.scroll_y_offset})") 

        # Close one trust policy 
        WebDriverWait(
            self.driver, WebScrapper.timeout
        ).until(
            EC.element_to_be_clickable(
                (By.XPATH, WebScrapper.one_trust_policy_xpath)
            )
        ).click()

        # Search 
        WebDriverWait(
            self.driver, WebScrapper.timeout
        ).until(
            EC.element_to_be_clickable(
                (By.XPATH, WebScrapper.podcast_search_bar_xpath)
            )
        ).click()

        # Scroll down a bit 
        self.driver.execute_script(
            f"window.scrollTo(0, {WebScrapper.scroll_y_offset})"
        ) 

        # Click search icon
        WebDriverWait(
            self.driver, WebScrapper.timeout
        ).until(
            EC.element_to_be_clickable(
                (By.XPATH, WebScrapper.episodes_search_bar_icon_xpath)
            )
        ).click()

        # Enter podcast title
        WebDriverWait(
            self.driver, WebScrapper.timeout
        ).until(
            EC.element_to_be_clickable(
                (By.XPATH, WebScrapper.episodes_search_bar_xpath)
            )
        ).send_keys(podcast_title)

        # Press enter
        WebDriverWait(
            self.driver, WebScrapper.timeout
        ).until(
            EC.element_to_be_clickable(
                (By.XPATH, WebScrapper.episodes_search_bar_xpath)
            )
        ).send_keys(Keys.RETURN);

        podcast_link = WebDriverWait(
            self.driver, WebScrapper.timeout
        ).until(
            EC.element_to_be_clickable(
                (By.XPATH, WebScrapper.top_result_xpath)
            )
        ).get_attribute("href")

        print(f'Pocast Link is: {podcast_link}')
        return podcast_link
    
    
app = Flask(__name__)

@app.route('/search')
def search():
    query = request.args.get('q')
    print(query)
    return f'Searching for: {query}'

@app.route('/test')
def test():
    author = request.args.get('author')
    title = request.args.get('title')
    print(author, title)
    link = f"audio.com/for/{author}/{title}"
    result = {
        "link": link
    }
    return jsonify(result)

@app.route('/audio')
def audio():
    author = request.args.get('author')
    title = request.args.get('title')
    print(f"Searching for: {author} - {title}")
    link = bot.get_audio_link(author, title)
    result = {
        "link": link
    }
    print(result)
    return jsonify(result)
    

if __name__ == '__main__':
    bot = WebScrapper()
    app.run()
    