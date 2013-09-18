var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.ftrim();
client.config('general:navdata_data_demo', false);
client.config('control:outdoor', false); // This is not outdoor. 
client.config('control:flight_without_shell', false); // Using the shell all the time
client.createRepl();
