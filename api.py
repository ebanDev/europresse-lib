from flask import Flask, request
from routes import *

app = Flask(__name__)
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run()  # run our Flask app
