from . import routes
from flask import request
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC


@routes.route('/auth', methods=['POST'])
def auth():
    if request.form['auth-provider'] == "toutatice":
        return toutatice(request.form['username'], request.form['password'])


def toutatice(username, password):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)

    driver.get("http://www.toutatice.fr")
    loginBtn = driver.find_element_by_class_name("btn-login")
    loginBtn.click()

    educonnectBtn = driver.find_element_by_css_selector(
        "img[src*='img/educonnect.png']")
    educonnectBtn.click()

    eleveBtn = driver.find_element_by_id("bouton_eleve")
    eleveBtn.click()

    usernameField = driver.find_element_by_id("username")
    usernameField.send_keys(username)

    passwordField = driver.find_element_by_id("password")
    passwordField.send_keys(password)

    validateBtn = driver.find_element_by_id("bouton_valider")
    validateBtn.click()

    wait = WebDriverWait(driver, 30)
    wait.until(lambda driver: driver.current_url
               == "https://www.toutatice.fr/portail/auth/pagemarker/4/portal/default/bureau-eleve-lyc-2020?backPageMarker=6")

    europresseBtn = driver.find_element_by_xpath('//a[@title="Europresse"]')
    europresseBtn.click()

    another_window = list(set(driver.window_handles)
                          - {driver.current_window_handle})[0]
    driver.switch_to.window(another_window)

    wait = WebDriverWait(driver, 30).until(
        EC.presence_of_element_located((By.ID, "Keywords"))
    )

    searchInput = driver.find_element_by_css_selector("#Keywords")
    searchInput.click()
    searchInput.send_keys("NUPES")
    driver.find_element_by_css_selector("#btnSearch").click()

    wait = WebDriverWait(driver, 30).until(
        EC.presence_of_element_located(
            (By.XPATH, '//*[@id="main"]/form/input'))
    )

    cookies = {}
    selenium_cookies = driver.get_cookies()
    for cookie in selenium_cookies:
        cookies[cookie['name']] = cookie['value']

    resultVerificationToken = driver.find_element_by_xpath(
        '//*[@id="main"]/form/input')
    cookies['__NextRequestVerificationToken'] = resultVerificationToken.get_attribute(
        "value")

    return cookies
