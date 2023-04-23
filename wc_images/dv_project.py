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

    fire = request.args.get("fire")
    hit = request.args.get("hit")
    pok = request.args.get("pok")

    print(pok)

    filter_values = []

    if fire == 'true':
        filter_values.append('fire')

    if hit == 'true':
        filter_values.append('hit_and_run')

    if pok == 'true':
        filter_values.append('pok_rally')

    get_cloud(start_time, end_time, filter_values)
    return resp


def get_cloud(start, end, filter):
    initial = 20140123170000
    final = 20140123213445

    list1 = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/csv-1700-1830.csv",
                     encoding='unicode_escape')

    # list1 = [d for d in df if initial <= d['date'] <= start]
    list2 = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/csv-1831-2000.csv",
                     encoding='unicode_escape')

    # list2 = [d for d in df if start <= d['date'] <= end]
    list3 = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/csv-2001-2131.csv",
                     encoding='unicode_escape')

    # list3 = [d for d in df if end <= d['date'] <= final]
    # list3 = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/final_dataset.csv",
    #                  encoding='unicode_escape')

    print(filter)

    generate_cloud(list1, "wc-1", filter)
    generate_cloud(list2, "wc-2", filter)
    generate_cloud(list3, "wc-3", filter)


def generate_cloud(df, name, filter):
    filtered_df = df.loc[df['major_event'].isin(filter)]

    text = " ".join(filtered_df["message"].tolist())
    categories = df["major_event"].tolist()

    clean_text = text.replace('RT', '')
    colors = ["red", "green", "blue"]
    cmap = ListedColormap(colors)

    wordcloud = WordCloud(collocations=False, background_color='white', colormap=cmap, width=360,
                          height=360).generate_from_text(clean_text)

    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.show()

    wordcloud.to_file('wc_images/{}.png'.format(name))

    # flask --app wc_images/dv_project.py run --host=0.0.0.0 --port=80
