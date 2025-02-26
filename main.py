import requests
import bs4

# Fetch and parse the Wikipedia page for the list of highest-grossing films
page = bs4.BeautifulSoup(requests.get('https://en.wikipedia.org/wiki/List_of_highest-grossing_films').text, 'html.parser')

# Find the table containing the film data
table = page.find('table', class_='wikitable')
body = table.find('tbody')
rows = body.find_all('tr')

films = []

# Extract film details from each row
for i in rows[1:]:
    tds = i.find_all('td')
    film = {'title': i.find('th').text.strip(), 'worldwide gross': tds[2].text.strip(), 'year': int(tds[3].text.strip())}
    films.append(film)

    # Fetch and parse the individual film's Wikipedia page
    link = 'https://en.wikipedia.org' + (i.find('th').find('i').find('a').get('href'))
    film_page = bs4.BeautifulSoup(requests.get(link).text, 'html.parser')
    film_table = film_page.find('table', class_='infobox vevent')
    trs = film_table.find_all('tr')

    # Extract and clean countries and directors
    film['countries'] = trs[-4].text.strip()
    film['directors'] = trs[2].text.strip()[11:]
    if 'Countries' in film['countries']:
        film['countries'] = film['countries'][9:]
    else:
        film['countries'] = film['countries'][7:]
    film['countries'] = film['countries'].strip().replace('[', '').replace(']', '')
    for ii in range(0, 10):
        film['countries'] = film['countries'].replace(str(ii), '')
    film['countries'] = film['countries'].replace('\n', ', ')
    film['worldwide gross'] = film['worldwide gross'][film['worldwide gross'].index('$'):]
    film['directors'] = film['directors'].strip().replace('\n', ', ')

# Save the film data to a JSON file
import json
with open('films.json', 'w') as file:
    json.dump(films, file, indent=4)

# Store the film data in an SQLite database
import sqlite3
conn = sqlite3.connect('films.db')
cursor = conn.cursor()

def insert(film):
    query = f'INSERT INTO films (title, year, directors, box_office_revenue, country_of_origin) VALUES ("{film['title']}", "{film['year']}", "{film['directors']}", "{film['worldwide gross']}", "{film['countries']}");'
    cursor.execute(query)

# Drop and recreate the films table
cursor.execute('DROP TABLE IF EXISTS films;')
cursor.execute('''
CREATE TABLE IF NOT EXISTS films(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    directors TEXT,
    box_office_revenue TEXT,
    country_of_origin TEXT
);
''')

# Insert each film into the database
for i in films:
    insert(i)

conn.commit()
conn.close()

# The following code is commented out but can be used to query and print the films table
# import sqlite3
# conn = sqlite3.connect('films.db')
# cursor = conn.cursor()
# cursor.execute('SELECT * FROM films')
# rows = cursor.fetchall()
# print("id | title                        | release_year | director                | box_office   | country")
# print("-" * 80)
# for row in rows:
#     print(f"{row[0]:<3} | {row[1]:<28} | {row[2]:<12} | {row[3]:<23} | {row[4]:<12} | {row[5]}")
# conn.close()