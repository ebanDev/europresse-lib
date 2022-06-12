from . import routes


@routes.route('/version')
def version():
    return "2.2"
