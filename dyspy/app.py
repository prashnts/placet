from sanic import Sanic
from sanic.response import text

app = Sanic(__name__)
app.static('/', './public/index.html')
app.static('/', './public')

@app.route('/api')
async def root(request):
    return text('API Root')
