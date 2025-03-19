import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const main = async () => {
    await connectDB()
    const port = config.port || 3000;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}

main();