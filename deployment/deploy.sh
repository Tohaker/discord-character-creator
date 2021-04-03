sed -i 's/{{BOT_TOKEN}}/'"$BOT_TOKEN"'/' bootstrap.sh

terraform apply -auto-approve