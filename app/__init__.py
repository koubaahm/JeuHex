from flask import Flask


def create_app():
    app = Flask(__name__)
    # Configurations supplémentaires ici, par exemple :
    # app.config.from_object('config.Config')

    from app.routes import configure_routes
    configure_routes(app)

    return app
