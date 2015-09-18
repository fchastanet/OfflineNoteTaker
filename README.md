# OfflineNoteTaker
HTML5 AngularJs pouchDB Ionic

<h1>Proxy pour NPM</h1>
avec fiddler
npm config set proxy http://localhost:8888
npm config set https-proxy http://localhost:8888
npm config set strict-ssl false
npm config set registry "http://registry.npmjs.org/"

http://stackoverflow.com/questions/2989466/configuring-fiddler-to-use-company-networks-proxy
http://stackoverflow.com/questions/7559648/is-there-a-way-to-make-npm-install-the-command-to-work-behind-proxy 

<h1>Proxy pour Bower</h1>
Ajouter les 2 lignes suivantes dans le fichier .bowerrc
    "proxy":"http://localhost:8888",
    "https-proxy":"http://localhost:8888",
    "strict-ssl": false
Configurer le proxy git
    variable HOME à spécifier pour que git sache où stocker le fichier .gitconfig
    git config --global --add http.sslVerify false
    git config --global --add http.proxy http://localhost:8888
    git config --global --add https.proxy http://localhost:8888

<h1>Installation</h1>
Installation de cordova, ionic et gulp(watch css/js) de manière globale
npm install -g cordova ionic
npm install -g gulp
npm install -g bower

installation de tous les modules nécessaires (utilise package.json)
npm install

installation des libs js
bower install

<h1>lancement</h1>
ionic serve