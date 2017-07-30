var proxy = new require("redbird")({port:80, ssl: {port: 443},
  letsencrypt: {
    path: __dirname + '/certs',
    port:3979
  }
});

proxy.register("find-safe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: true,
            port: 3968
        }
    }
});

proxy.register("www.find-safe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: true,
            port: 3969
        }
    }
});

proxy.register("gotosafe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: true,
            port: 3970
        }
    }
});

proxy.register("www.gotosafe.space", "http://localhost:3000", {
    ssl: {
        letsencrypt: {
            email: "anish.singhani@gmail.com",
            production: true,
            port: 3971
        }
    }
});
