const Fs = require('fs');
const LineByLineReader = require('line-by-line');
const CRUD = require('./CRUD');

function importMovies(importUsers, importRatings, showMenuCallback) {
    CRUD.truncateMovies(() => {
        console.log('Caricamento...\n');
        lr = new LineByLineReader('./ml-1m/movies.dat');

        lr.on('error', function (err) {
            console.log('Operazione completata.\n');
        });
        
        lr.on('line', function (line) {
            let movie = line.split('::');
            if(movie[0]) {
                let genres = movie[2].split('|');
                CRUD.insertMovie(movie[0], movie[1], genres);
                //console.log(`ID: ${movie[0]}\nTitolo: ${movie[1]}\nGeneri: ${setString}\n\n`);
            }   
        });

        lr.on('end', function () {
            console.log('Operazione completata.\n');
            importUsers(importRatings, showMenuCallback);
        });
    });
}


function importUsers(importRatings, showMenuCallback) {
    CRUD.truncateUsers(() => {
        console.log('Caricamento...\n');
        lr = new LineByLineReader('./ml-1m/users.dat');

        lr.on('error', function (err) {
            console.log('Operazione completata.\n');
        });
        
        lr.on('line', function (line) {
            let user = line.split('::');
            if(user[0]) {
                CRUD.insertUser(user[0], user[1], user[2], user[3], user[4]);
                //console.log(`ID: ${user[0]}\nGenere: ${user[1]}\nEta': ${user[2]}\nOccupazione: ${user[3]}\nCodice postale: ${user[4]}\n\n`);
            }  
        });

        lr.on('end', function () {
            console.log('Operazione completata.\n');
            importRatings(showMenuCallback);
        });
    });
}


function importRatings(showMenuCallback) {
     CRUD.truncateRatings(() => {
        console.log('Caricamento...\n');
        lr = new LineByLineReader('./ml-1m/ratings.dat');

        lr.on('error', function (err) {
            console.log('Operazione completata.\n');
        });
        
        lr.on('line', function (line) {
            let rating = line.split('::');
            if(rating[0]) {
                CRUD.insertRating(rating[0], rating[1], rating[2], rating[3]);
                //console.log(`ID del film: ${rating[0]}\nID dell'utente: ${rating[1]}\nRating: ${rating[2]}\nTimestamp: ${rating[3]}\n\n`);
            }
        });

        lr.on('end', function () {
            console.log('Operazione completata.\n');
            showMenuCallback();
        });

    });
}


const importer = (showMenuCallback) => {
    importMovies(importMovies, importRatings, showMenuCallback);    
}

module.exports = importer;