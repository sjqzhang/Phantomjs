__author__ = 'Administrator'


from codeigniter import ci


import Queue




class KanKanDou(object):
    _queue=Queue.Queue(10000)
    def init(self,req,resp):
        import gevent
        jobs=[]
        for i in range(0,60):
            jobs.append(gevent.spawn(self.get_urls))
        for i in range(2,404):
            self._queue.put(i)
        gevent.joinall(jobs)


    def get_urls(self):
        while True:
            import requests
            import json
            try:
                i=self._queue.get(timeout=3)
                if i!=None:
                    try:
                        import requests
                        url='''http://kankandou.com/book/page/%s'''%(i)
                        header=''''''
                        body=''''''
                        jscode='''href_data('.list .o-name ')'''
                        posturl=''''''#js server phantomjs
                        data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':0}
                        jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                        jdata=json.loads(jdata)
                        for d in jdata:
                            d['site']='KanKanDou'
                            d['status']='0'
                            d['level']='1'
                            ci.db.insert('urls',d)
                    except Exception as er:
                        ci.logger.error(er)
                else:
                    break
            except Exception as er:
                pass


    def down_file(self):
        import time
        while True:
            rows= ci.db.query("select * from urls where status=0 and site='KanKanDou' ORDER BY RANDOM()  limit 1 ")
            import requests
            import json
            if len(rows)>0:
                row=rows[0]
                try:
                    import requests
                    import json
                    url=row['href']
                    header=''''''
                    body=''''''
                    jscode='''href_data('.file')'''
                    posturl=''''''#js server phantomjs
                    data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl,'js':'0'}
                    jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
                    jdata=json.loads(jdata)
                    for d in jdata:
                        d['site']='KanKanDou'
                        d['status']='0'
                        d['title']=d['title'].split("\t")[0]
                        if len(d['title'].split('.'))==2:
                            d['ftype']=d['title'].split('.')[1]
                        ci.db.insert('files',d)
                        ci.db.update('urls',{'status':1}, {'href':row['href']})
                        # time.sleep(0.001)
                except Exception as er:
                    pass
                    #ci.logger.error(er)
            else:
                break



    def start(self,req,resp):
        import gevent
        # joblist=[lambda x:gevent.spawn(self.down_file) for i in range(0,40)]
        jobs=[]
        for i in range(0,40):
            jobs.append(gevent.spawn(self.down_file))
        gevent.joinall(jobs)

    def download(self,req,resp):
        import gevent
        # joblist=[lambda x:gevent.spawn(self.down_file) for i in range(0,40)]
        jobs=[]
        for i in range(0,20):
            jobs.append(gevent.spawn(self._download))
        gevent.joinall(jobs)


    def _download(self):
        import time
        while True:
            rows= ci.db.query("select * from files where status=0 and site='KanKanDou' ORDER BY RANDOM()  limit 1 ")
            import requests
            import json
            if len(rows)>0:
                row=rows[0]
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
                    #ci.logger.error(er)
            else:
                break