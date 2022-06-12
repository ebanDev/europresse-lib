from . import routes
from flask import request
import requests
import ast
from bs4 import BeautifulSoup


@routes.route('/article', methods=['POST'])
def article():
    cookies = ast.literal_eval(request.form['cookies'])
    article = request.form['article']
    headers = {
        'Host': 'nouveau.europresse.com',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"-Not.A/Brand";v="8", "Chromium";v="102"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Linux"',
        'Upgrade-Insecure-Requests': '1',
        'Origin': 'https://nouveau.europresse.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Referer': 'https://nouveau.europresse.com/',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'close',
        }

    params = {
        'docKey': article,
        'fromBasket': 'false',
        'viewEvent': '1',
        'invoiceCode': '',
    }

    response = requests.get('https://nouveau.europresse.com/Document/ViewMobile',
                            params=params, cookies=cookies, headers=headers)

    soup = BeautifulSoup(str(response.text), features="lxml")

    article = soup.find('div', {'class': 'docOcurrContainer'})

    for match in article.findAll('mark'):
        match.unwrap()

    for match in article.findAll('span'):
        match.unwrap()

    articleTitle = soup.find('p', {'class': 'titreArticleVisu'})
    for match in articleTitle.findAll('mark'):
        match.unwrap()

    articleContent = "<h1>" + articleTitle.get_text() + "</h1>"
    for p in article:
        articleContent += str(p)

    return articleContent
