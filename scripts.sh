case $1 in
  up)
    docker-compose up -d
    ;;
  down)
    docker-compose down
    ;;
  dev)
    docker compose up -d
    awslocal s3 mb s3://trakto
    ts-node-dev -r tsconfig-paths/register src/adapters/api/app.ts
    ;;
  *)
    echo "Usage: $0 {up|down|logs}"
    exit 1
    ;;
esac