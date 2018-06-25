const importer = require('./Importer');
const CRUD = require('./CRUD');
const readline = require('readline');

//console.log = () => {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const menu = '\n****MENU PRINCIPALE****\n' +
             '1) Importa dati dal file al database;\n' +
             '2) Conteggio elementi nella tabella \"Ratings\";\n' +
             '3) Visualizza film che hanno nel nome \"Titanic\";\n' +
             '4) Visualizza film che hanno nel nome \"Titanic\" e \"(1970)\";\n' +
             '5) Visualizza i ratings del film con id=1721;\n' +
             '6) Visualizza il numero dei ratings relativi al film con id=1721;\n' +
             '7) Visualizza i ratings relativi al film con id=1271 e che abbiano 5 stelle;\n' +
             '8) Visualizza il numero dei ratings relativi al film con id=1721 e che abbiano 5 stelle;\n' +
             '9) Visualizza l\'insieme dei rating distinti per stella;\n' +
             '10) Visualizza il numero dei voti dati dagli utenti al film con id=1721 distinti per stella;\n' +
             '0) Esci.\n' +
             'Scegli: ';

function showMenu() {
    rl.question(menu, (answer) => {

        switch (answer){
            case '1':
                importer(showMenu);
                break;

            case '2':
                CRUD.countRatings(showMenu);
                break;
            
            case '3':
                CRUD.findLikeTitanic(showMenu);
                break;

            case '4':
                CRUD.findLikeTitanic1970(showMenu);
                break;

            case '5':
                CRUD.findRatingById(showMenu);
                break;

            case '6':
                CRUD.findRatingByIdAndCount(showMenu);
                break;
            
            case '7':
                CRUD.findRatingByIdAndRating(showMenu);
                break;

            case '8':
                CRUD.findRatingByIdAndRatingAndCount(showMenu);
                break;

            case '9':
                CRUD.findDistinctRatingByMovieId(showMenu);
                break;
            
            case '10':
                CRUD.findtRatingByMovieIdGroupBy(showMenu);
                break;

            case '0':
                process.exit();
                break;
                
            default:
                console.log('Scelta non valida.\n');
                showMenu();
        }
    });
}

showMenu();
    
