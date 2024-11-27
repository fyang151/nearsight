import requests
import os

version = "14.22.1"

champsUrl = f'https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json'
champsRes = requests.get(champsUrl)

champsData = champsRes.json()['data']
champsCount = len(champsData)
index = 1

scriptDir = os.path.dirname(os.path.abspath(__file__))


for champkey, champData in champsData.items():
  try:
    id = champData["id"]
    url = f"https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{id}.png"
    res = requests.get(url)
    filePath = os.path.join(scriptDir, f"championIcons/{id}.png")
    with open(filePath, "wb") as f:
      f.write(res.content)
      
    print(f"{index}/{champsCount} | Downloaded {id}.png")
  except:
    print(f"{index}/{champsCount} | Failed to download {id}.png")
    
  index += 1