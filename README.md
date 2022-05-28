# 📰 Europresse API
📰 This repo is an API for europresse, featuring toutatice-based auth
## Usage
1. Install dependencies
```
pip install -r requirements.txt
```
2. Start the API server
```
python api.py
```

⚠️ Do not forget to install geckodriver, as it's a selenium dependency
## API routes
### GET /auth
Takes three arguments
1. username
2. password
3. auth-provider : currently only toutatice is avaiable, others may be implemented in the future
Return the auth cookies
### GET /search
Takes two arguments
1. cookies : see Auth
2. q : the query you wanna search for
Return an array of objects following this format
```json
{
  "title": "The title",
  "newpaper": "The newspaper name",
  "articleId: "The internal article ID, example : news·20220428·CCMF·008"
}
```

### GET /article
Takes two arguments
1. cookies : see Auth
2. article : an article ID, see Search
Return the HTML code of the requested article
### GET /latest
Takes two arguments
1. cookies : see Auth
2. q : the newspaper name
Return a JSON as in Search of the latest publications of a newspaper
### GET /newspapers
Return an array of avaiable newspapers to be used in latest
