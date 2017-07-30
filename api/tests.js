var exec = require("child_process").exec;
var request = require("request");

if(["client", "server", "fullStack"].indexOf(process.argv[2]) == -1) {
  console.error("Usage: npm test client - Test the client\n       npm test server - Test the server\n       npm test fullStack - Test both client and server");
  process.exit(0);
}

exec("node .");

console.log("Starting Server...");

setTimeout(() => {
  console.log("Starting Tests...");

  if(process.argv[2] == "client") {
    runClientTests();
  } else if (process.argv[2] == "server") {
    runServerTests();
  } else if (process.argv[2] == "fullStack") {
    runClientTests(() => runServerTests());
  } else {
    console.error("Usage: npm test client - Test the client\n       npm test server - Test the server\n       npm test fullStack - Test both client and server");
    process.exit(0);
  }
}, 5000);

function runClientTests(done) {
  console.log("Starting Client Tests");
  var pass = 0;
  var fail = 0;

  // Run first client test (will eventually be seperated into files)
  console.log("1. Client Load Test");
  request("http://localhost:3000/ui/index.html", function (error, response, body) {
    if(error) {
      console.error("Error occurred", error);
      fail++;
    } else if (response && response.statusCode && response.statusCode != 200) {
      console.error("Non-200 status code: "+response.statusCode);
      fail++;
    } else {
      console.log("Success");
      pass++;
    }

    console.log("Client Tests Finished. "+pass+" passed and "+fail+" failed.");
    console.log();
    done();
  });


}

function runServerTests() {
  console.log("Starting Server Tests");
  var pass = 0;
  var fail = 0;

  console.log("1. Venues API Test");
  request("http://localhost:3000/api/venues", function (error, response, body) {
    if(error) {
      console.error("Error occurred", error);
      fail++;
    } else if (response && response.statusCode && response.statusCode != 200) {
      console.error("Non-200 status code: "+response.statusCode);
      fail++;
    } else {
      console.log("Success");
      pass++;
    }

    console.log("Server Tests Finished. "+pass+" passed and "+fail+" failed.");
  });
}
