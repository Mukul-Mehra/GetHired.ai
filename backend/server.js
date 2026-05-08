import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("..", ".env") });
import app from "./src/app.js";
import connectToDB  from "./src/config/db.js"


async function startServer() {
    await connectToDB();

    app.listen(3000, () => {
        console.log(`server is running on PORT:3000`);
    });
}


startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
