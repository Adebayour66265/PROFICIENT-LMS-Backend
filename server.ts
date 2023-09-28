require('dotenv').config()
import { app } from "./app";
import connectDB from "./utils/db";


const PORT = 5000;
app.listen(PORT),   () => {
    console.log(`Server is listing on PORT ${PORT}`);
    connectDB();
}