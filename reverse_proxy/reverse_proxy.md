# Next.js reverse proxy (IP fija contenedor)
<Location /microcapsulas>
    ProxyPass http://172.27.240.11:3000/
    ProxyPassReverse http://172.27.240.11:3000/
</Location>

ProxyPass /_next/ http://172.27.240.11:3000/_next/
ProxyPassReverse /_next/ http://172.27.240.11:3000/_next/

ProxyPass /api http://172.27.240.11:3000/api
ProxyPassReverse /api http://172.27.240.11:3000/api
# Next.js reverse proxy (IP fija contenedor)