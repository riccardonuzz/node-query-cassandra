const cassandra = require('cassandra-driver');
const TimeUuid = require('cassandra-driver').types.TimeUuid;


const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'movielens', pooling: { maxRequestsPerConnection: 100000000000 } });

const truncateMovies = (callback) => {
    client.execute('TRUNCATE movies;', callback);
};

const truncateUsers = (callback) => {
    client.execute('TRUNCATE users;', callback);
};

const truncateRatings = (callback) => {
    client.execute('TRUNCATE ratings;', callback);
};

const insertMovie = (id, title, genres) => {
    const query = 'INSERT INTO movies(id, title, genres) VALUES(?, ?, ?);';
    client.execute(query, [ id, title, genres ], {prepare: true});
};

const insertUser = (id, gender, age, occupation, zipcode) => {
    const query = 'INSERT INTO users(id, gender, age, occupation, zipcode) VALUES(?, ?, ?, ?, ?);';
    client.execute(query, [ id, gender, age, occupation, zipcode ], {prepare: true});
};

const insertRating = (userID, movieID, rating, timestamp) => {
    const query = 'INSERT INTO ratings(id, userid, movieid, rating, timestamp) VALUES(?, ?, ?, ?, ?);';
    client.execute(query, [ TimeUuid.now(), userID, movieID, rating, timestamp ], {prepare: true});
};

const countRatings = (showMenuCallback) => {
    const query = 'SELECT COUNT(*) AS count FROM ratings;';
    client.execute(query, [])
        .then((result) => {
            console.log('Numero di righe: %s', result.rows[0].count);
            showMenuCallback();
        });
};

const findLikeTitanic = (showMenuCallback) => {
    const query = 'SELECT * FROM movies WHERE title LIKE \'%Titanic%\';';
    client.execute(query, [])
        .then((result) => {
            result.rows.forEach((element) => {
                console.log('id: %s \t genres: %s \t title: %s', element.id, element.genres, element.title);
            })
            
            showMenuCallback();
        });
};

const findLikeTitanic1970 = (showMenuCallback) => {
    const query = 'SELECT * FROM movies WHERE title LIKE \'%Titanic(1997)%\';';
    client.execute(query, [])
        .then((result) => {
            result.rows.forEach((element) => {
                console.log('id: %s \t genres: %s \t title: %s', element.id, element.genres, element.title);
            })
            
            showMenuCallback();
        });
};

const findRatingById = (showMenuCallback) => {
    const query = 'SELECT * FROM ratings WHERE movieid=1721 ALLOW FILTERING;';
    client.execute(query, [])
        .then((result) => {
            result.rows.forEach((element) => {
                console.log('id: %s \t movieid: %s \t userid: %s \t timestamp: %s \t raing: %s', element.id, element.movieid, element.userid, element.timestamp, element.rating);
            })
            
            showMenuCallback();
        });
};

const findRatingByIdAndCount = (showMenuCallback) => {
    const query = 'SELECT COUNT(*) AS count FROM ratings WHERE movieid=1721 ALLOW FILTERING;';
    client.execute(query, [])
        .then((result) => {
            console.log('Numero di righe: %s', result.rows[0].count);
            showMenuCallback();
        });
};

const findRatingByIdAndRating = (showMenuCallback) => {
    const query = 'SELECT * FROM ratings WHERE movieid=1721 AND rating=5 ALLOW FILTERING;';
    client.execute(query, [])
        .then((result) => {
            result.rows.forEach((element) => {
                console.log('id: %s \t movieid: %s \t userid: %s \t timestamp: %s \t raing: %s', element.id, element.movieid, element.userid, element.timestamp, element.rating);
            });
            showMenuCallback();
        });
};

const findRatingByIdAndRatingAndCount = (showMenuCallback) => {
    const query = 'SELECT COUNT(*) AS count FROM ratings WHERE movieid=1721 AND rating=5 ALLOW FILTERING;';
    client.execute(query, [])
        .then((result) => {
            console.log('Numero di righe: %s', result.rows[0].count);
            showMenuCallback();
        });
};

const findDistinctRatingByMovieId = (showMenuCallback) => {
    const query = 'SELECT rating FROM ratings WHERE movieid=1721 ALLOW FILTERING;';
    client.execute(query, [])
        .then((result) => {

            let set = result.rows.filter((row, index, self) =>
                index === self.findIndex((t) => (
                    t.rating === row.rating
                ))
            );
          
            console.log(set.sort((a, b)=> {
                return a.rating>b.rating;
            }));
            showMenuCallback();
        });
};


const findtRatingByMovieIdGroupBy = (showMenuCallback) => {
    const query = 'SELECT rating FROM ratings WHERE movieid=1721 ALLOW FILTERING;';
    client.execute(query, [])
        .then((result) => {

            let set = result.rows.filter((row, index, self) =>
                index === self.findIndex((t) => (
                    t.rating === row.rating
                ))
            );
          
            set = set.sort((a, b)=> {
                return a.rating>b.rating;
            });

            let count = Array.apply(null, Array(set.length)).map(Number.prototype.valueOf,0);
    
            result.rows.forEach(element => {
                count[parseInt(element.rating-1)]++;
            });

            count.forEach((element, i) => {
                console.log(`Numero stelle: ${set[i].rating}\t Valutazione dell'utente: ${element}`);
            });

            showMenuCallback();
        });
};

module.exports = { 
    insertMovie,
    insertUser, 
    insertRating,
    truncateMovies,
    truncateUsers,
    truncateRatings,
    countRatings,
    findLikeTitanic1970,
    findRatingById,
    findRatingByIdAndCount,
    findRatingByIdAndRating,
    findRatingByIdAndRatingAndCount,
    findDistinctRatingByMovieId,
    findtRatingByMovieIdGroupBy
};