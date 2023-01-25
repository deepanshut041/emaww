// Load the Redis module
const fs = require("fs");

// Load the Redis module
const Redis = require('redis');

// Connect to Redis
const client = Redis.createClient();

// Load the XML module
const xml2js = require('xml2js');

// Read the contents of the config.xml file
const xmlString = fs.readFileSync('config.xml', 'utf8');

// Function to read config xml
const readConfigXML = (cb) => {
    const xmlString = fs.readFileSync('config.xml', 'utf8');
    cb(null, xmlString);
}


// Function to parse config xml
const parseXML = (xmlString, cb) => {
    xml2js.parseString(xmlString, (err, result) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, result);
        }
    });
}

// Function to store subdomains in Redis
const storeSubdomains = (subdomains, cb) => {
    client.set('subdomains', JSON.stringify(subdomains), (err, reply) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, reply);
        }
    });
}

// Function to store cookies in Redis
const storeCookies = (cookies, cb) => {
    cookies.map((cookie) => {
        const cookieName = cookie.$.name;
        const cookieHost = cookie.$.host;
        const cookieValue = cookie._;
        client.set(`cookie:${cookieName}:${cookieHost}`, cookieValue, (err, reply) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, reply);
            }
        });
    });
}

readConfigXML((err, xmlObj) => {
    if (err) {
        console.log(err);
    } else {
        parseXML(xmlObj, (err, xmlString) => {
            if (err) {
                console.log(err);
            } else {
                
                const subdomains = xmlString.config.subdomains[0].subdomain;

                storeSubdomains(subdomains, (err, reply) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(reply);
                    }
                })

                const cookies = xmlString.config.cookies[0].cookie

                storeCookies(cookies, (err, reply) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(reply);
                    }
                });
            }
        })
    }
})

module.exports = {
    readConfigXML,
    parseXML,
    storeSubdomains,
    storeCookies,
};