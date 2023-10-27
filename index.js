const express = require("express");
const app = express();
const PORT = 3000;
const MinutClient = require("./client/MinutClient");

const client = new MinutClient();
client.login();

app.get("/account", async (req, res) => {
  const users = await client.getUsers();
  const homegroups = await client.getHomeGroups();
  const devices = await client.getDevices();
  const subscriptions = await client.getSubscriptions();
  const organization = await client.getOrganization();

  const accountData = {
    organization,
    users,
    homegroups,
    devices,
    subscriptions,
  };

  // console.log(accountData);
  res.json(accountData);
});

app.get("/users", async (req, res) => {
  const users = await client.getUsers();
  res.json(users);
});

app.get("/user/id", async (req, res) => {
  const id = req.params.id;
  const user = await client.getUser(id);
  res.json(user);
});

app.get("/organizations", async (req, res) => {
  const organizations = await client.getOrganizations();
  res.json(organizations);
});

app.get("/organization", async (req, res) => {
  const organization = await client.getOrganization();
  res.json(organization);
});

app.get("/homegroups", async (req, res) => {
  const homegroups = await client.getHomeGroups();
  res.json(homegroups);
});

app.get("/devices", async (req, res) => {
  const devices = await client.getDevices();
  res.json(devices);
});

app.get("/device/:id", async (req, res) => {
  const id = req.params.id;
  const device = await client.getDevice(id);
  res.json(device);
});

app.get("/events", async (req, res) => {
  const events = await client.getEvents();
  res.json(events);
});

app.get("/motionevents/:id", async (req, res) => {
  const deviceId = req.params.id;
  const date = new Date(Date.now());
  const formattedDate = date.toISOString().replace(/:/g, "%3A");
  const endDate = date.setDate(date.getDate() + 1);
  const endDateObj = new Date(endDate);
  const formattedEndDate = endDateObj.toISOString().replace(/:/g, "%3A");
  const start_at = req.params.start ? req.params.start : formattedDate;
  const end_at = req.params.end ? req.params.end : formattedEndDate;
  const time_resolution = req.params.resolution ? req.params.resolution : 900;
  const null_fill = req.params.nullfill ? req.params.nullfill : true;
  const motionEvents = await client.getMotionEvents(
    deviceId,
    start_at,
    end_at,
    time_resolution,
    null_fill
  );
  res.json(motionEvents);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
