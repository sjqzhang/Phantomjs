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


        self.site_name=u'3kkbb'
        self.page_url='http://www.3kkbb.net/art/article/index-%s.html'
        self.pages=[2,10]
        self.cookie=''
        self.selector_one="href_data('.zuo li')"
        self.selector_two="out([{'title':$('title').text(),'content':$('.content').text()}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name=u'hantiannan'
        self.page_url='http://blog.csdn.net/hantiannan/article/list/%s'
        self.pages=[1,40]
        self.cookie=''
        self.selector_one="href_data('#article_list .link_title')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('#article_content')}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name=u'qiankunli'
        self.page_url='http://qiankunli.github.io/'
        self.pages=[1,40]
        self.cookie=''
        self.selector_one="href_data('.col-md-12')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('#content')}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name=u'技术分享'
        self.page_url='http://wiki.web.com/index.php?title=%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB'
        self.pages=[1,2]
        self.cookie=''
        self.selector_one="href_data('#mw-content-text>ul li')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('#mw-content-text')}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name=u'美团点评技术'
        self.page_url='http://tech.meituan.com/?l=6000'
        self.pages=[1,2]
        self.cookie=''
        self.selector_one="href_data('.post-title')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('.article__content')}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name=u'有点黄'
        self.page_url='http://11qqmm.com/xiaoshuoqu/jiqingxiaoshuo/'
        self.pages=[1,2]
        self.cookie=''
        self.selector_one="href_data('.channel li:gt(3)')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('.post'),'pages':get_pages('.newpagination')}])"
        self.step_one_data=''
        self.step_two_data=''

        self.site_name=u'大数据应用'
        self.page_url='http://bigdata.51cto.com/col/577/list_577_%s.htm'
        self.pages=[1,30]
        self.cookie=''
        self.selector_one="href_data('.list_leftcont h4')"
        self.selector_two="out([{'title':$('title').text(),'content':out_html('.zwnr')}])"
        self.step_one_data=''
        self.step_two_data=''
        self.selector_hidden='.zwnr >div'


    def start(self,req,resp):
        import gevent

        def job():
            self.get_urls(req,resp)
            self.get_details(req,resp)
            self.gen_html(req,resp)
        # threading.Thread(target=job).start()
        gevent.spawn(job)
        return 'job start'


    def get_urls(self,req,resp):
        # if self.tasks.get(__name__())!=None:
        #     return '%s has start'%(__name__())
        # else:
        #     self.tasks[__name__()]=__name__()

        import gevent
        jobs=[]
        Queue.Queue()
        queue=Queue.Queue(100000)
        start=self.pages[0]
        end=self.pages[1]
        for i in range(start,end):
            queue.put(i)
        for i in range(0,10):
            jobs.append(gevent.spawn(self._get_urls,queue))
        gevent.joinall(jobs)
        msg='get_urls finish'
        print(msg)
        return msg



    def get_details(self,req,resp):
        # if self.tasks.get(__name__())!=None:
        #     return '%s has start'%(__name__())
        # else:
        #     self.tasks[__name__()]=__name__()
        import gevent
        jobs=[]
        queue=Queue.Queue(1000000)
        for i in range(0,20):
            jobs.append(gevent.spawn(self._get_details,queue))
        rows= ci.db.query("select * from urls where status=0 and site='%s'" % (self.site_name))
        for row in rows:
            queue.put(row)
        gevent.joinall(jobs)
        msg='get_details finish'
        print(msg)
        return msg

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
                if queue.empty():
                    break
                i=queue.get()
                print('page',i)
                if i!=None:
                    try:
                        import requests
                        if self.page_url.find('%s')!=-1:
                            url=('''%s'''%(self.page_url))%(i)
                        else:
                            url=self.page_url
                        header='''Cookie:%s'''%(self.cookie)
                        body='''%s'''% self.step_one_data
                        jscode='''%s'''%(self.selector_one)
                        posturl=''''''#js server phantomjs
                        data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':0}
                        jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                        jdata=json.loads(jdata)
                        # print jdata
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
                        print('error'+str(er))
                        ci.logger.error(er)
                else:
                    break
            except Exception as er:
                print('error'+str(er))
                pass


    def _get_details(self,queue):
        import time
        while True:
            try:
                if queue.empty():
                    break
                row=queue.get(timeout=30)
                import requests
                import json
                try:
                    def crawl(url):
                        import requests
                        import json
                        # url=row['href']
                        print('crawl', url)
                        header = '''Cookie:%s''' % (self.cookie)
                        body = '''%s''' % (self.step_two_data)
                        jscode = '''%s''' % (self.selector_two)
                        posturl = ''''''  #js server phantomjs
                        data = {'url': url, 'header': header, 'body': body, 'jscode': jscode, 'posturl': posturl,
                                'js': '0'}
                        jdata = requests.post('http://127.0.0.1:8080/api/request', data).text
                        jdata = json.loads(jdata)
                        return jdata


                    jdata = crawl(row['href'])
                    if len(jdata) == 1:
                        if 'pages' in jdata[0]:
                            result = []
                            result.append(jdata[0]['content'])
                            for url in jdata[0]['pages']:
                                data = crawl(url)
                                if len(data) == 1:
                                    result.append(data[0]['content'])
                            del jdata[0]['pages']
                            jdata[0]['content'] = ''.join(result)
                    url = row['href']
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

    def gen_html(self,req,resp):
        import re
        h1="<h2><a href='#%s'>%s</a></h2>"
        h2="<div><h1 style='display:inline-block;'><a href='#%s'>%s</a></h1>" \
           "<span style='float:right;display:inline-block;'><a  href='#pdf_top'>返回顶部</a></span></div>"
        content="<div id='%s'>%s%s</div>"
        catalog=[]
        contents=[]
        html="""
        <!doctype html public "-//w3c//dtd html 4.0 transitional//en">
            <html>
             <head>
              <meta http-equiv="content-type" content="text/html;charset=utf-8">
              <script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
             </head>

             <body>

             <div id='pdf_top'></div>

             %s
             %s
             </body>
             <script>
               $(document).ready(function(){

                    $('%s').hide();

               })
             </script>
            </html>


        """
        try:
            rows=ci.db.query("select files.content,urls.title,urls.href from files inner join urls on files.href=urls.href where files.site='%s' order by urls.id" % self.site_name)
            for row in rows:
                if row['title']==None or row['content']==None:
                    continue
                md5=ci.md5(str(row['href']))
                tmp= h1 % (md5,row['title'].encode('utf-8','ignore'))
                catalog.append(tmp)
                tmp= h2 % (md5,row['title'].encode('utf-8','ignore'))
                txt=row['content'].encode('utf-8','ignore')
                rep = {r"<h4[^\>]*?>": "<h5>",r"</h4>": "</h5>",r"<h3[^\>]*?>": "<h4>",r"</h3>": "</h4>",
                       r"<h2[^\>]*?>": "<h3>",r"</h2>": "</h3>",r"<h1[^\>]*?>": "<h2>",r"</h1>": "</h2>",}
                for k,v in rep.iteritems():
                    txt = re.sub(k,v,txt)
                contents.append(content %(md5,tmp,txt) )
            is_show_cat=req.params.get('c','0')
            if hasattr(self,'selector_hidden'):
                hidden_selector=self.selector_hidden
            else:
                hidden_selector='.share5'
            if is_show_cat=='1':
                htmls=html % ( "<br>".join(catalog), "<br>".join(contents),hidden_selector)
            else:
                htmls=html % ( "<br>", "<br>".join(contents),hidden_selector)
            import platform
            if platform.system().lower()=='windows':
                open(self.site_name.encode('gbk','ignore')+'.html','w').write(htmls)
            else:
                open(self.site_name.encode('utf-8','ignore')+'.html','w').write(htmls)

        except Exception as er:
            ci.logger.error(er)
            pass
        msg='gen_html finish'
        print(msg)
        return msg


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
