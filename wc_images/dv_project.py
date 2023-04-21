#!/usr/bin/env python
# coding: utf-8

# In[76]:


import pandas as pd
from wordcloud import WordCloud
import matplotlib

matplotlib.use('Agg')

import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})


@app.route('/wordcloud')
def my_webservice():
    resp = make_response("hello")

    start_time = request.args.get('param1')
    end_time = request.args.get('param2')

    get_cloud(start_time, end_time)
    return resp


def get_cloud(start, end):
    initial = 20140123170000
    final = 20140123213445

    filter_values = ['fire', 'spam', 'pok_rally', 'chatter']
    df = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/final_dataset.csv",
                     encoding='unicode_escape')

    # list1 = [d for d in df if initial <= d['date'] <= start]
    list1 = df.loc[initial <= df['date'] <= start]

    # list2 = [d for d in df if start <= d['date'] <= end]
    list2 = df.loc[start <= df['date'] <= end]

    # list3 = [d for d in df if end <= d['date'] <= final]
    list3 = df.loc[end <= df['date'] <= final]

    generate_cloud(list1, "wc-1")
    generate_cloud(list2, "wc-2")
    generate_cloud(list3, "wc-3")


def generate_cloud(df, name):
    text = " ".join(df["message"].tolist())
    categories = df["major_event"].tolist()

    colors = ["red", "green", "blue"]
    cmap = ListedColormap(colors)

    wordcloud = WordCloud(collocations=False, background_color='white', colormap=cmap, width=360,
                          height=360).generate_from_text(text)

    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.show()

    wordcloud.to_file('wc_images/{}.png'.format(name))

    # flask --app wc_images/dv_project.py run --host=0.0.0.0 --port=80
