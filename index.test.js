const fs = require('fs');
const path = require('path');
const {
    readConfigXML,
    parseXML,
    storeSubdomains,
    storeCookies,
} = require('./index');


// Test for readConfigXML
describe('readConfigXML', () => {
    it('should read the config xml', () => {
        const expectedResult = '<config><subdomains><subdomain>foo.example.com</subdomain><subdomain>bar.example.com</subdomain></subdomains><cookies><cookie name="foo" host="foo.example.com">value1</cookie><cookie name="bar" host="bar.example.com">value2</cookie></cookies></config>';
        readConfigXML((err, result) => {
            expect(err).toBe(null);
            expect(result).toEqual(expectedResult);
        });
    });
});

// Test for parseXML
describe('parseXML', () => {
    it('should parse the xml string', () => {
        const xmlString = '<config><subdomains><subdomain>foo.example.com</subdomain><subdomain>bar.example.com</subdomain></subdomains><cookies><cookie name="foo" host="foo.example.com">value1</cookie><cookie name="bar" host="bar.example.com">value2</cookie></cookies></config>';
        const expectedResult = {
            config: {
                subdomains: [
                    {
                        subdomain: [
                            'foo.example.com',
                            'bar.example.com'
                        ]
                    }
                ],
                cookies: [
                    {
                        cookie: [
                            {
                                $: {
                                    name: 'foo',
                                    host: 'foo.example.com'
                                },
                                _: 'value1'
                            },
                            {
                                $: {
                                    name: 'bar',
                                    host: 'bar.example.com'
                                },
                                _: 'value2'
                            }
                        ]
                    }
                ]
            }
        };
        parseXML(xmlString, (err, result) => {
            expect(err).toBe(null);
            expect(result).toEqual(expectedResult);
        });
    });
});



// Test for storeSubdomains
describe('storeSubdomains', () => {
    it('should store the subdomains in Redis', () => {
        const subdomains = ['foo.example.com', 'bar.example.com'];
        const expectedResult = 'OK';
        storeSubdomains(subdomains, (err, result) => {
            expect(err).toBe(null);
            expect(result).toEqual(expectedResult);
        });
    });
});



// Test for storeCookies
describe('storeCookies', () => {
    it('should store the cookies in Redis', () => {
        const cookies = [
            {
                $: {
                    name: 'foo',
                    host: 'foo.example.com'
                },
                _: 'value1'
            },
            {
                $: {
                    name: 'bar',
                    host: 'bar.example.com'
                },
                _: 'value2'
            }
        ];
        const expectedResult = 'OK';
        storeCookies(cookies, (err, result) => {
            expect(err).toBe(null);
            expect(result).toEqual(expectedResult);
        });
    });
});

