__author__ = 'Administrator'


from codeigniter import ci



class KanKanDou(object):


    def get_urls(self,req,resp):
        import requests
        import json
        for i in range(2,300):
            import requests
            url='''http://127.0.0.1:8080/api/'''
            header=''''''
            body='''url:http://kankandou.com/book/page/%s
            jscode:href_data('.list .o-name')
            page:
            timeout:1000
            posturl:
            js:0'''%(i)
            jscode=''''''
            posturl=''''''#js server phantomjs
            data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl}
            jdata=requests.post('http://127.0.0.1:8005/api/request',data).text
            jdata=json.loads(jdata)
            for d in jdata:
                d['site']='KanKanDou'
                d['status']='0'
                d['level']='1'
                ci.db.insert('urls',d)


    def down_file(self,req,resp):
        rows= ci.db.query("select * from urls where status=0 and site='KanKanDou'")
        import requests
        import json
        for row in rows:
            url='''http://127.0.0.1:8080/api/'''
            header=''''''
            body='''url:%s
            jscode:href_data('.file')
            page:
            timeout:1000
            posturl:
            js:0'''%(row['href'])
            jscode=''''''
            posturl='''http://127.0.0.1:8080/api/'''#js server phantomjs
            data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl}
            jdata=requests.post('http://127.0.0.1:8005/api/request',data).text
            jdata=json.loads(jdata)
            for d in jdata:
             # d['site']='KanKanDou'
                d['status']='0'
                ci.db.insert('files',d)






