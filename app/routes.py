from flask import render_template

def configure_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/game')
    def game():
        return render_template('game.html')
