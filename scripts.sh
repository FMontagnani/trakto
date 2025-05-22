BUCKET_NAME="trakto"
BROKER_NAME="trakto-broker"

case $1 in
  up)
    docker compose up -d
    ;;
  down)
    docker compose down
    ;;
  create-bucket)
    if awslocal s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'
      then
          echo "Bucket does not exist. Creating bucket '$BUCKET_NAME'..."
          awslocal s3 mb "s3://$BUCKET_NAME"
          
          if [ $? -eq 0 ]; then
              echo "✅ Bucket '$BUCKET_NAME' created successfully!"
          else
              echo "❌ Failed to create bucket '$BUCKET_NAME'"
              exit 1
          fi
      else
          echo "✅ Bucket '$BUCKET_NAME' already exists!"
    fi
    ;;
  setup)
    $0 down
    $0 up
    $0 create-bucket
    ;;
  dev)
    $0 up
    ;;  
  *)
    echo "Usage: $0 {up|down|create-bucket|setup|dev}"
    exit 1
    ;;
esac