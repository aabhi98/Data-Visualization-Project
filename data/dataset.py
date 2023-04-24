import hashlib
import itertools
import json

import pandas

count_map = {}
nodes = []
event_map = {}
event_counter = 0


def get_author_dict(authors, authors_grp):
    author_dict = {}
    for author in authors:
        author_lower = author.lower()
        author_id = int(hashlib.sha256(author.encode('utf-8')).hexdigest(), 16) % 4
        author_grp = authors_grp[author_lower]
        author_dict[author_lower] = (author_id, author_grp)
    return author_dict


def process_authors_count(authors):
    size = len(authors)
    for author in authors:
        author_lower = author.lower()
        if author_lower in count_map.keys():
            count_map[author_lower] = count_map[author_lower] + size - 1
        else:
            count_map[author_lower] = size - 1


def get_nodes(authors, authors_dict):
    for author in authors:
        author_id, author_grp = authors_dict[author.lower()]
        nodes.append({"name": author, "n": count_map[author], "grp": event_map[author_grp], "id": author})


if __name__ == '__main__':
    dataset = pandas.read_csv('./final_dataset.csv', encoding='unicode_escape')

    # randomly select 1000 rows from the dataset
    sampled_dataset = dataset.sample(n=150, random_state=42)

    grouped = sampled_dataset.groupby(sampled_dataset['major_event'].str.lower())['author'].apply(lambda x: x.dropna().unique()).reset_index()

    key_value_pairs = []

    for author_list in grouped['author']:
        authors_values = list(author_list)
        process_authors_count(authors_values)
        pairs = list(itertools.combinations(authors_values, 2))
        key_value_pairs.append([{'source': pair[0], 'target': pair[1], 'value': 1} for pair in pairs])

    authors_grp = dict(zip(dataset['author'].str.lower(), dataset['major_event'].str.lower()))

    for event in authors_grp.values():
        if event not in event_map:
            event_map[event] = event_counter
            event_counter += 1
    print("event map",event_map)
    print(set(authors_grp.values()))
    authors_dict = get_author_dict(count_map.keys(), authors_grp)

    get_nodes(count_map.keys(), authors_dict)

    flat_key_pairs = list(itertools.chain(*key_value_pairs))

    final_dataset = {"nodes": nodes, "links": flat_key_pairs}

    print(final_dataset['links'])

    with open('final_dataset.json', 'w') as f:
        json.dump(final_dataset, f)
