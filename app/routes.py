from flask import render_template

def configure_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/alphabetaGame')
    def alphabeta_game():
        return render_template('alphabeta_game.html')

    @app.route('/sssGame')
    def sss_game():
        return render_template('sss_game.html')
