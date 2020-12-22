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
		window = self.window
		self.getAllBibs() if len(self.items) == 0 else self.showNewMenu()	

	def getAllBibs(self):
		window = self.window
		sel = window.active_view().sel()
		thread = BibManagerApiCall('')
		thread.start()
		thread.join()
		self.response = json.loads(thread.result.decode())['results']	
		self.setItemsList();
		self.showNewMenu() 

	def setItemsList(self):
		for item in self.response:
			self.items.append(item)		

	def setBibList(self):
		parsedItems = []
		for item in self.items:
			str1st = ''
			str2nd = ''
			if 'title' in item:
				str1st = item['title']
			if 'author' in item:
				str2nd = item['author']
			parsedItems.append([str1st + ' ('+item['tag']+')', str2nd])
		self.biblist = parsedItems

	def showNewMenu(self):
		window = self.window	
		if len(self.biblist) == 0:
			self.setBibList()			
		window.show_quick_panel(self.biblist, self.selectBib)

	def selectBib(self,item):
		coursors = [pos.a for pos in self.window.active_view().sel()]		
		if item > -1:
			self.window.active_view().run_command('insertbib',{"currbib":self.items[item],"coursors": coursors})


class BibManagerApiCall(threading.Thread):
	def __init__(self, request):
		self.query = urllib.parse.urlencode({'searchstring':request})
		self.result = None
		self.url = 'https://ajb8ltqjkg.execute-api.eu-central-1.amazonaws.com/dev/all'
		threading.Thread.__init__(self)

	def run(self):
		with urllib.request.urlopen(self.url) as response:
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
		path_dir = '\\'.join(path_str_file[:len(path_str_file)-1])
		try:
			bibfile = open(path_dir+'\\local_bib.bib')
			self.file_content = bibfile.read()
			bibfile.close()
		except FileNotFoundError as e:
			bibfile = open(path_dir+'\\local_bib.bib','w')
			bibfile.close()

		with open(path_dir+'\\local_bib.bib','a') as bibfile:			
			json_version = self.jsonToBib(currbib)
		
			if self.file_content.count(json_version)==0:
				bibfile.write(json_version)
