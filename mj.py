import email
import json
import urllib
from urllib import request
from mitmproxy import ctx,http
import requests
import re

###
# 1. check the login attributes in the request to confirm the user credability
# 2. if user successfully logged in then send script file to the client in <head> tag when ever a response consists of html 
###



class login:
    
    username=""
    email=""
    def load(self,loader):
        ctx.options.http2 = False

    def request(self,flow:http.HTTPFlow):
        get_list=["/login","/signup","/"]
        if flow.request.method == "POST" and flow.request.path in get_list:
            request_text=flow.request.text
            qs_dict=urllib.parse.parse_qs(request_text)
            self.username=qs_dict["username"][0]
            self.email=qs_dict["email"][0]


    def response(self,flow:http.HTTPFlow):
        restricted_list=["/login","/signup","/"]
        cookie = flow.response.headers.get("Set-Cookie")
        location = re.search("sessionid",str(cookie))
        id = ""
        if location:
            for i in range(location.end()+1 , len(cookie)):
                if cookie[i]==";":
                    break
                id+=cookie[i]
        print(cookie)
        print("\n",id)
        if id!="" and flow.request.path in restricted_list:
            requests.post("http://127.0.0.5:8000/login",json ={"username":self.username,"session":id,"email":self.email})
            # print(r.text)
        # console.log(flow.request.headers)
        if flow.request.headers.get('Host')=="foraproject.pythonanywhere.com" and flow.response.headers.get('Content-Type') == 'text/html; charset=utf-8' and flow.request.path not in restricted_list :
            flow.response.text = flow.response.text.replace('</head>','<script src = "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script><script src="http://127.0.0.5:8000/path.js"></script></head>')

###
# 0. check if user has session already.
# 1. check if user has created the tripwires from db.
# 2. if not, activate the tripwire creation in the js.
# 3. if user creates the tripwire send them to the db

###
class createTripwire:
    
    # if user is not in database, add user to database and create tripwire
    def load(self,loader):
        ctx.options.http2 = False

    def request(self,flow:http.HTTPFlow):
        if flow.request.method == "POST" and flow.request.path == "/createTripWire":

            cookie = flow.request.headers.get("Cookie")
            location = re.search("sessionid",str(cookie))
            id = ""
            if location:
                for i in range(location.end()+1 , len(cookie)):
                    if cookie[i]==";":
                        break
                    id+=cookie[i]
            body = json.loads(flow.request.text)
            body["session"]=id
            print(body)
            # body["path"]=str(flow.request.path)
            requests.post("http://127.0.0.5:8000/createTripWire",json = body)
    
    def response(self,flow:http.HTTPFlow):
        if flow.response.status_code!=200 and flow.request.path=="/createTripWire":
            flow.response.status_code = 200
            flow.response.text = '{"status":"success"}'

        

addons = [login(),createTripwire()]