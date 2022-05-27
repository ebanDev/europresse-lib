from . import routes


@routes.route('/version')
def version():
    return "1.0"
