    # Next.js reverse proxy (CORRECT + FIXED VERSION)
	<Location /microcapsulas>
		ProxyPass http://127.0.0.1:13000/
		ProxyPassReverse http://127.0.0.1:13000/
	</Location>
	ProxyPass /_next/ http://127.0.0.1:13000/_next/
	ProxyPassReverse /_next/ http://127.0.0.1:13000/_next/
	ProxyPass /api http://127.0.0.1:13000/api
	ProxyPassReverse /api http://127.0.0.1:13000/api
	# Next.js reverse proxy (CORRECT + FIXED VERSION)
	

	