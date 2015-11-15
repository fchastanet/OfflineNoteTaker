[![Stories in Ready](https://badge.waffle.io/fchastanet/OfflineNoteTaker.png?label=ready&title=Ready)](https://waffle.io/fchastanet/OfflineNoteTaker)
# OfflineNoteTaker
HTML5 AngularJs pouchDB Ionic

# Releases
**V1 :** list nodes, create and view a simple node(title + content) + beta synchronization with couchdb server

# Configuration #
Depuis machine virtuelle ubuntuServer 15

## Redirection de ports ##
ssh host 2022 => guest 22
ionicWebserver host 8100 => guest 8100
ionicReloadServer host 35729 => guest 35729
couchDb hosts 5984 => guest 5984
couchDbSsl hosts 6984 => guest 6984

## Installer NodeJs en local (pas de sudo) ##
```
#!bash
sudo apt-get install python
echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir ~/node-latest-install
cd ~/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install # ok, fine, this step probably takes more than 30 seconds...
curl https://www.npmjs.org/install.sh | sh
```

## Proxy pour NPM ##
avec fiddler
```
#!bash
 
npm config set proxy http://localhost:8888
npm config set https-proxy http://localhost:8888
npm config set strict-ssl false
npm config set registry "http://registry.npmjs.org/"

```

## proxy pour git ##
variable HOME à spécifier pour que git sache où stocker le fichier .gitconfig
```
#!bash

    git config --global --add http.sslVerify false
    git config --global --add http.proxy http://localhost:8888
    git config --global --add https.proxy http://localhost:8888
```

# Installation #
## Installation de cordova, ionic et gulp(watch css/js) de manière globale ##
```
#!bash

npm install -g cordova ionic gulp bower brunch uglify-js karma-cli browserify
```
 
## Installation du service couchDb ##
[[https://wiki.apache.org/couchdb/Installing_on_Ubuntu]]
```
#!bash

sudo apt-get install couchdb -y
```

activation securité http://wiki.apache.org/couchdb/Security_Features_Overview
génération mot de passe:
```
#!bash

./couchDBPasswordGenerator.sh
```
et création utilisateur :
```
#!json

{
   "_id": "org.couchdb.user:fchastanet",
   "_rev": "1-05ee37669e1c693cf06ef403329ae122",
   "type": "user",
   "name": "fchastanet",
   "roles": [
       "editor"
   ],
   "password_sha": "dae547063e410ba7134f0ca3730005d330ee3301",
   "salt": "4e170ffeb6f34daecfd814dfb4001a73"
}
```

## Activation de cors ##
```
#!bash
npm install -g add-cors-to-couchdb
add-cors-to-couchdb http://localhost:5984 -u myusername -p mypassword
```
ou manuellement plus simple (car add-cors-to-couchdb ne fonctionne pas avec node sous ubuntu, nécessite installation package nodejs-legacy)
```
#!bash

HOST=http://adminname:password@localhost:5984 # or whatever you got

curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
curl -X PUT $HOST/_config/cors/origins -d '"*"'
curl -X PUT $HOST/_config/cors/credentials -d '"true"'
curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT $HOST/_config/cors/headers -d '"accept, authorization, content-type, origin, referer, x-csrf-token"'
```

## installation de tous les modules néssaires (utilise package.json) ##
on n'utilise pas bower mais npm lui-même pour tout installer : [[https://gofore.com/ohjelmistokehitys/stop-using-bower/]]
```
#!bash
npm install
```

## installation des libs js ##
```
#!bash
bower install
```

## compression lib js ##
```
#!bash
uglifyjs --compress --mangle -- file.js
```

## livraison du js compilé ##
```
#!bash
npm run-script build
```

## lancement ##

```
#!bash

startServer.cmd
```

# Notes #
## différence entre service/factory/provider ##
**doc officielle**:[https://docs.angularjs.org/guide/providers](https://docs.angularjs.org/guide/providers)
[http://stackoverflow.com/a/28262966/3045926](http://stackoverflow.com/a/28262966/3045926)

**Factory:** pratiquement comme un service, mais c'est un singleton : utilisé pour ne retourner qu'un objet
	n'est instancié qu'une fois
**Service:** retourne toujours un objet avec les même méthodes et propriétés
**Provider:** on décide de l'objet à retourner en fonction de paramètres

**une autre explication**
[http://tutorials.jenkov.com/angularjs/dependency-injection.html](http://tutorials.jenkov.com/angularjs/dependency-injection.html)

## ng-strict-di ##
https://www.airpair.com/ionic-framework/posts/production-ready-apps-with-ionic-framework

# TODO #
## couchDb/pouchDb ##
* design document

## refactorization ##
### functionalities: ###

* edit node
* delete node
* ajout des champs supplémentaires + dépendances
* search/pagination
* rendu HTML (view)
* localization : <a href="http://blog.trifork.com/2014/04/10/internationalization-with-angularjs/">http://blog.trifork.com/2014/04/10/internationalization-with-angularjs/</a>
* attachments
* conflicts
* concurrent modification => refactoring => each modification is an undo/redo change => the complete document is reconstructed from these changes => long polling

### before production ###
* add other gulp tasks : 
[https://www.airpair.com/ionic-framework/posts/production-ready-apps-with-ionic-framework](https://www.airpair.com/ionic-framework/posts/production-ready-apps-with-ionic-framework)
[https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917](https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917)

* or use brunch: [https://github.com/brunch/brunch/tree/master/docs](https://github.com/brunch/brunch/tree/master/docs)

* générer un fichier manifest

### production ###
* mettre l'appli en ligne comme ce qui est fait avec cette appli : [http://silo.app.krur.com/](http://silo.app.krur.com/)
* fchastanet:pouchdb pull request
* optimisations : 
    * [https://alexfeinberg.wordpress.com/2014/04/26/delay-load-anything-angular/](https://alexfeinberg.wordpress.com/2014/04/26/delay-load-anything-angular/)