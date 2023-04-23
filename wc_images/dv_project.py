#!/usr/bin/env python
# coding: utf-8

# In[76]:


import pandas as pd
from wordcloud import WordCloud
import matplotlib
import os

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

    print("returning before saving")
    return resp


def get_cloud(start, end, filter):
    initial = 20140123170000
    final = 20140123213445

    df = pd.read_csv("/Users/sai/projects/Abhishek-Dileep-Naga-Nagaraju-Sai-Sumedha/data/final_dataset.csv",
                     encoding='unicode_escape')

    filter_loc = df.iloc

    list1 = [d for d in filter_loc if initial <= int(d['date']) <= int(start)]

    list2 = [d for d in filter_loc if int(start) <= int(d['date']) <= int(end)]

    list3 = [d for d in filter_loc if int(end) <= int(d['date']) <= final]

    generate_cloud(list1, "wc1", filter)
    generate_cloud(list2, "wc2", filter)
    generate_cloud(list3, "wc3", filter)


def generate_cloud(df, name, filter):
    path = "wc_images"

    file_path = os.path.join(path, name)

    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"{name} deleted successfully")
    else:
        print(f"{name} does not exist")

    filtered_df = [obj for obj in df if obj['major_event'] in filter]

    pattern = r'(@\w+|#\w+|\bRT\b|\bKronosStar\b|\b#POKRally\b|\b#Kronos\b)'

    text = " ".join(d['message'] for d in filtered_df)
    # categories = df["major_event"].tolist()

    clean_t = text.replace('RT', '')
    clean_text = clean_t.replace(pattern, '')
    colors = ["red", "green", "blue"]
    cmap = ListedColormap(colors)

    wordcloud = WordCloud(collocations=False, background_color='white', colormap=cmap, width=360,
                          height=360).generate_from_text(clean_text)

    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.show()

    wordcloud.to_file('wc_images/{}.png'.format(name))
    print("returning after saving")

    # flask --app wc_images/dv_project.py run --host=0.0.0.0 --port=80
