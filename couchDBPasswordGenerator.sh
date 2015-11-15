#!/bin/bash

read -s -p "entrez le mot de passe:" LPASSWD

SALT=`openssl rand -base64 32`
ENCODED_PASSWD=`openssl passwd -crypt -salt $SALT $LPASSWD`

echo ""
echo "sel : $SALT"
echo "mot de passe salé et encodé : $ENCODED_PASSWD"