import sublime
import sublime_plugin
import urllib
import threading
import json
import os

class bibmanagerCommand(sublime_plugin.WindowCommand):
	response = []
	items = []
	biblist = []
	def run(self):
		self.items = []
		window = self.window
		window.show_input_panel('Введите параметры запроса','', self.sendRequest,None,None)
		#window.show_quick_panel(self.biblist, self.sendRequest)

	def sendRequest(self,requestString):
		sel = self.window.active_view().sel()
		thread = BibManagerApiCall(requestString)
		thread.start()
		thread.join()
		self.response = json.loads(thread.result.decode())['results']	
		print(self.response)
		self.setItemsList();
		self.showNewMenu()	

	def setItemsList(self):
		for item in self.response:
			self.items.append(item)		

	def showNewMenu(self):
		window = self.window
		window.show_quick_panel([[item['title']+' ('+item['tag']+')',item['author']] for item in self.items], self.selectBib)

	def selectBib(self,item):
		coursors = [pos.a for pos in self.window.active_view().sel()]		
		self.window.active_view().run_command('insertbib',{"currbib":self.items[item],"coursors": coursors})


class BibManagerApiCall(threading.Thread):
	def __init__(self, string):
		self.query = urllib.parse.urlencode({'searchstring':string})
		self.result = None
		self.url = 'https://ajb8ltqjkg.execute-api.eu-central-1.amazonaws.com/dev/bib'
		threading.Thread.__init__(self)

	def run(self):
		print(self.query)
		with urllib.request.urlopen('{url}?{query}'.format(url=self.url,query=self.query)) as response:
			print('It works')
			self.result = response.read()
			return
		
		sublime.error_message(err)
		self.result = False	


class insertbibCommand(sublime_plugin.TextCommand):
	path_to_bibfile = None


	def jsonToBib(self,dict):
		dict['type'] = '@'+dict['type']
		key_val_pairs = []
		key_val_pairs.append('{'.join([dict['type'],dict['tag']]))
		for key,val in dict.items():
			if(key!= 'type') and (key!='tag'):
				key_val_pairs.append(' = {'.join([key,val])+ '}') 

		return ',\n'.join(key_val_pairs)+'\n}\n'		

	def run(self,edit,currbib,coursors):
		for pos in coursors:
			self.view.insert(edit,pos,currbib['tag'])
		self.file_content = ''
		path_str_file = self.view.file_name().split('\\')		
		print(path_str_file)
		path_dir = '\\'.join(path_str_file[:len(path_str_file)-1])
		print(path_dir)
		
		with open(path_dir+'\\local_bib.bib') as bibfile:
			self.file_content = bibfile.read()

		with open(path_dir+'\\local_bib.bib','a') as bibfile:			
			print('File content' + self.file_content)
			json_version = self.jsonToBib(currbib)
			if self.file_content.count(json_version)==-1:
				bibfile.write(json_version)
	
