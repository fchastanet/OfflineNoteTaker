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
Installation de cordova, ionic et gulp(watch css/js) de mani?e globale
npm install -g cordova ionic gulp bower brunch add-cors-to-couchdb uglify-js karma-cli
 
Activation de cors
add-cors-to-couchdb http://localhost:5984 -u myusername -p mypassword

Redémarrer le service couchDb

installation de tous les modules néssaires (utilise package.json)
npm install

installation des libs js
bower install

compression lib js
uglifyjs --compress --mangle -- file.js

livraison du js compilé
npm run-script build

<h1>lancement</h1>
ionic serve 

<h1>serveur pouchDB</h1>

TODO 
https://alexfeinberg.wordpress.com/2014/04/26/delay-load-anything-angular/


<h1>différence entre service/factory/provider</h1>
doc officielle:https://docs.angularjs.org/guide/providers
http://stackoverflow.com/a/28262966/3045926
Factory: pratiquement comme un service, mais c'est un singleton : utilisé pour ne retourner qu'un objet
	n'est instancié qu'une fois
Service: retourne toujours un objet avec les même méthodes et propriétés
Provider: on décide de l'objet à retourner en fonction de paramètres

une autre explication
http://tutorials.jenkov.com/angularjs/dependency-injection.html

maintenir les états dans les controleurs
http://toddmotto.com/rethinking-angular-js-controllers/

ng-strict-di
https://www.airpair.com/ionic-framework/posts/production-ready-apps-with-ionic-framework

Releases
V1 : list nodes, create and view a simple node(title + content) + beta synchronization with couchdb server