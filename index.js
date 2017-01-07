let Twitter = require('node-tweet-stream');
let CsvDb = require('csv-db');
let _ = require('underscore');
let fs = require('fs');

const customer_key = '';
const customer_secret = '';
const access_token = '60325824-';
const access_secret_token = '';


/*
 * Permet de vérifier si un fichier csv existe. S'il n'existe pas on le créer
 */
fs.exists('input.csv', (exists) => {
    if(!exists) {
        fs.writeFileSync('input.csv');
    }
});

/**
 * Regex permettant d'extraire un email dans un texte
 */
const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

/**
 * On utilise le fichier csv comme une base de données
 */
const csvDb = new CsvDb('input.csv', ['id', 'name', 'screen_name', 'description', 'email']);

/**
 * Initialisation de l'API Twitter
 */
const twitter = new Twitter({
    consumer_key: customer_key,
    consumer_secret: customer_secret,
    token: access_token,
    token_secret: access_secret_token
});

/**
 * Lorsqu'un tweet est émis on va faire qlq chose
 */
twitter.on('tweet', function (tweet) {
    /**
     * On créer un objet user
     */
    let user = {
        name: tweet.user.name,
        screen_name: tweet.user.screen_name,
        description: tweet.user.description
    };

    /**
     * S'il y a une description
     */
    if(!_.isEmpty(user.description)) {
        /**
         * On vérifie qu'un mail est dans la description
         */
        let emailArray = user.description.match(emailRegex);

        /**
         * Lorsqu'on a un email on l'enregistre dans notre fichier CSV
         */
        if(emailArray != null) {
            user.email = emailArray[0];

            csvDb.insert(user).then((data) => {
                console.log('On est ici !!!');
                console.log(data);
            }, (err) => {
                console.log('error !!!');
                console.log(err);
            });
        }
    }
});

/**
 * Dans le cas d'une erreur
 */
twitter.on('error', function (err) {
    console.log('Oh no')
});

twitter.track('VOTRE MOT CLE');
// twitter.track('AUTREMOT CLE');

