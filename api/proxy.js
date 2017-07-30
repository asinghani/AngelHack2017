var proxy = require("redbird")({ssl: {port: 443}});

require("redbird").register("find-safe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: false,
            port: 3968
        }
    }
});

require("redbird").register("www.find-safe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: false,
            port: 3968
        }
    }
});

require("redbird").register("gotosafe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: false,
            port: 3968
        }
    }
});

require("redbird").register("www.gotosafe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: false,
            port: 3968
        }
    }
});
