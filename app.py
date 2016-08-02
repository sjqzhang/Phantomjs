#!/usr/bin/env python
# -*- coding:utf8 -*-
__author__ = 'xiaozhang'
from codeigniter.system.core.CI_Application import CI_Application

def main():
    app=CI_Application(r'./')

    app.start_server()

if __name__ == '__main__':
    main()
