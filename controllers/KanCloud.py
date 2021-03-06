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

class KanCloud(object):

    def __init__(self):
        self.tasks={}

    def get_urls(self,req,resp):
        if self.tasks.get(__name__())!=None:
            return '%s has start'%(__name__())
        else:
            self.tasks[__name__()]=__name__()

        import gevent
        jobs=[]
        queue=Queue.Queue(10000)
        for i in range(2,404):
            queue.put(i)
        for i in range(0,20):
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
        rows= ci.db.query("select * from urls where status=0 and site='KanCloud'")
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
        rows= ci.db.query("select * from files where status=0 and site='KanCloud'")
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
                        url='''http://www.kancloud.cn/explore?page=%s'''%(i)
                        header=''''''
                        body=''''''
                        jscode='''href_data('.m-manual-list dd')'''
                        posturl=''''''#js server phantomjs
                        data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':0}
                        jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                        jdata=json.loads(jdata)
                        for d in jdata:
                            d['site']='KanCloud'
                            d['status']='0'
                            d['level']='1'
                            ci.db.insert('urls',d)
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
                    # url=row['href']
                    # header=''''''
                    # body=''''''
                    # jscode='''href_data('.file')'''
                    # posturl=''''''#js server phantomjs
                    # data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':'0'}
                    # jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                    # jdata=json.loads(jdata)
                    # for d in jdata:
                    #     d['site']='KanKanDou'
                    #     d['status']='0'
                    #     d['title']=d['title'].split("\t")[0]
                    #     if len(d['title'].split('.'))==2:
                    #         d['ftype']=d['title'].split('.')[1]
                    #     ci.db.insert('files',d)
                    #     ci.db.update('urls',{'status':1}, {'href':row['href']})
                    #     # time.sleep(0.001)

                    for i in range(0,1):
                        try:
                            import requests
                            import json
                            url=row['href']
                            header=''''''
                            body=''''''
                            jscode='''a=DATACACHELIST

                    l=[]
                    $('.menu-link').each(function(){

                      l.push($(this).attr('data-type'))

                    })

                    b={'config':a.CONFIG,'filetype':l}
                    b'''
                            posturl=''''''#js server phantomjs
                            data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl}
                            jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                            jdata=json.loads(jdata)
                            d={}
                            d['title']=jdata['config']['bookTitle']
                            d['href']= jdata['config']['bookId']
                            d['ftype']=','.join(jdata['filetype'])
                            d['site']='KanCloud'
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



    def _download_files(self,queue):
        import time
        import requests
        import json
        while True:
            try:
                row=queue.get()
                try:
                    # book_id=8594&type=mobi
                    ftype=row['ftype']
                    ftypes=[]
                    if ftype==None or ftype=='':
                        continue
                    else:
                        ftypes=ftype.split(',')

                    book_id=row['href']

                    for type in ftypes:

                        url=requests.post('http://www.kancloud.cn/book/export/download',data={'book_id':book_id,'type':type}).text
                        url=json.loads(url)['url']
                        r = requests.get(url, stream=True)
                        with open("H:/KanCloud/"+ row['title']+'.'+type, 'wb') as f:
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
