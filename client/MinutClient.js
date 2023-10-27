require("dotenv").config();
const axios = require("axios");

class MinutClient {
  constructor() {
    this.ACCESS_TOKEN = "";
    this.USER_ID = "";
    this.organization_ID = "";
  }

  login() {
    axios
      .post("https://api.minut.com/v8/oauth/token", {
        client_id: process.env.MINUT_CLIENT_ID,
        client_secret: process.env.MINUT_CLIENT_SECRET,
        username: process.env.MINUT_USERNAME,
        password: process.env.MINUT_PASSWORD,
        grant_type: "password",
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Login successful");
          console.log("Token: ", response.data);
          this.ACCESS_TOKEN = response.data.access_token;
          this.USER_ID = response.data.user_id;
          this.getOrganization();
        } else {
          console.log("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error occurred while logging in:", error);
      });
  }

  async getOrganization() {
    const organization = await axios
      .get(`https://api.minut.com/v8/organizations?limit=1`, {
        timeout: 1200,
        headers: {
          accept: "application/json, text/plain, */*",
          Referer: "https://web.minut.com/",
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7",
          "content-type": "application/json",
          "sec-ch-ua":
            '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      })
      .then((response) => {
        // console.log("Organization:", response.data);
        this.organization_ID = response.data.organizations[0].id;
        return response.data.organizations[0];
      })
      .catch((error) => {
        console.error("Error occurred while getting organization:", error);
      });

    return organization;
  }

  async getUsers() {
    const users = await axios
      .get(`https://api.minut.com/v8/users/${this.USER_ID}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          Referer: "https://web.minut.com/",
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          "content-type": "application/json",
          "sec-ch-ua":
            '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting users:", error);
      });

    return users;
  }

  async getOrganizations() {
    const organizations = await axios
      .get(`https://api.minut.com/v8/organizations?limit=5`, {
        headers: {
          accept: "application/json, text/plain, */*",
          Referer: "https://web.minut.com/",
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          "content-type": "application/json",
          "sec-ch-ua":
            '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error occurred while getting organizations:", error);
      });

    return organizations;
  }

  async getHomeGroups() {
    const homegroups = await axios
      .get(
        `https://api.minut.com/v8/organizations/${this.organization_ID}/homegroups?role=admin`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            Referer: "https://web.minut.com/",
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting homegroups:", error);
      });

    return homegroups;
  }

  async getDevices() {
    const devices = await axios
      .get(
        `https://api.minut.com/v8/organizations/${this.organization_ID}/devices`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            Referer: "https://web.minut.com/",
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting devices:", error);
      });

    return devices;
  }

  async getEvents() {
    const events = await axios
      .get(
        `https://api.minut.com/v8/events?order=desc&limit=10&offset=0&organization_id=${this.organization_ID}`,
        {
          headers: {
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting events:", error);
      });

    return events;
  }

  async getMotionEvents(deviceId, startAt, endAt, timeResolution, nullFill) {
    const motionevents = await axios
      .get(
        `https://api.minut.com/v8/devices/${deviceId}/motion_events?include_min_max=true&start_at=${startAt}&end_at=${endAt}&time_resolution=${timeResolution}&null_fill=${nullFill}`,
        {
          headers: {
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting events:", error);
      });

    return motionevents;
  }

  async getSubscriptions() {
    const subscriptions = await axios
      .get(
        `https://api.minut.com/v8/subscriptions/available_plans/${this.USER_ID}`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            Referer: "https://web.minut.com/",
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting subscriptions:", error);
      });

    return subscriptions;
  }

  async getFeatures() {
    const features = await axios
      .get(
        `https://api.minut.com/v8/organizations/${this.organization_ID}/feature_availability`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            Referer: "https://web.minut.com/",
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting features:", error);
      });

    return features;
  }

  async getEvents() {
    const events = await axios
      .get(
        `https://api.minut.com/v8/organizations/${this.organization_ID}/feature_availability`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            Referer: "https://web.minut.com/",
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            "content-type": "application/json",
            "sec-ch-ua":
              '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error occurred while getting features:", error);
      });

    return events;
  }
}

module.exports = MinutClient;
