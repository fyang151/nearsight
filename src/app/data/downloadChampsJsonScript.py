import requests
import os

version = "14.22.1"

champsUrl = f'https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json'
champsRes = requests.get(champsUrl)

champsData = champsRes.json()

current_directory = os.getcwd()

scriptDir = os.path.dirname(os.path.abspath(__file__))
filePath = os.path.join(scriptDir, "champions.json")

with open(filePath, "w") as f:
  f.write(champsRes.text)