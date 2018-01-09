# Extracting public profile:
# python profile.py -u http://www.linkedin.com/in/toxtli
#
# Extracting user from a logged in account:
# python profile.py -u http://www.linkedin.com/in/toxtli -c linkedin-config

import sys
import time
import json
import getopt
from LinkedinController import LinkedinController

def auto(url,config_file):
	linkedinTool = LinkedinController(config=config_file, debug=True)
	profile = linkedinTool.extractProfile(url)
	linkedinDataFile = open(profile['NAME'] + ".json", "w")
	linkedinDataFile.write(json.dumps(profile, indent=4, sort_keys=True))
	linkedinDataFile.close()
	for i in profile['RELATED']:
		if i['NAME'] == 'null' or i['URL'] == 'null':
			continue
		t_profile = linkedinTool.extractProfile(i['URL'])
		linkedinDataFile = open(t_profile['NAME'] + '.json', 'w')
		linkedinDataFile.write(json.dumps(t_profile, indent=4,
							sort_keys=True))
		linkedinDataFile.close()
		time.sleep(300)
def main(params):
	config_file = None
	url = None
	opts, args = getopt.getopt(params, "u:c:a:")
	if opts:
		for o, a in opts:
			if o == "-c":
				config_file = a
			elif o == "-u":
				url = a
				linkedinTool = LinkedinController(config=config_file, debug=True)
				profile = linkedinTool.extractProfile(url)
			elif o == "-a":
    				url = a
    				auto(url,config_file)

#print json.dumps(profile)




if __name__ == "__main__":
    argv = sys.argv[1:]
    main(argv)