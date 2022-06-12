from flask import Flask, request
from routes import *
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(routes)
CORS(app)

if __name__ == '__main__':
    app.run()  # run our Flask app
