import base64, pathlib

here = pathlib.Path(__file__).parent
def uri(name):
    data = (here / 'assets' / name).read_bytes()
    return 'data:image/png;base64,' + base64.b64encode(data).decode()

html = (here / 'template.html').read_text(encoding='utf-8')
html = html.replace('__LOGO__', uri('logo.png')).replace('__QR__', uri('qr.png'))
(here / 'index.html').write_text(html, encoding='utf-8')
print('index.html', len(html.encode()) // 1024, 'KB')
