#!/bin/bash

ERRORSTRING="Error. Please make sure you've indicated correct parameters"
if [ $# -eq 0 ]
    then
        echo $ERRORSTRING;
elif [ $1 == "production" ]
    then
        echo "Running production deploy"
        npm run build && aws s3 sync --delete --acl public-read --region=eu-west-1 --profile pooreffort ./dist/static s3://void-bookmarklet
elif [ $1 == "local" ]
    then
        echo "Running local deploy build"
        npm run build
fi
