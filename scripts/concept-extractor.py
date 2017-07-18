#!/usr/bin/env python3
import sys
import os
from bs4 import BeautifulSoup
import urllib
import requests
import json
from io import open as iopen
import re
from stop_words import get_stop_words
import networkx as nx
from networkx.readwrite import json_graph


stop_words = get_stop_words('de')

def cleanXMLTagContent(stripped_text):
	text = re.sub(r'\n\s*\n', r' ', stripped_text, flags=re.M)
	return ' '.join(text.split())

# if not os.path.exists(conference_download_dir):
# 	os.makedirs(conference_download_dir)

concept_regex = re.compile(r"mconcept|concept:(.*)")

with iopen('./frage-fragebogen-full-tgd01.xml') as frage_file,\
	 iopen('./dboe-concept-features-fs-lod-tei.xml') as concepts_file:
	
	#Read the xml
	xml_soup = BeautifulSoup(frage_file,'lxml')
	concepts_soup = BeautifulSoup(concepts_file, 'lxml')

	questionnaires = xml_soup.find_all('list', attrs={"n":True})
	words = xml_soup.find_all('seg', attrs={"xml:id":True})
	global_concepts = xml_soup.find_all('interp', attrs={"corresp":True})


	def f(x): 
		return x is not None and x not in stop_words and "." not in x and len(x) > 1

	question_words = list(filter(f,words))

	question_words_set = set(question_words)

	print(str(len(question_words)))
	print(str(len(question_words_set)))

	print('There are {} questionnaires'.format(len(questionnaires)))
	print('There are {} words'.format(len(words)))
	print('There are {} concepts'.format(len(global_concepts)))

	for questionnaire in questionnaires:
		G=nx.Graph()
		questionnaire_obj = {}
		items = questionnaire.find_all('item')
		print('Questionnaire {} has {} questions'.format(questionnaire.label.string,len(items)))
		for item in items:
			concepts = item.find_all('seg', attrs={"xml:id":True})
			if len(concepts) > 0:
				# print('Question {} relates to the following concepts:'.format(item.get('n')))
				concepts_set = set()
				for concept in concepts:
					# print(concept.string)
					if f(concept.string):
						concepts_set.add(concept.string)
					# result = concept_regex.match(concept.get('corresp'))
					# if result is not None:
					# 	concept_entry = concepts_soup.find('fs', attrs={"xml:id":result.group(1)})
					# 	concepts_set.add(result.group(1))
				# print(concepts_set)
	
				G.add_node(item.get('n'), concepts=[concept for concept in concepts_set])
				for key, val in questionnaire_obj.items():
					coincidences = concepts_set.intersection(val)
					if len(coincidences) > 0:
						# print(concepts_set, val, coincidences)
						G.add_edge(item.get('n'), key, weight=len(coincidences), coincidences=[coincidence for coincidence in coincidences])
				questionnaire_obj[item.get('n')] = concepts_set

		data = json_graph.node_link_data(G)
		concepts_set = set()
		for node in data['nodes']:
			for concept in node['concepts']:
				concepts_set.add(concept)

		print('There are {} different concepts'.format(len(concepts_set)))

		with iopen('../data/{}-graph.json'.format(questionnaire.label.string.replace(" ","").lower()),'w', encoding='utf-8') as jsonfile:
			json.dump(data, jsonfile, ensure_ascii=False, sort_keys=True, indent=4, separators=(',', ': '))

		

	

	# def f(x): 
	# 	return x not in stop_words and "." not in x



	# question_words = list(filter(f,[question.string.lower() for question in questions if question.string is not None]))

	# question_words_set = set(question_words)

	# print(str(len(question_words)))
	# print(str(len(question_words_set)))




	# #Extract the xml URL 
	# xml_href = line.get('href')
	# xml_filename = xml_href.split('/')[-1]
	# abstract_xml = requests.get(base_url + xml_href)
	# tei_soup = BeautifulSoup(abstract_xml.content,'lxml-xml')

	# #Analyze keywords and/or title 
	# keywords = []
	# for keyword in tei_soup.find("keywords", attrs={"scheme": "ConfTool", "n": "keywords"})\
	# 			.find_all('term'):
	# 			keywords.append(keyword.string.lower())

	# should_include = False
	# for inclusion_term in inclusion_terms:
	# 	if any(inclusion_term in s for s in keywords):
	# 		should_include = True
	# 		break

	# if should_include:
	# 	print ('Keyword match!')
	# 	xml_id = xml_filename.replace(".xml", "")
	# 	article_download_dir = conference_download_dir + '/' + str(abstract_id)
	# 	image_downloads_dir = article_download_dir + '/' + xml_id + '/'

	# 	#Check if already processed
	# 	if not os.path.exists(article_download_dir):
	# 		os.makedirs(article_download_dir)
	# 		os.makedirs(image_downloads_dir)
	# 	#else continue

	#     #Save XML
	# 	with iopen(article_download_dir + '/' + xml_filename, 'wb') as file:
	# 		file.write(abstract_xml.content)
	# 		file.close()


	# 	#if matches then extract fields
	# 	#authors and affiliation
	# 	abstract_json = {}
	# 	abstract_json["authors"] = []
	# 	abstract_json["title"] = tei_soup.find("titleStmt").find("title").string
	# 	author_cursor = tei_soup.find("titleStmt").find_all("author")

	# 	num_authors = 0
	# 	for author in author_cursor:
	# 		authorObj = {}
	# 		authorObj["surname"] = author.find("persName").find("surname").string
	# 		authorObj["forename"] = author.find("persName").find("forename").string
	# 		authorObj["email"] = author.find("email").string
	# 		authorObj["affiliation"] = author.find("affiliation").string
	# 		authorObj["affiliation_geo"] = geocoder.google(authorObj["affiliation"]).json
	# 		abstract_json["authors"].append(authorObj)

	# 	abstract_json["keywords"] = keywords
	# 	abstract_json["conference"] = conference_name
	# 	abstract_json["conference_year"] = conference_year

	# 	topics = []
	# 	for topic in tei_soup.find("keywords", attrs={"scheme": "ConfTool", "n": "topics"})\
	# 			.find_all('term'):
	# 			topics.append(topic.string.lower())
	# 	abstract_json["topics"] = topics

		
	# 	#Retrieve images
	# 	for figure in tei_soup.find("text").find("body").find_all("figure"):
	# 		image_path = figure.find("graphic").get("url")
	# 		image_name = image_path.split('/')[-1]
	# 		image_url = base_url + '/static/data/' + image_path
			
	# 		if os.path.isfile(image_downloads_dir + image_name):
	# 			print("Image already exists, skipping...")
	# 			continue

	# 		i = requests.get(image_url) 
	# 		if i.status_code == requests.codes.ok:
	# 			with iopen(image_downloads_dir + image_name, 'wb') as file:
	# 				file.write(i.content)
	# 				file.close()
	# 		else:
	# 			print('Failed to download image')

	# 		figure.extract()

	# 	#Retrieve main text
	# 	text = cleanXMLTagContent(tei_soup.find("text").find("body").get_text().strip())
		
	# 	abstract_json["text"] = text

	# 	#References
	# 	reg = re.compile(r'(.*) \((\d{4})\)\. (.*)\.')

	# 	abstract_json["bibliography"] = []
	# 	listBibl = tei_soup.find("listBibl")
	# 	if (listBibl != None):
	# 		for bib_entry in listBibl.find_all("bibl"):
	# 			bib_entry_json = {}
	# 			bib_entry_json["original_text"] = cleanXMLTagContent(bib_entry.get_text().strip())
	# 			# search_query = scholarly.search_pubs_query(bib_entry_json["original_text"])
	# 			# bib_entry_json["gscholar"] = str(next(search_query).fill())
	# 			print(bib_entry_json["original_text"])
	# 			match = reg.match(bib_entry_json["original_text"])
	# 			biblfile.write(abstract_id + ' ' + bib_entry_json["original_text"] + '\n')
	# 			# print(match.group(1))
	# 			# print(match.group(2))
	# 			# print(match.group(3))
	# 			# doc_srch = ElsSearch('"' + match.group(3) + '"','scopus')
	# 			# doc_srch.execute(client, get_all = True)
	# 			# print (doc_srch.results)
	# 			print('###########')
	# 			abstract_json["bibliography"].append(bib_entry_json)

	# 		# print(abstract_json)
	# 		#Finally save JSON
	# 		with iopen(article_download_dir + '/' + xml_id + '.json' ,'w', encoding='utf-8') as jsonfile:
	# 			json.dump(abstract_json, jsonfile, ensure_ascii=False)

	# else:
	# 	print('No keyword match')

	# progressfile.seek(0)
	# progressfile.write(str(abstract_id))
	# progressfile.truncate()
	frage_file.close()

#^.*, (.*\d$)*  Pages


