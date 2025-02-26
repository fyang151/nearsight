import requests
import os

version = "15.4.1"

champsUrl = f'https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json'
champsRes = requests.get(champsUrl)

champsData = champsRes.json()

scriptDir = os.path.dirname(os.path.abspath(__file__))
filePath = os.path.join(scriptDir, "champions.json")

if os.path.exists(filePath):
  os.remove(filePath)

with open(filePath, "w") as f:
  f.write(champsRes.text)
  
print(f"Downloaded champion data to {filePath}")