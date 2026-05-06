import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("..", ".env") });
import app from "./src/app.js";
import connectToDB  from "./src/config/db.js"
import {resume, selfDescription, jobDescription} from "./src/services/temp.js"
import generateInterviewReport from "./src/services/ai.services.js"


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
generateInterviewReport(resume, selfDescription, jobDescription).then((report) => {
    console.log("Generated Interview Report:");
    console.log(JSON.stringify(report, null, 2));
}).catch((error) => {
    console.error("Error generating interview report:", error);
}); 
