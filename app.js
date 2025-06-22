import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./src/db/db.js";
import routes from "./src/routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import './src/config/mqttServices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(json());
connectToDatabase();
const port = process.env.APP_PORT || 3000;

app.use("/api/user/", routes.userRoutes);
app.use("/api/auth/", routes.authRoutes);
app.use("/api/group/", routes.groupRoutes);
app.use("/api/country/", routes.countryRoutes);
app.use("/api/city/", routes.cityRoutes);
app.use("/api/event/", routes.eventRoutes);
app.use("/api/route/", routes.routeRoutes);
app.use("/api/activity/", routes.activityRoutes);
app.use("/api/station/", routes.stationRoutes);
app.use("/api/station-pocket/", routes.stationPocketRoutes);
app.use("/api/bike/", routes.bikeRoutes);
app.use("/api/bike-rental/", routes.bikeRentalRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
