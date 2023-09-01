#!/bin/zsh

if ! (which python3.11); then
    echo "Install python 3.11 at https://www.python.org/downloads/"
    exit 1
fi

if ! (which python | grep venv); then
    if ! (ls | grep venv); then
        if ! (ls | grep requirements.txt); then
            echo "Must be run from repo root directory"
            exit 2
        fi
        python3.11 -m venv venv
        source venv/bin/activate
        python -m pip install --upgrade pip
        python -m pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
fi

if ! (which npm); then
    echo "Install node js at https://nodejs.org/en/"
    exit 3
fi

if ls | grep package-lock; then
    npm ci
else
    echo "Bad install: missing package-lock.json"
    exit 4
fi
echo "Project install successful"
