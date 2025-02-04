import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./src/db/db.js";
import routes from "./src/routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(json());
connectToDatabase();
const port = process.env.APP_PORT || 3000;

app.use("/api/user/", routes.userRoutes);
app.use("/api/auth/", routes.authRoutes);
app.use("/api/community/", routes.communityRoutes);
app.use("/api/country/", routes.countryRoutes);
app.use("/api/city/", routes.cityRoutes);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
