if [ ! "$(docker network ls | grep server-boilerplate-network)" ]; then
  echo "Creating server-boilerplate-network network ..."
  docker network create --driver bridge server-boilerplate-network
else
  echo "server-boilerplate-network network exists."
fi
