#!/usr/bin/env python
# coding: utf-8

# In[76]:


import pandas as pd
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})


@app.route('/wordcloud')
def my_webservice():
    resp = make_response("hello")
    resp.headers['Access-Control-Allow-Origin'] = 'http://localhost:63343/'
    get_cloud()
    return resp


def get_cloud():
    df = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/csv-1700-1830.csv", encoding= 'unicode_escape')

    text = " ".join(df["message"].tolist())
    categories = df["major_event"].tolist()


    colors = ["red", "green", "blue"]
    cmap = ListedColormap(colors)

    wordcloud = WordCloud(collocations = False, background_color = 'white',colormap=cmap,width = 360, height = 360).generate_from_text(text)


    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.show()


    wordcloud.to_file('wc_images/wc3-1.png')
