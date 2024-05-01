const mysql = require("mysql");
const dotenv = require("dotenv");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const moment = require("moment");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
dotenv.config();


app.get("/info", async function (req, res) {
  let output = {
    status: "success",
  };
  res.statusCode = 200;
  let parkings = await fetch_database();
  output.data = parkings
  console.log(parkings);

  res.send(parkings)

});


var local_name = process.env.LOCALNAME;
var secure_key = process.env.PASSWORD;

// var db = mysql.createConnection({
//   host: "localhost",
//   user: local_name,
//   password: secure_key,
//   database: "parking-database",
// });

const db = mysql.createPool({
  connectionLimit: 10,
  password: secure_key,
  user: local_name,
  database: "parking_database",
  host: "localhost",
  port: 3306,
});

fetch_database = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM parking", (error, result) => {
      let output_array = [];
      if (error) {
        return reject(error);
      }

      result = JSON.parse(JSON.stringify(result));

      result.map((parkingObj) => {
        let temp = {
          name: parkingObj.parking_name,
          capacity: parkingObj.capacity,
          free: parkingObj.free_places,
          coordinate_lat: parkingObj.latitude,
          coordinate_lon: parkingObj.longitude

        };
        output_array.push(temp);
      });

      return resolve(output_array);
    });
  });
};


const url = "https://www.luxembourg-city.com/en/plan-your-stay/traveller-information/car-parks";

async function get_data() {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const parkingTable = $("table.table-parking");
    const rows = parkingTable.find("tr");

    let parkingNamesList = [];
    let parkingCapacityList = [];
    let parkingFreePlacesList = [];

    rows.each((index, element) => {
      const cell = $(element).find("td");

      if (cell.length >= 3) {
        const parkingName = $(cell[0]).text().trim();
        const parkingCapacity = $(cell[1]).text().trim();
        const parkingFreePlaces = $(cell[2]).text().trim();

        parkingNamesList.push(parkingName);
        parkingCapacityList.push(parkingCapacity);
        parkingFreePlacesList.push(parkingFreePlaces);
      }
    });

    const parkingInfo = {
      parking_names_list: parkingNamesList,
      parking_capacity_list: parkingCapacityList,
      parking_free_places_list: parkingFreePlacesList,
    };

    return parkingInfo;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

function store_data_json(data) {
  return new Promise((resolve, reject) => {
    let data_to_store = [];

    data.parking_names_list.forEach((parking_name, index) => {
      let parking_free_places =
        data.parking_free_places_list[index] || "not available now";

      data_to_store.push({
        name: parking_name,
        parking_free_places: parking_free_places,
      });
    });

    const jsonData = JSON.stringify(data_to_store, null, 2);
    fs.writeFile("./info.json", jsonData, "utf-8", (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("File has been written!");
        resolve();
      }
    });
  });
}

function read_data_json() {
  return new Promise((resolve, reject) => {
    fs.readFile("./info.json", "utf-8", (err, writtenjsonData) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const readjsondata = JSON.parse(writtenjsonData);
        // console.log(readjsondata);
        resolve(readjsondata);
      }
    });
  });
}

function clear_database() {
  const dropTableQuery = "DROP TABLE IF EXISTS parking";

  db.query(dropTableQuery, (err) => {
    if (err) {
      console.error("Error dropping the table:", err);
      return;
    }
    console.log("Table dropped successfully");

    const createTableQuery = `
      CREATE TABLE parking(
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        parking_name VARCHAR(255) NOT NULL, 
        capacity VARCHAR(255) NOT NULL, 
        free_places VARCHAR(255) NOT NULL, 
        date_time DATETIME NOT NULL,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL
      );
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error(`Error creating the table ${err}`);
      }
      console.log("Table created successfully");
    });
  });

  
}

const coordinates_array = [
  {
    name: "Théâtre",
    latitude: 49.616897,
    longitude: 6.124115,
  },
  {
    name: "Saint-Esprit",
    latitude: 49.608402749022,
    longitude: 6.1326583224233,
  },
  {
    name: "Knuedler",
    latitude: 49.608402749022,
    longitude: 6.1326583224233,
  },
  {
    name: "Monterey",
    latitude: 49.608402749022,
    longitude: 6.1326583224233,
  },
  {
    name: "Rond Point Schuman",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Martyrs",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Rocade",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Fort Wedell",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Fort Neipperg",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Luxembourg Sud B",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Auchan",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Place de l'Europe",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Trois Glands",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Erasme",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Coque",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Gare",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Adenauer",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Stade",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Glacis",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Luxexpo",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Gernsback",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Luxembourg Sud A",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Kockelscheuer",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Bouillon",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Beggen",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Brasserie",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Nobilis",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Royal-Hamilius",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Stade de Luxembourg",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Campus Cents",
    latitude: 40.7128,
    longitude: -74.006,
  },
];

function insert_data_database(parking_name, capacity, free_places) {
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");

  let coordinates = coordinates_array.find(o => o.name == parking_name);

  const insertQuery = "INSERT INTO parking (parking_name, capacity, free_places, date_time, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(insertQuery,[parking_name, capacity, free_places, date_time, coordinates.latitude, coordinates.longitude],
    (err, result) => {
      if (err) {
        console.error("Error inserting data", err);
        return;
      }
      // console.log("Data inserted successfully", result.insertId);
    }
  );
}

function update_data_database(name, free_places) {
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");

  // console.log(
  //   `Received an update request: name = ${name}, new_places = ${free_places}, date_time = ${date_time}`
  // );

  const updateQuery =
    "UPDATE parking SET free_places = ?, date_time = ? WHERE parking_name = ?";

  db.query(updateQuery, [free_places, date_time, name], (err, result) => {
    if (err) {
      console.error("Error updating data", err);
      return;
    }
  });
}

async function main() {
  clear_database();

  const web_parking_data = await get_data();
  await store_data_json(web_parking_data);

  for (let i = 0; i < web_parking_data.parking_names_list.length; i++) {
    const parking_name = web_parking_data.parking_names_list[i];
    const parking_capacity = web_parking_data.parking_capacity_list[i];
    const parking_free_places = web_parking_data.parking_free_places_list[i];

    insert_data_database(parking_name, parking_capacity, parking_free_places);
  }

  const checkForUpdates = async () => {
    console.log("new run");

    if (!web_parking_data) {
      console.log("unable to proceed");
      setTimeout(checkForUpdates, 10000);
      return;
    }

    const json_data = await read_data_json();

    for (let i = 0; i < web_parking_data.parking_names_list.length; i++) {
      const name = web_parking_data.parking_names_list[i];
      let free_places_from_new_data =
        web_parking_data.parking_free_places_list[i];

      const parking_info_from_json = json_data.find(
        (parking) => parking.name === name
      );

      if (!free_places_from_new_data) {
        free_places_from_new_data = parking_info_from_json.free_places;
      }

      if (parking_info_from_json.free_places !== free_places_from_new_data) {
        update_data_database(name, free_places_from_new_data);
      }
    }

    setTimeout(checkForUpdates, 15000);
  };

  checkForUpdates();
}

app.listen(8080, () => {
  main();
  console.log("API READY");
});

