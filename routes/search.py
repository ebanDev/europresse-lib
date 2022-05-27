from . import routes
from flask import request
import requests
import ast
from bs4 import BeautifulSoup


@routes.route('/search', methods=['GET'])
def search():
    cookies = ast.literal_eval(request.form['cookies'])
    query = request.form['q']
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
    data = '__RequestVerificationToken=' + cookies['__NextRequestVerificationToken'] + '&PostedFilters.FiltersIDs=8001&PostedFilters.FiltersIDs=8000&PostedFilters.FiltersIDs=403&PostedFilters.FiltersIDs=5355&PostedFilters.FiltersIDs=8002&Keywords=' + \
        query + '&DateFilter.DateRange=4&CriteriaSet=0&SearchType=Mobile&DateFilter.DateStart=2022-05-27&DateFilter.DateStop=2022-05-27'

    response = requests.post('https://nouveau.europresse.com/Search/Reading',
                             cookies=cookies, headers=headers, data=data)
    params = {
        'pageNo': '0',
        'docPerPage': '50',
    }
    response = requests.get('https://nouveau.europresse.com/Search/GetPage',
                            params=params, cookies=cookies, headers=headers)

    soup = BeautifulSoup(str(response.text), features="lxml")

    articles = []

    for articleData in soup.find_all('div', {"class": "docListItem"}):
        article = {}
        article['title'] = articleData.select(
            'div.docContent > div.content-wrapper > div.docLink.docList-body > a')[0].contents[0]

        article['newspaper'] = articleData.select(
            'div.docContent > div.docList-header > span.source-name')[0].contents[0]
        article['articleId'] = articleData.select('#doc-name')[0].get('value')
        articles.append(article)

    return str(articles)
