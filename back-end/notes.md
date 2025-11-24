go version go1.24.10 linux/amd64
framework gim



testing endpoings curls

1

curl -X POST http://localhost:8080/proxy/microcapsules \
     -H "Content-Type: application/json" \
     -d '{
           "tema": "Historia del cafe",
           "min_caracteres": 500,
           "max_caracteres": 600,
           "cantidad_microcapsulas": 10
         }'



