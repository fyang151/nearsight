import requests
import os
import shutil

version = "14.22.1"

champsUrl = f'https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json'
champsRes = requests.get(champsUrl)

champsData = champsRes.json()['data']
champsCount = len(champsData)
index = 1

scriptDir = os.path.dirname(os.path.abspath(__file__))
iconsDir = os.path.join(scriptDir, "championIcons")

if os.path.exists(iconsDir):
  shutil.rmtree(iconsDir)
  
os.makedirs(iconsDir, exist_ok=True)

for champkey, champData in champsData.items():
  try:
    id = champData["id"]
    url = f"https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{id}.png"
    res = requests.get(url)
    
    filePath = os.path.join(iconsDir, f"{id}.png")
    with open(filePath, "wb") as f:
      f.write(res.content)
      
    progress = f"{index}/{champsCount}".ljust(10, " ")
      
    print(f"\r{progress}| Downloaded {id}.png".ljust(50, " "), end="", flush=True)
  except:
    print(f"\r{progress}| Failed to download {id}.png".ljust(50, " "), end="", flush=True)
    
  index += 1