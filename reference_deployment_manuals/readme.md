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


5
sena@pop-os:~/Documents/microcapsules/back-end/services$ pwd
/home/sena/Documents/microcapsules/back-end/services
sena@pop-os:~/Documents/microcapsules/back-end/services$ ll
total 20
drwxrwxr-x 2 sena sena 4096 Nov 25 15:48 ./
drwxrwxr-x 6 sena sena 4096 Nov 27 09:23 ../
-rw-rw-r-- 1 sena sena  417 Nov 25 16:38 client_pool.go
-rw-rw-r-- 1 sena sena  964 Nov 25 16:15 microcapsules.go
-rw-rw-r-- 1 sena sena  905 Nov 25 16:16 topics.go
sena@pop-os:~/Documents/microcapsules/back-end/services$ 



check the ip for the external api 