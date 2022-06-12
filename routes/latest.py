from . import routes
from flask import request
import requests
import ast
from bs4 import BeautifulSoup
from datetime import date
import json

newsPapers = {
    "Le Monde": "2121",
    "Libération": "8343",
    "L'Humanité": "242",
    "Ouest France": "12303",
    "Le Monde Diplomatique": "248"
}


@routes.route('/latest', methods=['POST'])
def latest():
    cookies = ast.literal_eval(request.form['cookies'])
    newsPaper = newsPapers[request.form['q']]
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'Referer': 'https://nouveau.europresse.com/',
        'Origin': 'https://nouveau.europresse.com',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
    }

    data = {
        '__RequestVerificationToken': cookies['__NextRequestVerificationToken'],
        'Keywords': '',
        'CriteriaKeys[0].Operator': '&',
        'CriteriaKeys[0].Key': 'TIT_HEAD',
        'CriteriaKeys[0].Text': '',
        'CriteriaKeys[1].Operator': '&',
        'CriteriaKeys[1].Key': 'LEAD',
        'CriteriaKeys[1].Text': '',
        'CriteriaKeys[2].Operator': '&',
        'CriteriaKeys[2].Key': 'AUT_BY',
        'CriteriaKeys[2].Text': '',
        'sources': '1',
        'CriteriaSet': '-1',
        'sourcesFilter': 'Libération',
        'PostedFilters.FiltersIDs': [
            '8001',
            '8000',
            '403',
            '5355',
            '8002',
        ],
        'DateFilter.DateRange': '4',
        'DateFilter.DateStart': date.today(),
        'DateFilter.DateStop': date.today(),
        'SourcesForm': '1',
        'CriteriaExp[0].CriteriaId': newsPaper,
        'CriteriaExp[0].OperatorId': '2',
    }

    response = requests.post('https://nouveau.europresse.com/Search/AdvancedMobile',
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

        article['summary'] = articleData.select(
            'div.docContent > div.content-wrapper > div.docList-footer > .kwicResult.clearfix')[0].contents[-1][3:]
        article['articleId'] = articleData.select('#doc-name')[0].get('value')
        articles.append(article)

    return str(articles)


@routes.route('/newspapers')
def newspapers():
    return json.dumps(list(newsPapers.keys()))
