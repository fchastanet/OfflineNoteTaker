# OfflineNoteTaker
HTML5 AngularJs pouchDB Ionic

# Releases #
**V1 :** list nodes, create and view a simple node(title + content) + beta synchronization with couchdb server

# Configuration #

## Proxy pour NPM ##
avec fiddler
```
#!bash

npm config set proxy http://localhost:8888
npm config set https-proxy http://localhost:8888
npm config set strict-ssl false
npm config set registry "http://registry.npmjs.org/"

```

[http://stackoverflow.com/questions/2989466/configuring-fiddler-to-use-company-networks-proxy](http://stackoverflow.com/questions/2989466/configuring-fiddler-to-use-company-networks-proxy)
[http://stackoverflow.com/questions/7559648/is-there-a-way-to-make-npm-install-the-command-to-work-behind-proxy](http://stackoverflow.com/questions/7559648/is-there-a-way-to-make-npm-install-the-command-to-work-behind-proxy) 

## Proxy pour Bower ##
Ajouter les 2 lignes suivantes dans le fichier .bowerrc
```
#!json

    "proxy":"http://localhost:8888",
    "https-proxy":"http://localhost:8888",
    "strict-ssl": false
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
npm install -g cordova ionic gulp bower brunch add-cors-to-couchdb uglify-js karma-cli
 
## Activation de cors ##
add-cors-to-couchdb http://localhost:5984 -u myusername -p mypassword

## Redémarrer le service couchDb ##

## installation de tous les modules néssaires (utilise package.json) ##
npm install

## installation des libs js ##
bower install

## compression lib js ##
uglifyjs --compress --mangle -- file.js

## livraison du js compilé ##
npm run-script build

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

<h1>TODO</h1>
<ul>
<li>
	<b>couchDb/pouchDb</b><br>
	<ul>
	<li>design document</li>
	</ul>
</li>
<li>refactorization</li>
<li>
	<b>functionalities:</b>
	<ul>
		<li>edit node</li>
		<li>delete node</li>
		<li>ajout des champs supplémentaires + dépendances</li>
		<li>search/pagination</li>
		<li>rendu HTML (view)</li>
		<li>localization : <a href="http://blog.trifork.com/2014/04/10/internationalization-with-angularjs/">http://blog.trifork.com/2014/04/10/internationalization-with-angularjs/</a></li>
		<li>attachments</li>
		<li>conflicts</li>
		<li>concurrent modification => refactoring => each modification is an undo/redo change => the complete document is reconstructed from these changes => long polling</li>
	</ul>
</li>
<li>
	<b>before production</b><br>
	<ul>
	<li>
		add other gulp tasks : 
		<a href="https://www.airpair.com/ionic-framework/posts/production-ready-apps-with-ionic-framework">https://www.airpair.com/ionic-framework/posts/production-ready-apps-with-ionic-framework</a><br>
		<a href="https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917">https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917</a>
	</li>
	<li>or use brunch:
		<a href="https://github.com/brunch/brunch/tree/master/docs">https://github.com/brunch/brunch/tree/master/docs</a>
	</li>
	<li>générer un fichier manifest</li>
	</ul>
</li>
<li>
	<b>production</b>
	mettre l'appli en ligne comme ce qui est fait avec cette appli <a href="http://silo.app.krur.com/">http://silo.app.krur.com/</a>
</li>

<li>fchastanet:pouchdb pull request</li>
<li>
	<b>optimisations : </b>
	<ul>
	<li><a href="https://alexfeinberg.wordpress.com/2014/04/26/delay-load-anything-angular/">https://alexfeinberg.wordpress.com/2014/04/26/delay-load-anything-angular/
	</a></li>
	</ul>
</li>
</ul>