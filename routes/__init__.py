from flask import Blueprint
routes = Blueprint('routes', __name__)

from .article import *
from .auth import *
from .search import *
from .version import *
from .latest import *
