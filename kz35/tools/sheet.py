import sys
from PIL import Image, ImageDraw
files=sys.argv[2:]; out=sys.argv[1]; S=360; cols=6
rows=(len(files)+cols-1)//cols
sheet=Image.new('RGB',(cols*S,rows*S),'black'); d=ImageDraw.Draw(sheet)
for k,f in enumerate(files):
    im=Image.open(f).convert('RGB'); im.thumbnail((S,S-20))
    x=(k%cols)*S; y=(k//cols)*S
    sheet.paste(im,(x+(S-im.width)//2,y)); d.text((x+4,y+S-18),f"{k+1}",fill='yellow')
sheet.save(out,quality=85)
