#!/usr/bin/env python
# -*- coding:utf8 -*-
__author__ = 'xiaozhang'


from codeigniter import ci
from codeigniter import CI_Cache

import collections
import time
import json
import os
import re

from pdfminer.pdfinterp import PDFResourceManager,PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams



class CnInfo(object):


    def hello(self,req,resp):
        return 'hello world'


    def test_task(self,req,resp):
        stdb= ci.loader.cls('CI_DB')(**ci.config.get('stdb'))
        ci.set('stdb',stdb)
        crawl= ci.loader.helper('crawl')

        # crawl.url_fetch()




        crawl.url_fetch('http://www.cninfo.com.cn/cninfo-new/disclosure/szse')


        import time

        for i in range(1,3):


            data={"stock":"","searchkey":"增持;","plate":"","category":"","trade":"","column":"szse","columnTitle":"历史公告查询","pageNum":i,"pageSize":"30","tabName":"fulltext","sortName":"","sortType":"","limit":"","showTitle":"-1/searchkey/增持","seDate":"请选择日期",}

            js= crawl.url_fetch('http://www.cninfo.com.cn/cninfo-new/announcement/query',data)
            time.sleep(1)


            import json

            # print json.dumps( json.loads(js),indent=4)
            annos=json.loads(js)
            for a in annos['announcements']:
                try:
                    if ci.get('stdb').scalar('select count(1) as cnt from st_anno where announcementId=:announcementId',a)['cnt']==0:
                        ci.get('stdb').insert_safe('st_anno',a)
                    #print(a)
                except Exception as e:
                    ci.logger.error(e)
                    print(e)
                    pass

                # print(a['announcementTitle'])
        self.add_info(req,resp)
        resp.body='ok'


    def convert(self,filename):
        outfile = filename.split('.')[0]+'.txt'
        args = [filename]
        pagenos=set()
        maxpages=0
        password=''
        caching=True
        rotation = 0

        rsrcmgr = PDFResourceManager()
        outfp = file(outfile,'w')
        device = TextConverter(rsrcmgr,outfp,codec='utf-8',laparams=LAParams())

        # for fname in args:
        #     fp = file(fname, 'rb')
        #     #process_pdf(rsrcmgr, device, fp, pagenos = set(), maxpages = 0, password = '', check_extractable=True)
        #     fp.close()
        for fname in args:
                fp = file(fname, 'rb')
                interpreter = PDFPageInterpreter(rsrcmgr, device)
                for page in PDFPage.get_pages(fp, pagenos,
                                              maxpages=maxpages, password=password,
                                              caching=caching, check_extractable=True):
                    page.rotate = (page.rotate+rotation) % 360
                    interpreter.process_page(page)
                fp.close()

        device.close()
        outfp.close()


    def add_info(self,req,resp):
        stdb= ci.loader.cls('CI_DB')(**ci.config.get('stdb'))
        l=stdb.query('select * from st_anno order by storageTime desc limit 60')
        files=[]
        for i in l:
            print i
            url='http://www.cninfo.com.cn/'+ i['adjunctUrl']
            title=i['announcementTitle']
            filetype=i['adjunctType']
            code=i['secCode']
            name= i['secName']
            filename=unicode(title)+"."+filetype

            #filename='%s/[%s][%s]_%s' %('files',code,name , filename)
            filename='%s/%s' %('files',i['announcementId']+'.'+filetype)
            filenametxt='%s/%s' %('files',i['announcementId']+'.txt')

            #print filename
            if not os.path.exists(filename):
                print filename
                pass
                files.append(filename)
                a=ci.request(url,timeout=600)
                open(filename ,'wb').write(a)
                self.convert(filename)
                txt=''
                with open(filenametxt,'r') as filetxt:
                    txt=filetxt.read()

                print txt

                stdb.update_safe('st_anno',{'anno':txt},{'announcementId':i['announcementId']})


    def filter(self,files):
        import time
        for file in files:
            # filename=file+".txt"
            filename=file
            if os.path.exists(filename) :
                if True or  time.time()-os.stat(filename).st_ctime< 60*60*24:
                    content=open(filename,'r').read()
                    find=re.findall(r'([\d\,\.]+\s*\%)',content)
                    find2=re.findall(u'([\d\,]+\s*)\n*股',content.decode("utf-8"))
                    print find
                    print find2

    def find(self,req,resp):
        files=os.listdir('files')
        fs=[]
        for file in files:
            if file.endswith('.txt'):
                fs.append(u"%s/%s"%('files',file.decode('gbk')))
        print fs
        self.filter(fs)



    def last(self,req,resp):
        stdb= ci.loader.cls('CI_DB')(**ci.config.get('stdb'))
        rows=stdb.query('select announcementTitle,anno from st_anno order by storageTime desc limit 3')
        #print rows
        return ci.tpl.render('table.tpl',{'rows':rows})


