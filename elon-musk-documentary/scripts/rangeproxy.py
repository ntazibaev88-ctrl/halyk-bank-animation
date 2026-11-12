# Local HTTP relay so ffmpeg can seek remote HTTPS media through the agent proxy (honours Range).
import http.server, socketserver, urllib.parse, requests
S = requests.Session(); S.verify = "/root/.ccr/ca-bundle.crt"
S.headers["User-Agent"] = "DocumentaryClipFinder/1.0 (non-commercial research script; python-requests)"
class H(http.server.BaseHTTPRequestHandler):
    def _go(self, head=False):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        url = q["u"][0]
        hdr = {}
        if "Range" in self.headers: hdr["Range"] = self.headers["Range"]
        r = S.request("HEAD" if head else "GET", url, headers=hdr, stream=True, allow_redirects=True, timeout=60)
        self.send_response(r.status_code)
        for k in ("Content-Length", "Content-Range", "Content-Type", "Accept-Ranges"):
            if k in r.headers: self.send_header(k, r.headers[k])
        self.end_headers()
        if not head:
            try:
                for ch in r.iter_content(256 * 1024): self.wfile.write(ch)
            except (BrokenPipeError, ConnectionResetError): pass
        r.close()
    def do_GET(self): self._go()
    def do_HEAD(self): self._go(True)
    def log_message(self, *a): pass
class T(socketserver.ThreadingMixIn, http.server.HTTPServer): daemon_threads = True
T(("127.0.0.1", 8899), H).serve_forever()
