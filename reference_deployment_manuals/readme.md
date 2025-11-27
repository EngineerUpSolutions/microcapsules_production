0   validar si puertos necesarios estan habilitados


1  set up reverse proxy on apache2




2  build up containers  

front-end
locally route 
/home/sena/Documents/microcapsules/front-end             

comando 

sudo docker compose up --build -d


back-end
locally route 
/home/sena/Documents/microcapsules/back-end
comando 

sudo docker compose up --build -d




3

sena@pop-os:~/Documents/microcapsules$ cd front-end/lib/
sena@pop-os:~/Documents/microcapsules/front-end/lib$ pwd
/home/sena/Documents/microcapsules/front-end/lib
sena@pop-os:~/Documents/microcapsules/front-end/lib$ ll
total 12
drwxrwxr-x 2 sena sena 4096 Nov 26 14:44 ./
drwxrwxr-x 8 sena sena 4096 Nov 26 14:44 ../
-rw-rw-r-- 1 sena sena  503 Nov 26 14:47 api.ts
sena@pop-os:~/Documents/microcapsules/front-end/lib$ 



valdiar en api.ts the base route in case the port changes



4
validate authentication method, change key if necessary

/var/www/html/zajuna/local/microcapsulas/index.php
/home/sena/Documents/microcapsules/docker-compose.yml


