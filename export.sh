#!/bin/bash

# Check if Redis container is running
if ! docker ps -f name=redis -q; then
    echo "Redis container is not running. Please start it first."
    exit 1
fi

# Check if argument is passed
if [ -z $1 ]; then
    echo "Please provide the path to config.xml file."
    exit 1
fi

# Check if config.xml file exists
if [ ! -f $1 ]; then
    echo "config.xml file does not exist."
    exit 1
fi

# Import subdomain array from Redis
subdomains_json=$(docker exec redis redis-cli get subdomains)
subdomains_array=$(echo "$subdomains_json" | jq -r '.[]')

# Print subdomain array
if [ ! -z $2 ]; then
    if [ "$2" == "-v" ]; then
        echo $subdomains_array
    else
        echo "Invalid argument. Please use -v option to print all saved keys."
    fi
fi

# Add subdomains to config.xml
if [ ! -z "$subdomains_array" ]; then
    for subdomain in $subdomains_array; do
        print "subdomain %s\n" $subdomain >> $1
    done
fi

# Import cookies from Redis
while IFS= read -r line; do
    if [ "${line#*cookie }" != "$line" ]; then
        cookie_name="$(echo "$line" | cut -d ' ' -f 2)"
        cookie_host="$(echo "$line" | cut -d ' ' -f 3)"

        cookie_value=$(docker exec redis redis-cli get "cookie:$cookie_name:$cookie_host")

        printf "cookie %s %s %s\n" "$cookie_name" "$cookie_host" "$cookie_value" >> $1
    fi
done < "$1"