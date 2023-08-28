docker build -t amm-indexer .
docker run -d -t -p 3000:3000 amm-indexer
