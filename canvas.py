# -*- coding: utf-8 -*-
import random

import cherrypy

from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from ws4py.server.handler.threadedhandler import WebSocketHandler, EchoWebSocketHandler

class ChatWebSocketHandler(WebSocketHandler):
    def received_message(self, m):
        cherrypy.engine.publish('websocket-broadcast', str(m))
        print(str(m))

class Root(object):
    @cherrypy.expose
    def index(self):
        return """<html>
    <head>

<style>
body{margin: 0; padding: 0;
background-color:fafafa;}
body, html { 
height:100%;
}

</style>
<link href='http://fonts.googleapis.com/css?family=Delius+Unicase|Vidaloka|Questrial|Comfortaa|Rationale|Geostar+Fill|Rokkitt|Buda:300' rel='stylesheet' type='text/css'>
      <script type='application/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js'> </script>
      <script type='application/javascript'>
        
         </script>
    </head>
    <body>

<!-- Import JavaScript Libraries. -->
<script type="text/javascript" src="http://zombilical.org/swfobject.js"></script>
<script type="text/javascript" src="http://zombilical.org/web_socket.js"></script>

<script type="text/javascript">

  // Let the library know where WebSocketMain.swf is:
  WEB_SOCKET_SWF_LOCATION = "http://zombilical.org/WebSocketMainInsecure.swf";

</script>

     <div position:relative>
    <canvas id="c" width=1000px height=600px  style="z-index: 2;
    position:absolute;
    left:0px;
    top:0px;" ></canvas>
   <canvas id="c3" width=1000px height=600px  style="z-index: 1;
    position:absolute;
    left:0px;
    top:0px; "></canvas>
<canvas id="c2" width=1000px height=600px  style="z-index: 0;
    position:absolute;
    left:0px;
    top:0px; "></canvas>

  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
  <script type="text/javascript" src="http://zombilical.org/canvas.js"/>
</script>

    </body>
    </html>
    """ 

    @cherrypy.expose
    def ws(self):
        cherrypy.log("Handler created: yippi")

if __name__ == '__main__':
    cherrypy.config.update({'server.socket_host': '88.191.130.110',
                            'server.socket_port': 9000})
    WebSocketPlugin(cherrypy.engine).subscribe()
    cherrypy.tools.websocket = WebSocketTool()

    cherrypy.quickstart(Root(), '', config={
        '/ws': {
            'tools.websocket.on': True,
            'tools.websocket.handler_cls': ChatWebSocketHandler
            }
        }
    )
