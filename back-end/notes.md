go version go1.24.10 linux/amd64
framework gim



testing endpoings curls

1

nice curls     

curl -X POST http://localhost:8080/proxy/microcapsules \
     -H "Content-Type: application/json" \
     -d '{
           "tema": "Historia del cafe",
           "min_caracteres": 500,
           "max_caracteres": 600,
           "cantidad_microcapsulas": 10
         }'


2

curl -X POST http://localhost:8080/proxy/topics \
     -H "Content-Type: application/json" \
     -d '{"curso": "GUIANZA TURISTICA", "numero_temas": 5}'





wrong curls

1

curl -X POST http://localhost:8080/proxy/topics \
  -H "Content-Type: application/json" \
  -d '{}'





2

curl -X POST http://localhost:8080/proxy/microcapsules \
  -H "Content-Type: application/json" \
  -d '{
    "tema": "Historia del cafe"
  }'





---

working between container communications

testing_connection_from_front_to_back

1
sudo docker exec -it microcapsules-frontend-1 sh



2
curl -X POST http://backend:8080/proxy/topics \
  -H "Content-Type: application/json" \
  -d '{"curso": "TEST CURSO", "numero_temas": 20}'


---
