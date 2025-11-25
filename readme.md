# Microcapsulas

Microcapsulas es un proyecto de texto generativo que permite a los estudiantes obtener **microcápsulas de contenido** a partir de los cursos, organizadas por temas específicos.  


branch = high-concurrency-best-practices-go

Connection Pooling

We created a shared HTTP client (SharedClient) using http.Transport. This keeps connections alive and reused instead of opening a new one each time.


Semaphore for Concurrency Control

We added a semaphore (a chan struct{}) to limit the number of concurrent outbound HTTP requests.

100