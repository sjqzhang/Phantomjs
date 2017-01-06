#!/usr/bin/env python
# -*- coding:utf8 -*-
__author__ = 'xiaozhang'



from codeigniter import ci


import Queue
'''

# step one: get_urls
# step two: get_details
# step three: download_files



'''

import inspect

def __name__():
    return inspect.stack()[1][3]

class Article(object):

    def __init__(self):
        self.tasks={}


        self.site_name='3kkbb'
        self.page_url='http://www.3kkbb.net/art/article/index-%s.html'
        self.pages=[2,10]
        self.cookie=''
        self.selector_one="href_data('.zuo li')"
        self.selector_two="out([{'title':$('title').text(),'content':$('.content').text()}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name='hantiannan'
        self.page_url='http://blog.csdn.net/hantiannan/article/list/%s'
        self.pages=[1,40]
        self.cookie=''
        self.selector_one="href_data('#article_list .link_title')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('#article_content')}])"
        self.step_one_data=''
        self.step_two_data=''

    def get_urls(self,req,resp):
        if self.tasks.get(__name__())!=None:
            return '%s has start'%(__name__())
        else:
            self.tasks[__name__()]=__name__()

        import gevent
        jobs=[]
        queue=Queue.Queue(100000)
        start=self.pages[0]
        end=self.pages[1]
        for i in range(start,end):
            queue.put(i)
        for i in range(0,10):
            jobs.append(gevent.spawn(self._get_urls,queue))
        gevent.joinall(jobs)


    def get_details(self,req,resp):
        if self.tasks.get(__name__())!=None:
            return '%s has start'%(__name__())
        else:
            self.tasks[__name__()]=__name__()
        import gevent
        jobs=[]
        queue=Queue.Queue(1000000)
        for i in range(0,20):
            jobs.append(gevent.spawn(self._get_details,queue))
        rows= ci.db.query("select * from urls where status=0 and site='%s'" % (self.site_name))
        for row in rows:
            queue.put(row)
        gevent.joinall(jobs)

    def download(self,req,resp):
        if self.tasks.get(__name__())!=None:
            return '%s has start'%(__name__())
        else:
            self.tasks[__name__()]=__name__()
        import gevent
        queue=Queue.Queue(1000000)
        rows= ci.db.query("select * from files where status=0 and site='%s'" %(self.site_name))
        for row in rows:
            queue.put(row)
        jobs=[]
        for i in range(0,20):
            jobs.append(gevent.spawn(self._download_files,queue))
        gevent.joinall(jobs)


    def _get_urls(self,queue):
        while True:
            import requests
            import json
            try:
                i=queue.get(timeout=3)
                if i!=None:
                    try:
                        import requests
                        url=('''%s'''%(self.page_url))%(i)
                        header='''Cookie:%s'''%(self.cookie)
                        body='''%s'''% self.step_one_data
                        jscode='''%s'''%(self.selector_one)
                        posturl=''''''#js server phantomjs
                        data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':0}
                        jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                        jdata=json.loads(jdata)
                        for d in jdata:
                            d['site']=self.site_name
                            d['status']='0'
                            d['level']='1'
                            cnt=ci.db.scalar("select count(1) as cnt from urls where href='{href}'",{'href':d['href']})['cnt']
                            if cnt==0 and str(d['href']).startswith('http'):
                                ci.db.insert('urls',d)
                            else:
                                print("%s exist" % d['href'].encode('utf-8','ignore'))
                    except Exception as er:
                        ci.logger.error(er)
                else:
                    break
            except Exception as er:
                pass


    def _get_details(self,queue):
        import time
        while True:
            try:
                row=queue.get(timeout=30)
                import requests
                import json
                try:
                    import requests
                    import json
                    url=row['href']
                    header='''Cookie:%s'''%(self.cookie)
                    body='''%s'''%(self.step_two_data)
                    jscode='''%s'''%(self.selector_two)
                    posturl=''''''#js server phantomjs
                    data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':'0'}
                    jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                    jdata=json.loads(jdata)

                    for d in jdata:
                        d['href']=url
                        d['site']=self.site_name
                        d['status']='0'
                        d['title']=d['title'].split("\t")[0]
                        if len(d['title'].split('.'))==2:
                            d['ftype']=d['title'].split('.')[1]
                        ci.db.insert('files',d)

                        ci.db.update('urls',{'status':1}, {'href':row['href']})
                        # time.sleep(0.001)
                except Exception as er:
                    #pass
                    ci.logger.error(er)
            except Exception as er:
                pass

    def gen_pdf(self,req,resp):
        h1="<h2><a href='#%s'>%s</a></h2>"
        h2="<h2><a href='#%s'>%s</a><a style='padding-left:200px;' href='#pdf_top'>返回顶部</a></h2>"
        content="<div id='%s'>%s%s</div>"
        catalog=[]
        contents=[]
        html="""
        <!doctype html public "-//w3c//dtd html 4.0 transitional//en">
            <html>
             <head>
              <meta http-equiv="content-type" content="text/html;charset=utf-8">
             </head>

             <body>

             <div id='pdf_top'></div>

             %s
             %s
             </body>
            </html>


        """
        try:
            rows=ci.db.query("select files.content,urls.title from files inner join urls on files.href=urls.href where files.site='%s'" % self.site_name)
            for row in rows:
                if row['title']==None:
                    row['title']=''
                md5=ci.md5(row['title'])
                if row['content']==None:
                    row['content']=''
                tmp= h1 % (md5,row['title'].encode('utf-8','ignore'))
                catalog.append(tmp)
                tmp= h2 % (md5,row['title'].encode('utf-8','ignore'))
                contents.append(content %(md5,tmp,row['content'].encode('utf-8','ignore')) )
            htmls=html % ( "<br>".join(catalog), "<br>".join(contents))

            open(self.site_name+'.html','wb').write(htmls)

        except Exception as er:
            ci.logger.error(er)
            pass


    def _download_files(self,queue):
        import time
        import requests
        import json
        while True:
            try:
                row=queue.get(timeout=30)
                try:
                    r = requests.get(row['href'], stream=True)
                    with open("H:/kankandou/"+ row['title'], 'wb') as f:
                        for chunk in r.iter_content(chunk_size=1024):
                            if chunk: # filter out keep-alive new chunks
                                f.write(chunk)
                                f.flush()
                        f.close()
                    ci.db.update('files',{'status':1}, {'href':row['href']})
                except Exception as er:
                    pass
                    ci.logger.error(er)
            except Exception as er:
                pass