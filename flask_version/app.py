#!/usr/bin/python
from flask import Flask, request, render_template, url_for, redirect
import urllib2,json
import json

app = Flask(__name__)

users = 0

@app.route("/")
def index():
    global users
    users += 1
    
    if ( users %2 == 0 ):
        return render_template("game.html")
    else:
        return render_template("index.html", user=users)

@app.route("/game")
def game():
    return render_template("game.html")

'''
@app.route("/classview", methods = ["POST", "GET"])
def classview():
    cls = request.form["classname"]    
    return render_template("classview.html", clsname = cls)

@app.route("/loadclass", methods = ["POST"])
def loadclass():
    clsn = request.form["classname"]
    nameParts = clsn.split("-")
    mydb = db.db()
    cls = mydb.getClass( (nameParts[0], nameParts[1], nameParts[2] ) )
    return json.dumps( cls[0]["students"] )


@app.route("/selectclass")
def selectclass():
    return render_template("selectclass.html")

@app.route("/loadselect", methods = ["POST"])
def loadselect():
    mydb = db.db();
    return json.dumps( mydb.getClasses("DYRLAND") )
'''

if __name__=="__main__":
    app.debug=True
    app.run()
