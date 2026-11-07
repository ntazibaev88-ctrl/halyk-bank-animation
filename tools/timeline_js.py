import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
open(os.path.join(ROOT, 'build', 'timeline.js'), 'w').write('window.TIMELINE = ' + json.dumps(t, ensure_ascii=False) + ';\n')
