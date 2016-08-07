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

class JRJ(object):

    def __init__(self):
        self.tasks={}

    def get_urls(self,req,resp):
        # if self.tasks.get(__name__())!=None:
        #     return '%s has start'%(__name__())
        # else:
        #     self.tasks[__name__()]=__name__()
        #
        # import gevent
        # jobs=[]
        # queue=Queue.Queue(10000)
        # for i in range(1,100):
        #     queue.put(i)
        # for i in range(0,20):
        #     jobs.append(gevent.spawn(self._get_urls,queue))
        # gevent.joinall(jobs)
        self._get_urls(None)


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
        rows= ci.db.query("select * from urls where status=0 and site='JRJ'")
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
        rows= ci.db.query("select * from files where status=0 and site='JRJ'")
        for row in rows:
            queue.put(row)
        jobs=[]
        for i in range(0,20):
            jobs.append(gevent.spawn(self._download_files,queue))
        gevent.joinall(jobs)


    def _get_urls(self,queue):
        for i in range(0,1):
            try:
                import requests
                import json
                url='''http://v.jrj.com.cn/newlist2015/tzwsp_all-1.shtml'''
                header=''''''
                body=''''''
                jscode='''l=[]
        level=''
        $('h3,ul','li').each(function(i){

        if(i%2==0) {
           level=$(this).text().trim()
        } else {
           items=href_data($(this))
           for(var j=0;j<items.length;j++) {
             items[j]['level']=level
          }
          l.push(items)
        }



        })

        l'''
                posturl='''http://127.0.0.1:8080/api/'''#js server phantomjs
                data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl}
                jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                jdata=json.loads(jdata)
                for l in jdata:
                    for d in l:
                        d['site']='JRJ'
                        d['status']='0'
                        # d['level']='1'
                        print d
                        ci.db.insert('urls',d)
            except Exception as er:
                print(er)
                pass
                #ci.logger.error(er)



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
                    for i in range(0,1):
                        try:
                            import requests
                            import json
                            url=row['href']
                            header=''''''
                            body=''''''
                            jscode='''videoURL'''
                            posturl=''''''#js server phantomjs
                            data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':'0'}
                            jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                            # jdata=json.loads(jdata)
                            d={}
                            d['href']= jdata
                            d['title']= row['title']
                            d['ftype']=row['level']
                            d['site']='JRJ'
                            d['status']='0'
                            ci.db.insert('files',d)
                            ci.db.update('urls',{'status':1}, {'href':row['href']})

                        except Exception as er:
                            pass
                            #ci.logger.error(er)

                except Exception as er:
                    #pass
                    ci.logger.error(er)
            except Exception as er:
                pass


    def filename(self,fn=''):
        s=r'\\|"/:;?*&^%!~+=,'
        for i in s:
            fn=fn.replace(i,'')
        return fn

    def _download_files(self,queue):
        import time
        import requests
        import json
        import os
        while True:
            try:
                row=queue.get()
                try:
                    r = requests.get(row['href'], stream=True)
                    # print("正在下载","I:/JRJ/"+ row['title']+'.pdf')
                    p='E:/jrj/'
                    d= p+ self.filename( row['ftype'])
                    if not os.path.isdir(d):
                        os.mkdir(d)
                    with open(d+'/'+ self.filename(row['title']) +'.mp4', 'wb') as f:
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
